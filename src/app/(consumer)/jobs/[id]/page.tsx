import { PostDetail } from "@/components/PostDetail";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetail id={id} allowedTypes={["FIND_WORKER", "LOOKING_FOR_WORK"]} basePath="/jobs" />;
}
