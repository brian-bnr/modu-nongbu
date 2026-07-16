export type SelectedParcel = {
  pnu: string | null;
  jibun: string | null;
  areaPyeong: number;
  areaSqm: number;
  lat: number;
  lng: number;
  rings: [number, number][]; // [lat, lng] pairs, 필지 경계 폴리곤
};

export type MapCanvasHandle = {
  setCenter: (lat: number, lng: number, zoom?: number) => void;
};

export type MapCanvasProps = {
  region?: string;
  parcels: SelectedParcel[];
  onMapClick: (lat: number, lng: number) => void;
  initialCenter?: { lat: number; lng: number; zoom: number };
};

export function parcelKey(p: { pnu: string | null; jibun: string | null; lat: number; lng: number }) {
  return p.pnu || p.jibun || `${p.lat.toFixed(5)}_${p.lng.toFixed(5)}`;
}

// 시/도 중심 좌표 (지역 선택 시 지도 이동용, 대략적인 도청 소재지 기준)
export const REGION_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
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
