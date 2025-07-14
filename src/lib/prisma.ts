// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: "postgresql://postgres:kuxsaz-kyhjo5-kyjwEw@db.njzlhtyepnmqzcgduisq.supabase.co:5432/postgres";
}

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;