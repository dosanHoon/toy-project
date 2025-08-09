export type FormImage = {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  isPrimary: boolean;
  displayOrder: number;
};

export type UploaderForm = {
  images: FormImage[];
};
