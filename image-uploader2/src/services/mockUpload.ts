export async function mockUploadImage(
  _file: File,
  onProgress?: (p: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const durationMs = 1000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.round((elapsed / durationMs) * 100));
      onProgress?.(p);
      if (elapsed >= durationMs) {
        const failed = Math.random() < 0.3;
        if (failed) reject(new Error("업로드 실패"));
        else
          resolve({
            url: "https://example.com/" + Math.random().toString(36).slice(2),
          });
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
