"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

export type SelectedParcel = {
  pnu: string | null;
  jibun: string | null;
  areaPyeong: number;
  areaSqm: number;
  lat: number;
  lng: number;
};

// 시/도 중심 좌표 (지역 선택 시 지도 이동용, 대략적인 도청 소재지 기준)
const REGION_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  서울: { lat: 37.5665, lng: 126.978, zoom: 11 },
  부산: { lat: 35.1796, lng: 129.0756, zoom: 11 },
  대구: { lat: 35.8714, lng: 128.6014, zoom: 11 },
  인천: { lat: 37.4563, lng: 126.7052, zoom: 10 },
  광주: { lat: 35.1595, lng: 126.8526, zoom: 11 },
  대전: { lat: 36.3504, lng: 127.3845, zoom: 11 },
  울산: { lat: 35.5384, lng: 129.3114, zoom: 11 },
  세종: { lat: 36.4801, lng: 127.289, zoom: 11 },
  경기: { lat: 37.4138, lng: 127.5183, zoom: 9 },
  강원: { lat: 37.8228, lng: 128.1555, zoom: 8 },
  충북: { lat: 36.6357, lng: 127.4917, zoom: 9 },
  충남: { lat: 36.5184, lng: 126.8, zoom: 9 },
  전북: { lat: 35.7175, lng: 127.153, zoom: 9 },
  전남: { lat: 34.8161, lng: 126.463, zoom: 9 },
  경북: { lat: 36.4919, lng: 128.8889, zoom: 8 },
  경남: { lat: 35.4606, lng: 128.2132, zoom: 9 },
  제주: { lat: 33.4996, lng: 126.5312, zoom: 10 },
};

type NaverMapInstance = {
  setCenter: (latlng: unknown) => void;
  setZoom: (zoom: number) => void;
};

type PolygonHandle = { setMap: (map: unknown) => void };

function parcelKey(p: { pnu: string | null; jibun: string | null; lat: number; lng: number }) {
  return p.pnu || p.jibun || `${p.lat.toFixed(5)}_${p.lng.toFixed(5)}`;
}

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, options: Record<string, unknown>) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => unknown;
        Polygon: new (options: Record<string, unknown>) => { setMap: (map: unknown) => void };
        CadastralLayer: new () => { setMap: (map: unknown) => void };
        Event: {
          addListener: (
            target: unknown,
            eventName: string,
            handler: (e: { coord: { x: number; y: number } }) => void
          ) => void;
        };
      };
    };
  }
}

