import { NextResponse } from "next/server";

const VWORLD_ENDPOINT = "https://api.vworld.kr/req/search";

type VWorldSearchItem = {
  id?: string;
  address?: { parcel?: string; road?: string };
  point?: { x?: string; y?: string };
};

type GeocodeResult = { pnu: string | null; address: string; lat: number; lng: number };

async function searchByCategory(
  query: string,
  category: "road" | "parcel",
  apiKey: string,
  domain: string
): Promise<{ items: VWorldSearchItem[]; error?: string }> {
  const url = new URL(VWORLD_ENDPOINT);
  url.searchParams.set("service", "search");
  url.searchParams.set("request", "search");
  url.searchParams.set("version", "2.0");
  url.searchParams.set("query", query);
  url.searchParams.set("type", "address");
  url.searchParams.set("category", category);
  url.searchParams.set("crs", "EPSG:4326");
  url.searchParams.set("format", "json");
  url.searchParams.set("size", "10");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", domain);

  let vworldRes: Response;
  try {
    vworldRes = await fetch(url.toString());
  } catch {
    return { items: [], error: "주소 검색에 실패했습니다." };
  }

  if (!vworldRes.ok) {
    return { items: [], error: "주소 검색에 실패했습니다." };
  }

  const body = await vworldRes.json();

  if (body?.response?.status === "ERROR") {
    const errorText = body.response.error?.text ?? "알 수 없는 오류";
    console.error("VWorld search error:", body.response.error);
    return { items: [], error: `주소 검색에 실패했습니다 (${errorText}).` };
  }

  return { items: body?.response?.result?.items ?? [] };
}

export async function GET(request: Request) {
  const apiKey = process.env.VWORLD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "주소 검색 기능이 아직 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  if (!query) {
    return NextResponse.json({ error: "검색할 주소를 입력해주세요." }, { status: 400 });
  }

  const domain = new URL(request.url).hostname;

  // 도로명/건물명(예: "안양판교로42 인덕원마을삼성아파트")을 우선 시도하고,
  // 결과가 없으면 지번 주소(예: "관양동 1510-1")로 다시 시도한다.
  const road = await searchByCategory(query, "road", apiKey, domain);
  const parcel =
    road.items.length > 0 ? { items: [] as VWorldSearchItem[] } : await searchByCategory(query, "parcel", apiKey, domain);

  if (road.items.length === 0 && parcel.items.length === 0 && (road.error || parcel.error)) {
    return NextResponse.json({ error: road.error ?? parcel.error }, { status: 502 });
  }

  const seen = new Set<string>();
  const results: GeocodeResult[] = [];
  for (const item of [...road.items, ...parcel.items]) {
    const lat = Number(item.point?.y);
    const lng = Number(item.point?.x);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const id = item.id ?? `${lat}_${lng}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const label = item.address?.road || item.address?.parcel || "";

    results.push({ pnu: item.id ?? null, address: label, lat, lng });
  }

  return NextResponse.json({ results: results.slice(0, 8) });
}
