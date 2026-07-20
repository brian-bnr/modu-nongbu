import { BrowseSections } from "@/components/BrowseSections";
import { getHomeData } from "@/lib/homeData";

export default async function ServicesPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const homeData = await getHomeData(sevenDaysAgo.toISOString());

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-bold">서비스</h1>
      <p className="mt-1 text-sm text-black/50">모두의농부의 모든 서비스를 한곳에서 확인하세요.</p>

      <div className="mt-8">
        <BrowseSections {...homeData} />
      </div>
    </div>
  );
}
