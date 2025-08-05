export const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 1080;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject("Compression failed"),
        "image/jpeg",
        0.7
      );
    };

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




export async function fetchImageAsFileAndPreview(url: string): Promise<{ file: File, preview: string }> {
    const response = await fetch(url, {
      method: "GET"
    });
    const blob = await response.blob();

    // Get original filename from URL if needed
    const filename = url.split("/").pop() || "image.jpg";
    // Convert blob to base64 for preview
    const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const file = new File([blob], filename, { type: blob.type });

    return { file, preview };
}
