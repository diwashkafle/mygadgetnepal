export const uploadImagesToImageKit = async (files: File[]) => {
    const uploadedUrls: string[] = [];
  
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
  
      const res = await fetch("/api/imagekit", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      uploadedUrls.push(data.url);
    }
  
    return uploadedUrls;
  };
  