"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Script from "next/script";
import { type MapCanvasHandle, type MapCanvasProps, REGION_CENTERS, parcelKey } from "./types";
import type { GoogleMapInstance, GoogleMapsNamespace, GooglePolygonHandle } from "@/types/google-maps";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type PolygonHandle = GooglePolygonHandle;

// 구글 위성 지도 위에 VWorld 지적편집도(필지 경계)를 타일로 겹쳐 그린다.
function createCadastralOverlay(maps: GoogleMapsNamespace) {
  return new maps.ImageMapType({
    name: "지적도",
    tileSize: new maps.Size(256, 256),
    minZoom: 15,
    maxZoom: 21,
    opacity: 0.85,
    getTileUrl: (coord: { x: number; y: number }, zoom: number) => {
      if (coord.x < 0 || coord.y < 0) return null;
      return `/api/vworld/cadastral-tile?x=${coord.x}&y=${coord.y}&z=${zoom}`;
    },
  });
}

export const GoogleParcelCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  function GoogleParcelCanvas({ region, parcels, onMapClick, initialCenter }, ref) {
    const mapElRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<GoogleMapInstance | null>(null);
    const polygonsRef = useRef<Map<string, PolygonHandle>>(new Map());
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptFailed, setScriptFailed] = useState(false);

    useImperativeHandle(ref, () => ({
      setCenter: (lat, lng, zoom) => {
        if (!mapRef.current) return;
        mapRef.current.setCenter({ lat, lng });
        if (zoom) mapRef.current.setZoom(zoom);
      },
    }));

    useEffect(() => {
      if (!scriptLoaded || !mapElRef.current || !window.google?.maps) return;

      const maps = window.google.maps;
      const center = initialCenter ?? (region ? REGION_CENTERS[region] : undefined);
      const map = new maps.Map(mapElRef.current, {
        center: { lat: center?.lat ?? 36.5, lng: center?.lng ?? 127.8 },
        zoom: center?.zoom ?? 7,
        mapTypeId: "hybrid",
        streetViewControl: false,
        mapTypeControl: false,
      });
      mapRef.current = map;
      map.overlayMapTypes.push(createCadastralOverlay(maps));

      maps.event.addListener(map, "click", (e) => {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scriptLoaded]);

    useEffect(() => {
      if (!mapRef.current || !region || initialCenter) return;
      const center = REGION_CENTERS[region];
      if (!center) return;
      mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
      mapRef.current.setZoom(center.zoom);
    }, [region, initialCenter]);

    // 선택된 필지 목록과 실제로 그려진 폴리곤을 동기화한다.
    useEffect(() => {
      if (!mapRef.current || !window.google?.maps) return;
      const maps = window.google.maps;
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
        const paths = parcel.rings.map(([rLat, rLng]) => ({ lat: rLat, lng: rLng }));
        const polygon = new maps.Polygon({
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

    if (!GOOGLE_MAPS_API_KEY || scriptFailed) {
      return (
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-black/5 p-4 text-sm text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
          <span>🛰️</span>
          <span>위성 지도를 불러올 수 없어요. 일반 지도를 이용해주세요.</span>
        </div>
      );
    }

    return (
      <>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`}
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
  }
);
