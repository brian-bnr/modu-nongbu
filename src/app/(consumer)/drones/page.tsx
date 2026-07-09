import { ComingSoon } from "@/components/ComingSoon";

export default function DronesPage() {
  return (
    <ComingSoon
      icon="🚁"
      title="드론 방제·방역"
      description="농작물 병해충 방제부터 축사·시설 소독까지, 드론으로 빠르고 정확하게 작업해요."
      features={[
        "🌾 병해충 방제 — 논·밭 농약 및 영양제 살포를 드론으로 빠르게",
        "🧴 소독·방역 — 축사, 창고, 시설 소독 작업 의뢰",
        "🧑‍✈️ 드론 기사 매칭 — 자격을 갖춘 드론 기사와 농가를 직접 연결",
      ]}
    />
  );
}
