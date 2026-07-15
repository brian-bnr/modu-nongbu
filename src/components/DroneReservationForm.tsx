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

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm dark:border-white/20 dark:bg-transparent";

function FieldSection({
  icon,
  accent,
  label,
  action,
  children,
  error,
}: {
  icon: string;
  accent: string;
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${accent}`}
          >
            {icon}
          </span>
          <label className="text-sm font-medium">{label}</label>
        </div>
        {action}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function DroneReservationForm({ unitPrice }: { unitPrice: number }) {
  const [state, formAction, isPending] = useActionState(createDroneReservation, initialState);

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
    <form
      action={formAction}
      className="max-w-lg space-y-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <FieldSection
        icon="📍"
        accent="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        label="지역"
        error={state.errors?.region?.[0]}
      >
        <div className="flex gap-3">
          <select
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`${fieldClass} flex-1`}
          >
            <option value="">시/도 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            name="regionDetail"
            value={regionDetail}
            onChange={(e) => setRegionDetail(e.target.value)}
            placeholder="상세지역 (선택)"
            className={`${fieldClass} flex-1`}
          />
        </div>
      </FieldSection>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      <FieldSection
        icon="📐"
        accent="bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
        label="방제 면적"
        error={state.errors?.areaPyeong?.[0]}
        action={
          <button
            type="button"
            onClick={() => {
              setMode(mode === "map" ? "manual" : "map");
              setParcel(null);
              setAreaPyeong("");
            }}
            className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-400"
          >
            {mode === "map" ? "면적 직접 입력" : "지도에서 필지 선택"}
          </button>
        }
      >
        {mode === "map" ? (
          <DroneParcelMap onParcelSelected={handleParcelSelected} region={region} />
        ) : (
          <input
            type="number"
            min={1}
            value={areaPyeong}
            onChange={(e) => setAreaPyeong(e.target.value)}
            placeholder="평 단위로 입력"
            className={fieldClass}
          />
        )}
        <input type="hidden" name="areaPyeong" value={areaPyeong} />
        <input type="hidden" name="parcelPnu" value={parcel?.pnu ?? ""} />
        <input type="hidden" name="parcelJibun" value={parcel?.jibun ?? ""} />
        <input type="hidden" name="parcelAreaSqm" value={parcel?.areaSqm ?? ""} />
      </FieldSection>

      <div className="h-px bg-black/5 dark:bg-white/10" />

      <FieldSection
        icon="🌾"
        accent="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
        label="작물 종류"
        error={state.errors?.cropType?.[0]}
      >
        <input
          name="cropType"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          placeholder="벼, 배추, 고추 등"
          className={fieldClass}
        />
      </FieldSection>

      <FieldSection
        icon="📅"
        accent="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        label="희망 작업일"
        error={state.errors?.desiredDate?.[0]}
      >
        <input
          type="date"
          name="desiredDate"
          value={desiredDate}
          onChange={(e) => setDesiredDate(e.target.value)}
          className={fieldClass}
        />
      </FieldSection>

      <div className="rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 to-brand-100/60 p-4 dark:border-brand-800 dark:from-brand-900/30 dark:to-brand-900/10">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm text-white">
            💰
          </span>
          <p className="text-sm font-medium text-black/60 dark:text-white/60">예상 견적</p>
        </div>
        <p className="mt-2 text-3xl font-bold text-brand-800 dark:text-brand-300">
          {formatPrice(estimate)}
        </p>
        <p className="mt-1 text-xs text-black/40 dark:text-white/40">
          평당 {formatPrice(unitPrice)} × {area || 0}평
        </p>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-black/50 dark:text-white/50">
          <span>🔒</span>
          <span>
            신청 후 결제하시면 대금은 에스크로(구매안전서비스)에 보관되며, 방제 작업이 완료되고
            승인하시면 방제사에게 정산됩니다.
          </span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-60"
      >
        {isPending ? "신청 중..." : "신청하기"}
      </button>
    </form>
  );
}
