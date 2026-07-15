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
  onParcelSelected,
  region,
}: {
  onParcelSelected: (parcel: SelectedParcel) => void;
  region?: string;
}) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const polygonRef = useRef<{ setMap: (map: unknown) => void } | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [loadingParcel, setLoadingParcel] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SelectedParcel | null>(null);

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

    naver.maps.Event.addListener(map, "click", async (e) => {
      const lat = e.coord.y;
      const lng = e.coord.x;

      setLoadingParcel(true);
      setError("");
      try {
        const res = await fetch(`/api/vworld/parcel?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "필지 조회에 실패했습니다.");
          return;
        }

        polygonRef.current?.setMap(null);
        const naverRings = (data.rings as [number, number][]).map(
          ([rLat, rLng]) => new naver.maps.LatLng(rLat, rLng)
        );
        polygonRef.current = new naver.maps.Polygon({
          map,
          paths: [naverRings],
          fillColor: "#15803d",
          fillOpacity: 0.35,
          strokeColor: "#15803d",
          strokeWeight: 2,
        });

        const parcel: SelectedParcel = {
          pnu: data.pnu,
          jibun: data.jibun,
          areaPyeong: data.areaPyeong,
          areaSqm: data.areaSqm,
          lat,
          lng,
        };
        setSelected(parcel);
        onParcelSelected(parcel);
      } catch {
        setError("필지 조회 중 오류가 발생했습니다.");
      } finally {
        setLoadingParcel(false);
      }
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
      <div
        ref={mapElRef}
        className="h-[55vh] min-h-[360px] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/20 sm:h-[60vh] lg:h-[70vh]"
      />
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        {loadingParcel
          ? "필지 정보를 불러오는 중..."
          : "지도를 클릭해 방제할 필지를 선택하세요."}
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {selected && (
        <div className="mt-2 rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-900/20">
          <p className="font-medium">{selected.jibun ?? "선택된 필지"}</p>
          <p className="mt-1 text-black/60 dark:text-white/60">
            자동 계산된 면적: {selected.areaPyeong}평
          </p>
        </div>
      )}
    </div>
  );
}
