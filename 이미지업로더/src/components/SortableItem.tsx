import React from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UploaderItem } from "./ImageUploader";

type Props = {
  id: string;
  item: UploaderItem;
  onRemove: (id: string) => void;
  onMakePrimary: (id: string) => void;
};

export function SortableItem({ id, item, onRemove, onMakePrimary }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Tile
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $primary={item.isPrimary}
      onClick={(e) => {
        // 드래그 시작 등의 이벤트와 충돌 방지용 버블 최소화
        e.stopPropagation();
        onMakePrimary(item.id);
      }}
    >
      {item.status === "uploading" ? (
        <LoadingHolder>
          <Spinner />
        </LoadingHolder>
      ) : (
        <Thumb src={item.previewUrl} alt="thumbnail" />
      )}
      <Bar>
        {item.status === "uploading" && (
          <Progress style={{ width: `${item.progress}%` }} />
        )}
        {item.status === "error" && <ErrorBadge>업로드 실패</ErrorBadge>}
        {item.isPrimary && <PrimaryBadge>대표</PrimaryBadge>}
      </Bar>
      <Actions>
        <button onClick={() => onRemove(item.id)}>삭제</button>
      </Actions>
    </Tile>
  );
}

const Tile = styled.div<{ $primary: boolean }>`
  position: relative;
  border: 2px solid ${({ $primary }) => ($primary ? "#1a73e8" : "transparent")};
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
  min-height: 140px;
`;

const Thumb = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
`;

const LoadingHolder = styled.div`
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Bar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
  height: 4px;
  background: rgba(0, 0, 0, 0.08);
`;

const Progress = styled.div`
  height: 100%;
  background: #1a73e8;
  transition: width 0.2s ease;
`;

const ErrorBadge = styled.div`
  position: absolute;
  left: 8px;
  top: -22px;
  background: #d93025;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

const PrimaryBadge = styled.div`
  position: absolute;
  right: 8px;
  top: -22px;
  background: #1a73e8;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

const Actions = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 32px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 6px;
  justify-content: center;

  button {
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 6px;
    padding: 4px 6px;
    cursor: pointer;
    font-size: 12px;
  }
`;
