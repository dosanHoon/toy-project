import React, { useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { mockUploadImage } from "../services/mockUpload";

export type UploaderItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  isPrimary: boolean;
};

export function ImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<UploaderItem[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  const uploadItems = useCallback(async (targets: UploaderItem[]) => {
    if (!targets || targets.length === 0) return;
    let successCount = 0;
    let errorCount = 0;
    await Promise.all(
      targets.map(async (target) => {
        try {
          await mockUploadImage(target.file, (p) => {
            setItems((prev) =>
              prev.map((it) =>
                it.id === target.id ? { ...it, progress: p } : it
              )
            );
          });
          successCount += 1;
          setItems((prev) =>
            prev.map((it) =>
              it.id === target.id
                ? { ...it, status: "success", progress: 100 }
                : it
            )
          );
        } catch (e) {
          errorCount += 1;
          setItems((prev) =>
            prev.map((it) =>
              it.id === target.id ? { ...it, status: "error" } : it
            )
          );
        }
      })
    );
    setToast({
      open: true,
      message: `${targets.length}개 중 성공 ${successCount}개, 실패 ${errorCount}개`,
    });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const newItems: UploaderItem[] = Array.from(files).map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
        isPrimary: false,
      }));
      setItems((prev) => {
        const merged = [...prev, ...newItems];
        if (!merged.some((it) => it.isPrimary) && merged.length > 0) {
          merged[0].isPrimary = true;
        }
        return merged;
      });
      uploadItems(newItems);
    },
    [uploadItems]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFiles]
  );

  const startUploadAll = useCallback(async () => {
    const retryTargets = items.filter((it) => it.status === "error");
    if (retryTargets.length === 0) return;
    setItems((prev) =>
      prev.map((it) =>
        retryTargets.some((t) => t.id === it.id)
          ? { ...it, status: "uploading", progress: 0 }
          : it
      )
    );
    uploadItems(retryTargets);
  }, [items, uploadItems]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const removed = prev.find((it) => it.id === id);
      const next = prev.filter((it) => it.id !== id);
      if (removed?.isPrimary && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  }, []);

  const setPrimary = useCallback((id: string) => {
    setItems((prev) => prev.map((it) => ({ ...it, isPrimary: it.id === id })));
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((it) => it.id === active.id);
      const newIndex = prev.findIndex((it) => it.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      // 대표 이미지 인덱스가 이동한 경우 유지
      const primaryIndex = reordered.findIndex((it) => it.isPrimary);
      if (primaryIndex === -1 && reordered.length > 0) {
        reordered[0] = { ...reordered[0], isPrimary: true };
      }
      return [...reordered];
    });
  }, []);

  const hasUploading = items.some((it) => it.status === "uploading");
  const hasError = items.some((it) => it.status === "error");

  const instruction = useMemo(() => {
    if (items.length === 0) return "이미지를 드래그앤드랍 또는 클릭하여 업로드";
    if (hasUploading) return "업로드 중...";
    return "썸네일을 드래그하여 순서 변경, 클릭으로 대표 지정";
  }, [items.length, hasUploading]);

  return (
    <Wrapper>
      <DropArea
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={onDrop}
      >
        <p>{instruction}</p>
        <Buttons>
          <button onClick={() => inputRef.current?.click()}>파일 선택</button>
          <button onClick={startUploadAll} disabled={!hasError || hasUploading}>
            실패 재시도
          </button>
        </Buttons>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
        />
      </DropArea>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={items.map((it) => it.id)}
          strategy={rectSortingStrategy}
        >
          <Grid>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                onRemove={removeItem}
                onMakePrimary={setPrimary}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>
      <Toast $open={toast.open}>{toast.message}</Toast>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
`;

const DropArea = styled.div`
  border: 2px dashed #9aa0a6;
  background: #fafafa;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  color: #3c4043;

  p {
    margin: 0 0 16px;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;

  button {
    background: #1a73e8;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
  }

  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const Toast = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%)
    translateY(${({ $open }) => ($open ? "0" : "20px")});
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 250ms ease;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px 14px;
  border-radius: 8px;
  pointer-events: none;
  font-size: 14px;
`;
