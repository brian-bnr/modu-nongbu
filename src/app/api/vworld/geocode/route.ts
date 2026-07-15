import { NextResponse } from "next/server";

const VWORLD_ENDPOINT = "https://api.vworld.kr/req/search";

type VWorldSearchItem = {
  id?: string;
  address?: { parcel?: string; road?: string };
  point?: { x?: string; y?: string };
};

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

  const url = new URL(VWORLD_ENDPOINT);
  url.searchParams.set("service", "search");
  url.searchParams.set("request", "search");
  url.searchParams.set("version", "2.0");
  url.searchParams.set("query", query);
  url.searchParams.set("type", "address");
  url.searchParams.set("category", "parcel");
  url.searchParams.set("crs", "EPSG:4326");
  url.searchParams.set("format", "json");
  url.searchParams.set("size", "5");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", domain);

  let vworldRes: Response;
  try {
    vworldRes = await fetch(url.toString());
  } catch {
    return NextResponse.json({ error: "주소 검색에 실패했습니다." }, { status: 502 });
  }

  if (!vworldRes.ok) {
    return NextResponse.json({ error: "주소 검색에 실패했습니다." }, { status: 502 });
  }

  const body = await vworldRes.json();

  if (body?.response?.status === "ERROR") {
    const errorText = body.response.error?.text ?? "알 수 없는 오류";
    console.error("VWorld search error:", body.response.error);
    return NextResponse.json(
      { error: `주소 검색에 실패했습니다 (${errorText}).` },
      { status: 502 }
    );
  }

  const items: VWorldSearchItem[] = body?.response?.result?.items ?? [];

  const results = items
    .map((item) => {
      const lat = Number(item.point?.y);
      const lng = Number(item.point?.x);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return {
        pnu: item.id ?? null,
        address: item.address?.parcel || item.address?.road || "",
        lat,
        lng,
      };
    })
    .filter((r): r is { pnu: string | null; address: string; lat: number; lng: number } => r !== null);

  return NextResponse.json({ results });
}
