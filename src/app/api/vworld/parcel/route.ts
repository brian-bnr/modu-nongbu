import { NextResponse } from "next/server";
import { polygonAreaSqm, sqmToPyeong } from "@/lib/geo";

const VWORLD_ENDPOINT = "https://api.vworld.kr/req/data";

type VWorldFeature = {
  geometry?: { type: string; coordinates: unknown };
  properties?: Record<string, unknown>;
};

function pickProp(properties: Record<string, unknown> | undefined, keys: string[]) {
  if (!properties) return undefined;
  for (const key of keys) {
    const value = properties[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function extractOuterRing(geometry: VWorldFeature["geometry"]): [number, number][] | null {
  if (!geometry) return null;
  const coords = geometry.coordinates;
  // Polygon: [[[lng,lat], ...]] / MultiPolygon: [[[[lng,lat], ...]]]
  if (geometry.type === "Polygon" && Array.isArray(coords)) {
    const outer = (coords as unknown[])[0];
    if (Array.isArray(outer)) return outer as [number, number][];
  }
  if (geometry.type === "MultiPolygon" && Array.isArray(coords)) {
    const firstPolygon = (coords as unknown[])[0];
    if (Array.isArray(firstPolygon)) {
      const outer = (firstPolygon as unknown[])[0];
      if (Array.isArray(outer)) return outer as [number, number][];
    }
  }
  return null;
}

export async function GET(request: Request) {
  const apiKey = process.env.VWORLD_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "지도 필지 조회 기능이 아직 설정되지 않았습니다. 면적을 직접 입력해주세요." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "잘못된 좌표입니다." }, { status: 400 });
  }

  const domain = new URL(request.url).hostname;

  const url = new URL(VWORLD_ENDPOINT);
  url.searchParams.set("service", "data");
  url.searchParams.set("request", "GetFeature");
  url.searchParams.set("data", "LP_PA_CBND_BUBUN");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", domain);
  url.searchParams.set("geomFilter", `POINT(${lng} ${lat})`);
  url.searchParams.set("geometry", "true");
  url.searchParams.set("crs", "EPSG:4326");
  url.searchParams.set("format", "json");
  url.searchParams.set("size", "1");

  let vworldRes: Response;
  try {
    vworldRes = await fetch(url.toString());
  } catch {
    return NextResponse.json({ error: "지적 정보 조회에 실패했습니다." }, { status: 502 });
  }

  if (!vworldRes.ok) {
    return NextResponse.json({ error: "지적 정보 조회에 실패했습니다." }, { status: 502 });
  }

  const body = await vworldRes.json();

  if (body?.response?.status === "ERROR") {
    const errorText = body.response.error?.text ?? "알 수 없는 오류";
    console.error("VWorld GetFeature error:", body.response.error);
    return NextResponse.json(
      { error: `지적 정보 조회에 실패했습니다 (${errorText}).` },
      { status: 502 }
    );
  }

  const features: VWorldFeature[] =
    body?.response?.result?.featureCollection?.features ?? [];

  if (features.length === 0) {
    return NextResponse.json(
      { error: "선택한 위치에서 필지를 찾을 수 없습니다. 지도를 조금 더 확대해서 다시 클릭해주세요." },
      { status: 404 }
    );
  }

  const feature = features[0];
  const ring = extractOuterRing(feature.geometry);
  if (!ring) {
    return NextResponse.json({ error: "필지 경계 정보를 불러올 수 없습니다." }, { status: 502 });
  }

  const areaSqm = polygonAreaSqm(ring);
  const areaPyeong = Math.round(sqmToPyeong(areaSqm));
  const pnu = pickProp(feature.properties, ["pnu", "PNU"]);
  const jibun = pickProp(feature.properties, ["jibun", "JIBUN", "addr", "ADDR"]);

  return NextResponse.json({
    pnu: pnu ?? null,
    jibun: jibun ?? null,
    areaSqm,
    areaPyeong,
    rings: ring.map(([rLng, rLat]) => [rLat, rLng]),
  });
}