export function DroneParcelMap({
  onParcelsChanged,
  region,
}: {
  onParcelsChanged: (parcels: SelectedParcel[]) => void;
  region?: string;
}) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const parcelsRef = useRef<Map<string, SelectedParcel>>(new Map());
  const polygonsRef = useRef<Map<string, PolygonHandle>>(new Map());
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [loadingParcel, setLoadingParcel] = useState(false);
  const [error, setError] = useState("");
  const [parcels, setParcels] = useState<SelectedParcel[]>([]);

  const [addressQuery, setAddressQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [addressResults, setAddressResults] = useState<
    { pnu: string | null; address: string; lat: number; lng: number }[]
  >([]);

  function removeParcel(key: string) {
    polygonsRef.current.get(key)?.setMap(null);
    polygonsRef.current.delete(key);
    parcelsRef.current.delete(key);
    const next = Array.from(parcelsRef.current.values());
    setParcels(next);
    onParcelsChanged(next);
  }

  async function selectPoint(lat: number, lng: number) {
    const naver = window.naver;
    if (!naver || !mapRef.current) return;

    setLoadingParcel(true);
    setError("");
    try {
      const res = await fetch(`/api/vworld/parcel?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "필지 조회에 실패했습니다.");
        return;
      }

      const parcel: SelectedParcel = {
        pnu: data.pnu,
        jibun: data.jibun,
        areaPyeong: data.areaPyeong,
        areaSqm: data.areaSqm,
        lat,
        lng,
      };
      const key = parcelKey(parcel);

      if (parcelsRef.current.has(key)) {
        removeParcel(key);
        return;
      }

      const naverRings = (data.rings as [number, number][]).map(
        ([rLat, rLng]) => new naver.maps.LatLng(rLat, rLng)
      );
      const polygon = new naver.maps.Polygon({
        map: mapRef.current,
        paths: [naverRings],
        fillColor: "#15803d",
        fillOpacity: 0.35,
        strokeColor: "#15803d",
        strokeWeight: 2,
      });
      polygonsRef.current.set(key, polygon);
      parcelsRef.current.set(key, parcel);
      const next = Array.from(parcelsRef.current.values());
      setParcels(next);
      onParcelsChanged(next);
    } catch {
      setError("필지 조회 중 오류가 발생했습니다.");
    } finally {
      setLoadingParcel(false);
    }
  }

  async function handleAddressSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (!mapRef.current) {
      setAddressError("지도를 불러오는 중이에요. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSearching(true);
    setAddressError("");
    setAddressResults([]);
    try {
      const res = await fetch(`/api/vworld/geocode?query=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setAddressError(data.error ?? "주소 검색에 실패했습니다.");
        return;
      }
      const results: { pnu: string | null; address: string; lat: number; lng: number }[] =
        data.results ?? [];
      if (results.length === 0) {
        setAddressError("검색 결과가 없습니다.");
        return;
      }
      if (results.length === 1) {
        await pickAddressResult(results[0]);
        return;
      }
      setAddressResults(results);
    } catch {
      setAddressError("주소 검색 중 오류가 발생했습니다.");
    } finally {
      setSearching(false);
    }
  }

  async function pickAddressResult(result: { lat: number; lng: number }) {
    if (mapRef.current && window.naver) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(result.lat, result.lng));
      mapRef.current.setZoom(19);
    }
    setAddressResults([]);
    setAddressQuery("");
    await selectPoint(result.lat, result.lng);
  }

  useEffect(() => {
    if (!scriptLoaded || !mapElRef.current || !window.naver) return;

    const naver = window.naver;
    const initialCenter = region ? REGION_CENTERS[region] : undefined;
    const map = new naver.maps.Map(mapElRef.current, {
      center: new naver.maps.LatLng(
        initialCenter?.lat ?? 36.5,
        initialCenter?.lng ?? 127.8
      ),
      zoom: initialCenter?.zoom ?? 7,
    });
    mapRef.current = map;

    const cadastralLayer = new naver.maps.CadastralLayer();
    cadastralLayer.setMap(map);

    naver.maps.Event.addListener(map, "click", (e) => {
      selectPoint(e.coord.y, e.coord.x);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  useEffect(() => {
    if (!mapRef.current || !region || !window.naver) return;
    const center = REGION_CENTERS[region];
    if (!center) return;
    mapRef.current.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    mapRef.current.setZoom(center.zoom);
  }, [region]);

  if (!NAVER_MAP_CLIENT_ID || scriptFailed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-black/5 p-4 text-sm text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
        <span>🗺️</span>
        <span>지도를 불러올 수 없어 면적을 직접 입력해주세요.</span>
      </div>
    );
  }

  return (
    <div>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptFailed(true)}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddressSearch(addressQuery);
        }}
        className="mb-2 flex gap-2"
      >
        <input
          type="text"
          value={addressQuery}
          onChange={(e) => setAddressQuery(e.target.value)}
          disabled={!scriptLoaded}
          placeholder={
            scriptLoaded
              ? "지번 주소로 검색 (예: 서울특별시 중구 태평로1가 31)"
              : "지도를 불러오는 중..."
          }
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm disabled:opacity-60 dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="submit"
          disabled={searching || !scriptLoaded}
          className="shrink-0 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {searching ? "검색 중..." : "검색"}
        </button>
      </form>
      {addressError && <p className="mb-2 text-xs text-red-600">{addressError}</p>}
      {addressResults.length > 0 && (
        <ul className="mb-2 space-y-1 rounded-lg border border-black/10 p-2 text-sm dark:border-white/20">
          {addressResults.map((r, i) => (
            <li key={`${r.pnu}_${i}`}>
              <button
                type="button"
                onClick={() => pickAddressResult(r)}
                className="w-full rounded-md px-2 py-1.5 text-left hover:bg-brand-50 dark:hover:bg-brand-900/20"
              >
                {r.address}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div
        ref={mapElRef}
        className="h-[65vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/20 sm:h-[72vh] lg:h-[82vh]"
      />
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        {loadingParcel
          ? "필지 정보를 불러오는 중..."
          : "필지를 클릭하면 추가되고, 선택된 필지를 다시 클릭하면 제외돼요."}
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {parcels.length > 0 && (
        <div className="mt-2 space-y-2 rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-900/20">
          <ul className="space-y-1">
            {parcels.map((p) => {
              const key = parcelKey(p);
              return (
                <li key={key} className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    {p.jibun ?? "선택된 필지"} · {p.areaPyeong}평
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParcel(key)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                    aria-label="필지 제외"
                  >
                    −
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-brand-200 pt-2 font-medium dark:border-brand-800">
            총 {parcels.length}개 필지 · {parcels.reduce((sum, p) => sum + p.areaPyeong, 0)}평
          </p>
        </div>
      )}
    </div>
  );
}
