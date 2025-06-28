import { getStorage, ref, deleteObject } from "firebase/storage";

export async function deleteFromFirebase(filePath: string) {
  const storage = getStorage();
  const imageRef = ref(storage, filePath);

  try {
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Firebase deletion failed:", error);
    return false;
  }
}
