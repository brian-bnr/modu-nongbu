const EARTH_RADIUS_M = 6378137;
const SQM_PER_PYEONG = 3.305785;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * 구면 다각형 면적 계산 (Google Maps SphericalUtil.computeArea와 동일한 알고리즘).
 * ring: [lng, lat] 좌표 배열 (닫혀있지 않아도 됨). 필지 규모에서 오차 1% 미만.
 */
export function polygonAreaSqm(ring: [number, number][]): number {
  if (ring.length < 3) return 0;

  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[(i + 1) % ring.length];
    total += toRad(lng2 - lng1) * (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }

  return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

export function sqmToPyeong(sqm: number): number {
  return sqm / SQM_PER_PYEONG;
}
