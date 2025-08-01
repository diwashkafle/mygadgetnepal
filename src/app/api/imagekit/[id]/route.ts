import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await imagekit.deleteFile(id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Image delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
