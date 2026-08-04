import { NextResponse } from "next/server";

const VWORLD_WMS_ENDPOINT = "https://api.vworld.kr/req/wms";
const TILE_SIZE = 256;
const ORIGIN_SHIFT = (2 * Math.PI * 6378137) / 2.0;
const MIN_ZOOM = 15;

function tileToBBox3857(x: number, y: number, z: number) {
  const tileCount = 2 ** z;
  const minX = (x / tileCount) * 2 * ORIGIN_SHIFT - ORIGIN_SHIFT;
  const maxX = ((x + 1) / tileCount) * 2 * ORIGIN_SHIFT - ORIGIN_SHIFT;
  const maxY = ORIGIN_SHIFT - (y / tileCount) * 2 * ORIGIN_SHIFT;
  const minY = ORIGIN_SHIFT - ((y + 1) / tileCount) * 2 * ORIGIN_SHIFT;
  return [minX, minY, maxX, maxY];
}

// 구글 지도(위성) 위에 지적 경계선을 겹쳐 그리기 위한 타일 프록시.
// VWorld WMS 지적편집도 레이어를 구글 지도 타일 좌표계에 맞춰 잘라 전달한다.
export async function GET(request: Request) {
  const apiKey = process.env.VWORLD_API_KEY;
  if (!apiKey) {
    return new NextResponse(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const x = Number(searchParams.get("x"));
  const y = Number(searchParams.get("y"));
  const z = Number(searchParams.get("z"));
  if (![x, y, z].every(Number.isFinite) || z < MIN_ZOOM) {
    return new NextResponse(null, { status: 204 });
  }

  const [minX, minY, maxX, maxY] = tileToBBox3857(x, y, z);
  const domain = new URL(request.url).hostname;

  const url = new URL(VWORLD_WMS_ENDPOINT);
  url.searchParams.set("service", "WMS");
  url.searchParams.set("request", "GetMap");
  url.searchParams.set("version", "1.3.0");
  url.searchParams.set("layers", "lp_pa_cbnd_bubun");
  url.searchParams.set("styles", "lp_pa_cbnd_bubun");
  url.searchParams.set("crs", "EPSG:3857");
  url.searchParams.set("bbox", `${minX},${minY},${maxX},${maxY}`);
  url.searchParams.set("width", String(TILE_SIZE));
  url.searchParams.set("height", String(TILE_SIZE));
  url.searchParams.set("format", "image/png");
  url.searchParams.set("transparent", "true");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", domain);

  let wmsRes: Response;
  try {
    wmsRes = await fetch(url.toString());
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!wmsRes.ok) {
    return new NextResponse(null, { status: 502 });
  }

  const buffer = await wmsRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
