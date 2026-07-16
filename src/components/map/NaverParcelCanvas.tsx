"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Script from "next/script";
import { type MapCanvasHandle, type MapCanvasProps, REGION_CENTERS, parcelKey } from "./types";

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

type NaverMapInstance = {
  setCenter: (latlng: unknown) => void;
  setZoom: (zoom: number) => void;
};

type PolygonHandle = { setMap: (map: unknown) => void };

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, options: Record<string, unknown>) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => unknown;
        Polygon: new (options: Record<string, unknown>) => PolygonHandle;
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

export const NaverParcelCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(function NaverParcelCanvas(
  { region, parcels, onMapClick, initialCenter },
  ref
) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const polygonsRef = useRef<Map<string, PolygonHandle>>(new Map());
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  useImperativeHandle(ref, () => ({
    setCenter: (lat, lng, zoom) => {
      if (!mapRef.current || !window.naver) return;
      mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
      if (zoom) mapRef.current.setZoom(zoom);
    },
  }));

  useEffect(() => {
    if (!scriptLoaded || !mapElRef.current || !window.naver) return;

    const naver = window.naver;
    const center = initialCenter ?? (region ? REGION_CENTERS[region] : undefined);
    const map = new naver.maps.Map(mapElRef.current, {
      center: new naver.maps.LatLng(center?.lat ?? 36.5, center?.lng ?? 127.8),
      zoom: center?.zoom ?? 7,
    });
    mapRef.current = map;

    const cadastralLayer = new naver.maps.CadastralLayer();
    cadastralLayer.setMap(map);

    naver.maps.Event.addListener(map, "click", (e) => {
      onMapClick(e.coord.y, e.coord.x);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  useEffect(() => {
    if (!mapRef.current || !region || !window.naver || initialCenter) return;
    const center = REGION_CENTERS[region];
    if (!center) return;
    mapRef.current.setCenter(new window.naver.maps.LatLng(center.lat, center.lng));
    mapRef.current.setZoom(center.zoom);
  }, [region, initialCenter]);

  // 선택된 필지 목록과 실제로 그려진 폴리곤을 동기화한다.
  useEffect(() => {
    if (!mapRef.current || !window.naver) return;
    const naver = window.naver;
    const map = mapRef.current;
    const nextKeys = new Set(parcels.map(parcelKey));

    for (const [key, polygon] of polygonsRef.current) {
      if (!nextKeys.has(key)) {
        polygon.setMap(null);
        polygonsRef.current.delete(key);
      }
    }

    for (const parcel of parcels) {
      const key = parcelKey(parcel);
      if (polygonsRef.current.has(key)) continue;
      const paths = parcel.rings.map(([rLat, rLng]) => new naver.maps.LatLng(rLat, rLng));
      const polygon = new naver.maps.Polygon({
        map,
        paths: [paths],
        fillColor: "#15803d",
        fillOpacity: 0.35,
        strokeColor: "#15803d",
        strokeWeight: 2,
      });
      polygonsRef.current.set(key, polygon);
    }
  }, [parcels]);

  if (!NAVER_MAP_CLIENT_ID || scriptFailed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-black/5 p-4 text-sm text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
        <span>🗺️</span>
        <span>지도를 불러올 수 없어 면적을 직접 입력해주세요.</span>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptFailed(true)}
      />
      <div
        ref={mapElRef}
        className="h-[65vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/20 sm:h-[72vh] lg:h-[82vh]"
      />
    </>
  );
});
