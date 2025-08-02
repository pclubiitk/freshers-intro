export const compressImage = (
  file: File,
  maxWidth = 1000,
  quality = 0.7
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      image.src = e.target.result as string;
    };

    image.onload = () => {
      const canvas = document.createElement("canvas");

      // Resize maintaining aspect ratio
      const scale = maxWidth / image.width;
      canvas.width = Math.min(image.width, maxWidth);
      canvas.height = image.height * scale;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        "image/jpeg",
        quality // 0.0 - 1.0
      );
    };

    image.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export async function fetchImageAsFileAndPreview(
  url: string
): Promise<{ file: File; preview: string }> {
  const response = await fetch(url);
  const blob = await response.blob();

  const lastPart = url.split("/").pop();

  const extractedFilename = lastPart?.split("---").pop()  ;

  // Convert blob to base64 for preview
  const preview = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const file = new File([blob], extractedFilename || `image.${blob.type}`, { type: blob.type });

  return { file, preview };
}
