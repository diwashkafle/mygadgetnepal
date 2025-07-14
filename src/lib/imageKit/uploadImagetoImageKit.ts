export const uploadImagesToImageKit = async (files: File[]) => {
  const uploaded: { url: string; fileId: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const res = await fetch("/api/imagekit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    uploaded.push({ url: data.url, fileId: data.fileId });
  }

  return uploaded;
};
