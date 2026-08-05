export async function uploadImage(file: File): Promise<string> {
  const presignRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });

  if (!presignRes.ok) {
    const { error } = await presignRes.json().catch(() => ({ error: undefined }));
    throw new Error(error ?? "업로드에 실패했습니다.");
  }

  const { uploadUrl, url } = (await presignRes.json()) as { uploadUrl: string; url: string };

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("업로드에 실패했습니다.");
  }

  return url;
}
