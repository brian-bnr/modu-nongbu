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

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, options: Record<string, unknown>) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
        Polygon: new (options: Record<string, unknown>) => { setMap: (map: unknown) => void };
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
}: {
  onParcelSelected: (parcel: SelectedParcel) => void;
}) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);
  const polygonRef = useRef<{ setMap: (map: unknown) => void } | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [loadingParcel, setLoadingParcel] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SelectedParcel | null>(null);

  useEffect(() => {
    if (!scriptLoaded || !mapElRef.current || !window.naver) return;

    const naver = window.naver;
    const map = new naver.maps.Map(mapElRef.current, {
      center: new naver.maps.LatLng(36.5, 127.8),
      zoom: 7,
    });
    mapRef.current = map;

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

  if (!NAVER_MAP_CLIENT_ID || scriptFailed) {
    return (
      <div className="rounded-lg border border-black/10 bg-black/5 p-4 text-sm text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
        지도를 불러올 수 없어 면적을 직접 입력해주세요.
      </div>
    );
  }

  return (
    <div>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptFailed(true)}
      />
      <div
        ref={mapElRef}
        className="h-72 w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/20"
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
