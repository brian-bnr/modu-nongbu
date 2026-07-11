"use client";

import { useActionState, useState } from "react";
import {
  createDroneReservation,
  type DroneReservationActionState,
} from "@/lib/actions/droneReservation";
import { formatPrice } from "@/lib/format";
import { DroneParcelMap, type SelectedParcel } from "@/components/DroneParcelMap";

const REGIONS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const initialState: DroneReservationActionState = { status: "idle" };

export function DroneReservationForm({ unitPrice }: { unitPrice: number }) {
  const [state, formAction, isPending] = useActionState(createDroneReservation, initialState);
  const fieldClass =
    "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

  const [region, setRegion] = useState("");
  const [regionDetail, setRegionDetail] = useState("");
  const [areaPyeong, setAreaPyeong] = useState("");
  const [cropType, setCropType] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [mode, setMode] = useState<"map" | "manual">("map");
  const [parcel, setParcel] = useState<SelectedParcel | null>(null);

  function handleParcelSelected(selected: SelectedParcel) {
    setParcel(selected);
    setAreaPyeong(String(selected.areaPyeong));
  }

  const area = Number(areaPyeong) || 0;
  const estimate = area * unitPrice;

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">지역 (시/도)</label>
          <select
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={fieldClass}
          >
            <option value="">지역을 선택하세요</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {state.errors?.region && (
            <p className="mt-1 text-xs text-red-600">{state.errors.region[0]}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">상세지역 (선택)</label>
          <input
            name="regionDetail"
            value={regionDetail}
            onChange={(e) => setRegionDetail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">방제 면적</label>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "map" ? "manual" : "map");
              setParcel(null);
              setAreaPyeong("");
            }}
            className="text-xs text-brand-700 hover:underline dark:text-brand-400"
          >
            {mode === "map" ? "면적 직접 입력" : "지도에서 필지 선택"}
          </button>
        </div>

        {mode === "map" ? (
          <div className="mt-2">
            <DroneParcelMap onParcelSelected={handleParcelSelected} />
          </div>
        ) : (
          <input
            type="number"
            min={1}
            value={areaPyeong}
            onChange={(e) => setAreaPyeong(e.target.value)}
            placeholder="평 단위로 입력"
            className={`mt-1 ${fieldClass}`}
          />
        )}

        <input type="hidden" name="areaPyeong" value={areaPyeong} />
        <input type="hidden" name="parcelPnu" value={parcel?.pnu ?? ""} />
        <input type="hidden" name="parcelJibun" value={parcel?.jibun ?? ""} />
        <input type="hidden" name="parcelAreaSqm" value={parcel?.areaSqm ?? ""} />
        {state.errors?.areaPyeong && (
          <p className="mt-1 text-xs text-red-600">{state.errors.areaPyeong[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">작물 종류</label>
        <input
          name="cropType"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          placeholder="벼, 배추, 고추 등"
          className={fieldClass}
        />
        {state.errors?.cropType && (
          <p className="mt-1 text-xs text-red-600">{state.errors.cropType[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">희망 작업일</label>
        <input
          type="date"
          name="desiredDate"
          value={desiredDate}
          onChange={(e) => setDesiredDate(e.target.value)}
          className={fieldClass}
        />
        {state.errors?.desiredDate && (
          <p className="mt-1 text-xs text-red-600">{state.errors.desiredDate[0]}</p>
        )}
      </div>

      <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
        <p className="text-sm text-black/60 dark:text-white/60">예상 견적</p>
        <p className="mt-1 text-2xl font-bold text-brand-800 dark:text-brand-300">
          {formatPrice(estimate)}
        </p>
        <p className="mt-1 text-xs text-black/40 dark:text-white/40">
          평당 {formatPrice(unitPrice)} × {area || 0}평
        </p>
        <p className="mt-3 text-xs text-black/50 dark:text-white/50">
          신청 후 결제하시면 대금은 에스크로(구매안전서비스)에 보관되며, 방제 작업이 완료되고
          승인하시면 방제사에게 정산됩니다.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "신청 중..." : "신청하기"}
      </button>
    </form>
  );
}
