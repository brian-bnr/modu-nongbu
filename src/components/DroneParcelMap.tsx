"use client";

import { useRef, useState } from "react";
import { NaverParcelCanvas } from "@/components/map/NaverParcelCanvas";
import { GoogleParcelCanvas } from "@/components/map/GoogleParcelCanvas";
import { type MapCanvasHandle, type SelectedParcel, parcelKey } from "@/components/map/types";
import { CROP_TYPES, RICE_CROP_TYPE, calcTotalPriceByParcel } from "@/lib/cropPricing";
import { formatPrice } from "@/lib/format";

export type { SelectedParcel } from "@/components/map/types";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function DroneParcelMap({
  onParcelsChanged,
  region,
}: {
  onParcelsChanged: (parcels: SelectedParcel[]) => void;
  region?: string;
}) {
  const mapCanvasRef = useRef<MapCanvasHandle | null>(null);
  const parcelsRef = useRef<Map<string, SelectedParcel>>(new Map());
  const [provider, setProvider] = useState<"naver" | "google">("naver");
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
    parcelsRef.current.delete(key);
    const next = Array.from(parcelsRef.current.values());
    setParcels(next);
    onParcelsChanged(next);
  }

  function setParcelCropType(key: string, cropType: string) {
    const existing = parcelsRef.current.get(key);
    if (!existing) return;
    parcelsRef.current.set(key, { ...existing, cropType });
    const next = Array.from(parcelsRef.current.values());
    setParcels(next);
    onParcelsChanged(next);
  }

  async function selectPoint(lat: number, lng: number) {
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
        rings: data.rings as [number, number][],
        cropType: RICE_CROP_TYPE,
      };
      const key = parcelKey(parcel);

      if (parcelsRef.current.has(key)) {
        removeParcel(key);
        return;
      }

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
    mapCanvasRef.current?.setCenter(result.lat, result.lng, 19);
    setAddressResults([]);
    setAddressQuery("");
    await selectPoint(result.lat, result.lng);
  }

  // 일반/위성 지도를 전환할 때 현재까지 선택한 마지막 필지를 기준으로 화면을 다시 잡아준다.
  const lastParcel = parcels[parcels.length - 1];
  const initialCenter = lastParcel ? { lat: lastParcel.lat, lng: lastParcel.lng, zoom: 18 } : undefined;

  const canvasProps = { region, parcels, onMapClick: selectPoint, initialCenter };

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          value={addressQuery}
          onChange={(e) => setAddressQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddressSearch(addressQuery);
            }
          }}
          placeholder="지번 주소로 검색 (예: 서울특별시 중구 태평로1가 31)"
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm disabled:opacity-60 dark:border-white/20 dark:bg-transparent"
        />
        <button
          type="button"
          onClick={() => handleAddressSearch(addressQuery)}
          disabled={searching}
          className="shrink-0 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {searching ? "검색 중..." : "검색"}
        </button>
      </div>
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

      {GOOGLE_MAPS_API_KEY && (
        <div className="mb-2 inline-flex rounded-lg border border-black/10 p-0.5 text-sm dark:border-white/20">
          <button
            type="button"
            onClick={() => setProvider("naver")}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              provider === "naver" ? "bg-brand-700 text-white" : "text-black/60 dark:text-white/60"
            }`}
          >
            일반지도
          </button>
          <button
            type="button"
            onClick={() => setProvider("google")}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              provider === "google" ? "bg-brand-700 text-white" : "text-black/60 dark:text-white/60"
            }`}
          >
            위성지도
          </button>
        </div>
      )}

      {provider === "naver" ? (
        <NaverParcelCanvas ref={mapCanvasRef} {...canvasProps} />
      ) : (
        <GoogleParcelCanvas ref={mapCanvasRef} {...canvasProps} />
      )}

      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        {loadingParcel
          ? "필지 정보를 불러오는 중..."
          : "필지를 클릭하면 추가되고, 선택된 필지를 다시 클릭하면 제외돼요."}
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {parcels.length > 0 && (
        <div className="mt-2 space-y-2 rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-900/20">
          <ul className="space-y-1.5">
            {parcels.map((p) => {
              const key = parcelKey(p);
              return (
                <li key={key} className="flex items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate">
                    {p.jibun ?? "선택된 필지"} · {p.areaPyeong}평
                  </span>
                  <select
                    value={p.cropType}
                    onChange={(e) => setParcelCropType(key, e.target.value)}
                    className="shrink-0 rounded-md border border-black/10 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-black/20"
                  >
                    {CROP_TYPES.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
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
            총 {parcels.length}개 필지 · {parcels.reduce((sum, p) => sum + p.areaPyeong, 0)}평 ·{" "}
            {formatPrice(calcTotalPriceByParcel(parcels))}
          </p>
        </div>
      )}
    </div>
  );
}
