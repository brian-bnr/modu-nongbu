"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { startWork, endWork, uploadWorkPhoto } from "@/lib/actions/droneReservation";
import { Badge } from "@/components/Badge";
import {
  DRONE_RESERVATION_STATUS_LABEL,
  DRONE_RESERVATION_STATUS_VARIANT,
  formatDate,
  formatPrice,
} from "@/lib/format";
import type { DroneReservation, DroneReservationStatus, DroneWorkPhoto } from "@prisma/client";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("이 기기에서는 위치 확인을 지원하지 않습니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
  });
}

export function DroneOperatorJobPanel({
  reservation,
  photos,
}: {
  reservation: DroneReservation;
  photos: DroneWorkPhoto[];
}) {
  const [status, setStatus] = useState<DroneReservationStatus>(reservation.status);
  const [photoList, setPhotoList] = useState(photos);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actualAreaPyeong, setActualAreaPyeong] = useState(String(reservation.areaPyeong));

  async function handleStart() {
    setError("");
    setBusy(true);
    try {
      const pos = await getPosition();
      await startWork(reservation.id, pos.coords.latitude, pos.coords.longitude);
      setStatus("IN_PROGRESS");
    } catch (err) {
      setError(err instanceof Error ? err.message : "작업 시작에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEnd() {
    const area = Number(actualAreaPyeong);
    if (!Number.isFinite(area) || area <= 0) {
      setError("실제 작업 면적을 올바르게 입력해주세요.");
      return;
    }

    setError("");
    setBusy(true);
    try {
      const pos = await getPosition();
      await endWork(reservation.id, pos.coords.latitude, pos.coords.longitude, area);
      setStatus("COMPLETION_REQUESTED");
    } catch (err) {
      setError(err instanceof Error ? err.message : "작업 종료에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("이미지 용량은 10MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      let lat: number | undefined;
      let lng: number | undefined;
      try {
        const pos = await getPosition();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        // 위치 확인 실패해도 사진 업로드는 계속 진행
      }

      await uploadWorkPhoto(reservation.id, blob.url, lat, lng);
      setPhotoList((prev) => [
        ...prev,
        {
          id: blob.url,
          reservationId: reservation.id,
          url: blob.url,
          lat: lat ?? null,
          lng: lng ?? null,
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "사진 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">작업 상세</h1>
        <Badge variant={DRONE_RESERVATION_STATUS_VARIANT[status]}>
          {DRONE_RESERVATION_STATUS_LABEL[status]}
        </Badge>
      </div>

      <div className="mt-6 space-y-3 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">지역</span>
          <span>
            {reservation.region}
            {reservation.regionDetail ? ` ${reservation.regionDetail}` : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">작물</span>
          <span>{reservation.cropType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">면적</span>
          <span>{reservation.areaPyeong}평</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black/50 dark:text-white/50">희망 작업일</span>
          <span>{formatDate(reservation.desiredDate)}</span>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-3 font-medium dark:border-white/10">
          <span>정산 예정 금액(수수료 차감 전)</span>
          <span>{formatPrice(reservation.totalPrice)}</span>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {status === "ASSIGNED" && (
          <button
            type="button"
            onClick={handleStart}
            disabled={busy}
            className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {busy ? "위치 확인 중..." : "작업 시작 (GPS 기록)"}
          </button>
        )}

        {status === "IN_PROGRESS" && (
          <>
            <div>
              <label className="block text-sm font-medium">작업 사진 업로드</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {photoList.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt=""
                    className="h-20 w-20 rounded-md border border-black/10 object-cover dark:border-white/20"
                  />
                ))}
              </div>
              <label className="mt-2 inline-block cursor-pointer rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
                {uploading ? "업로드 중..." : "사진 추가"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium">실제 작업 면적 (평)</label>
              <input
                type="number"
                min={1}
                value={actualAreaPyeong}
                onChange={(e) => setActualAreaPyeong(e.target.value)}
                className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
              />
              <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                신청 면적({reservation.areaPyeong}평)과 다르면 차액이 자동으로 정산에 반영됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnd}
              disabled={busy}
              className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {busy ? "위치 확인 중..." : "작업 종료 (GPS 기록)"}
            </button>
          </>
        )}

        {status === "COMPLETION_REQUESTED" && (
          <p className="rounded-lg bg-brand-50 p-3 text-sm text-black/60 dark:bg-brand-900/20 dark:text-white/60">
            작업 완료 처리되었습니다. 농민의 승인을 기다리고 있어요 (미승인 시 일정 시간 후
            자동으로 승인됩니다).
          </p>
        )}

        {status === "COMPLETED" && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
            완료된 작업입니다. 정산 내역은 정산 관리 메뉴에서 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
