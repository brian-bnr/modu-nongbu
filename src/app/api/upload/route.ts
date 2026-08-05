import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (session?.user?.type !== "user") {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { filename, contentType, size } = (await request.json()) as {
    filename?: string;
    contentType?: string;
    size?: number;
  };

  if (!contentType || !ALLOWED_CONTENT_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 });
  }
  if (typeof size !== "number" || size <= 0 || size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "이미지 용량은 10MB 이하여야 합니다." }, { status: 400 });
  }

  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    return NextResponse.json({ error: "업로드 설정이 올바르지 않습니다." }, { status: 500 });
  }

  const extension = filename?.split(".").pop()?.toLowerCase().slice(0, 10) || "bin";
  const key = `uploads/${randomUUID()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, url });
  } catch {
    return NextResponse.json({ error: "업로드에 실패했습니다." }, { status: 500 });
  }
}
