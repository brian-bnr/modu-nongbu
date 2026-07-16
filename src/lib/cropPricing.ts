export const RICE_CROP_TYPE = "벼";
export const RICE_UNIT_PRICE = 40;
export const FIELD_CROP_UNIT_PRICE = 100;

export const CROP_TYPES = [RICE_CROP_TYPE, "옥수수", "콩", "감자", "고구마", "배추"];

// 쌀(벼)은 평당 40원, 그 외 밭작물(옥수수·콩·감자·고구마·배추)은 평당 100원.
export function getCropUnitPrice(cropType: string): number {
  return cropType === RICE_CROP_TYPE ? RICE_UNIT_PRICE : FIELD_CROP_UNIT_PRICE;
}

export type ParcelCropInput = { areaPyeong: number; cropType: string };

// 필지마다 다른 작물을 지정한 경우, 필지별 (면적 × 단가)를 모두 더해 총 견적을 계산한다.
export function calcTotalPriceByParcel(parcels: ParcelCropInput[]): number {
  return parcels.reduce((sum, p) => sum + p.areaPyeong * getCropUnitPrice(p.cropType), 0);
}

// 여러 필지의 작물이 섞여 있으면 보여줄 대표 작물명 문자열 ("벼" 또는 "벼, 옥수수").
export function summarizeCropTypes(cropTypes: string[]): string {
  return Array.from(new Set(cropTypes)).join(", ");
}
