import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function deleteFromFirebase(filePath: string) {
  const imageRef = ref(storage, filePath);

  try {
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Firebase deletion failed:", error);
    return false;
  }
}
