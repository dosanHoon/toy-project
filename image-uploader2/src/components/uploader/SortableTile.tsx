import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormImage } from "./types";
import {
  Tile,
  Media,
  LoadingHolder,
  Spinner,
  Thumb,
  Bar,
  Progress,
  ErrorBadge,
  PrimaryBadge,
  Actions,
} from "./styles";

export function SortableTile({
  id,
  image,
  onClick,
  onRemove,
}: {
  id: string;
  image: FormImage;
  onClick: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Tile
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $primary={image.isPrimary}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Media>
        {image.status === "uploading" ? (
          <LoadingHolder>
            <Spinner />
          </LoadingHolder>
        ) : (
          <Thumb src={image.previewUrl} alt="thumbnail" />
        )}
      </Media>
      <Bar>
        {image.status === "uploading" && (
          <Progress style={{ width: `${image.progress}%` }} />
        )}
        {image.status === "error" && <ErrorBadge>업로드 실패</ErrorBadge>}
        {image.isPrimary && <PrimaryBadge>대표</PrimaryBadge>}
      </Bar>
      <Actions>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          삭제
        </button>
      </Actions>
    </Tile>
  );
}
