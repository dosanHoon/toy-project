// 1초 정도 소요되고, 30% 확률로 실패하는 목업 업로드 함수
export async function mockUploadImage(
  _file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const durationMs = 10000;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / durationMs) * 100));
      onProgress?.(p);
      if (elapsed >= durationMs) {
        const failed = Math.random() < 0.3;
        if (failed) {
          reject(new Error("업로드 실패"));
        } else {
          resolve({
            url:
              "https://example.com/image/" +
              Math.random().toString(36).slice(2),
          });
        }
        return;
      }
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}
