import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const skillDir = path.join(process.cwd(), "skills", slug);

  if (!fs.existsSync(skillDir)) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  const chunks: Buffer[] = [];

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("data", (chunk: Buffer) => chunks.push(chunk));

  archive.directory(skillDir, slug);

  await archive.finalize();

  const buffer = Buffer.concat(chunks);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
    },
  });
}
