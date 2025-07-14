export const deleteFromImageKit = async (fileId: string) => {
    try {
      const res = await fetch("/api/imagekit/"+{fileId}, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete image from ImageKit");
      }
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("ImageKit delete error:", error);
      throw error;
    }
  };
  