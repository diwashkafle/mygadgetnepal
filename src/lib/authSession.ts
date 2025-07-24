import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ This is all you need — no headers/cookies needed manually
export async function getAuthSession() {
  return await getServerSession(authOptions);
}
