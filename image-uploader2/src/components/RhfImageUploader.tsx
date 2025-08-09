import React, { useCallback, useMemo, useRef } from "react";
// styled-components are imported from ./uploader/styles
import { useForm, useFieldArray } from "react-hook-form";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { mockUploadImage } from "../services/mockUpload";
import type { FormImage, UploaderForm } from "./uploader/types";
import { SortableTile } from "./uploader/SortableTile";
import {
  Wrapper,
  DropArea,
  Buttons,
  HiddenInput,
  Grid,
  Toast,
} from "./uploader/styles";

// types moved to ./uploader/types

export function RhfImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { control, watch, setValue } = useForm<UploaderForm>({
    defaultValues: { images: [] },
  });
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "images",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  const images = watch("images");

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const baseOrder = images.length;
      const newItems: FormImage[] = Array.from(files).map((file, i) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
          .toString(36)
          .slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
        isPrimary: false,
        displayOrder: baseOrder + i,
      }));
      append(newItems);
      const merged = [...images, ...newItems];
      if (!merged.some((it) => it.isPrimary) && merged.length > 0) {
        update(0, { ...merged[0], isPrimary: true });
      }
      startUpload(newItems.map((it) => it.id));
    },
    [append, images, update]
  );

  const startUpload = useCallback(
    async (ids: string[]) => {
      const current = watch("images");
      let success = 0;
      let fail = 0;
      await Promise.all(
        ids.map(async (id) => {
          const idx = current.findIndex((it) => it.id === id);
          if (idx < 0) return;
          try {
            await mockUploadImage(current[idx].file, (p) => {
              setValue(`images.${idx}.progress`, p);
            });
            success += 1;
            setValue(`images.${idx}.status`, "success");
            setValue(`images.${idx}.progress`, 100);
          } catch {
            fail += 1;
            setValue(`images.${idx}.status`, "error");
          }
        })
      );
      setToast(`${ids.length}개 중 성공 ${success}개, 실패 ${fail}개`);
    },
    [setValue, watch]
  );

  const setPrimaryIndex = useCallback(
    (index: number) => {
      const curr = watch("images");
      curr.forEach((_, i) => setValue(`images.${i}.isPrimary`, i === index));
    },
    [setValue, watch]
  );

  const setPrimary = useCallback(
    (fieldId: string) => {
      const idx = fields.findIndex((f) => f.id === fieldId);
      if (idx < 0) return;
      setPrimaryIndex(idx);
    },
    [fields, setPrimaryIndex]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over || active.id === over.id) return;
      const from = fields.findIndex((f) => f.id === active.id);
      const to = fields.findIndex((f) => f.id === over.id);
      if (from < 0 || to < 0) return;
      move(from, to);
      // 재정렬 후 displayOrder를 현재 배열 순서대로 재설정
      setTimeout(() => {
        const curr = watch("images");
        curr.forEach((_, idx) => setValue(`images.${idx}.displayOrder`, idx));
      }, 0);
    },
    [fields, move]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [addFiles]
  );

  const hasUploading = useMemo(
    () => images.some((i) => i.status === "uploading"),
    [images]
  );
  const hasError = useMemo(
    () => images.some((i) => i.status === "error"),
    [images]
  );

  const onRetry = useCallback(() => {
    const retryIds = images
      .filter((i) => i.status === "error")
      .map((i) => i.id);
    retryIds.forEach((id) => {
      const idx = images.findIndex((i) => i.id === id);
      if (idx >= 0) {
        setValue(`images.${idx}.status`, "uploading");
        setValue(`images.${idx}.progress`, 0);
      }
    });
    startUpload(retryIds);
  }, [images, setValue, startUpload]);

  const onRemove = useCallback(
    (fieldId: string) => {
      const idx = fields.findIndex((f) => f.id === fieldId);
      if (idx < 0) return;
      const removedIsPrimary = images[idx]?.isPrimary;
      remove(idx);
      if (removedIsPrimary) {
        setTimeout(() => {
          const curr = watch("images");
          if (curr.length === 0) return;
          const hasPrimary = curr.some((n) => n.isPrimary);
          if (!hasPrimary) {
            const nextIndex = Math.min(idx, curr.length - 1);
            setPrimaryIndex(nextIndex);
          }
        }, 0);
      }
    },
    [fields, images, remove, setPrimaryIndex, watch]
  );

  const [toast, setToast] = React.useState("");

  return (
    <Wrapper>
      <DropArea onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        <p>
          {images.length === 0
            ? "이미지를 드래그앤드랍 또는 클릭하여 업로드"
            : hasUploading
            ? "업로드 중..."
            : "썸네일 드래그로 순서 변경, 클릭으로 대표 지정"}
        </p>
        <Buttons>
          <button type="button" onClick={() => inputRef.current?.click()}>
            파일 선택
          </button>
          <button
            type="button"
            onClick={onRetry}
            disabled={!hasError || hasUploading}
          >
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
          items={fields.map((f) => f.id)}
          strategy={rectSortingStrategy}
        >
          <Grid>
            {fields.map((field, index) => (
              <SortableTile
                key={field.id}
                id={field.id}
                image={images[index]}
                onClick={() => setPrimary(field.id)}
                onRemove={() => onRemove(field.id)}
              />
            ))}
          </Grid>
        </SortableContext>
      </DndContext>

      <Toast $open={!!toast}>{toast}</Toast>
    </Wrapper>
  );
}
