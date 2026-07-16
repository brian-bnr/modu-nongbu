export const RICE_CROP_TYPE = "벼";
export const RICE_UNIT_PRICE = 40;
export const FIELD_CROP_UNIT_PRICE = 100;

// 쌀(벼)은 평당 40원, 그 외 밭작물(옥수수·콩·감자·고구마·배추)은 평당 100원.
export function getCropUnitPrice(cropType: string): number {
  return cropType === RICE_CROP_TYPE ? RICE_UNIT_PRICE : FIELD_CROP_UNIT_PRICE;
}
