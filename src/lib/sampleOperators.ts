import type { OperatorCardData } from "@/components/OperatorCard";

/**
 * 실제 방제사가 아직 없을 때 홈/목록 화면을 비워두지 않기 위한 예시 데이터.
 * 실제 방제사가 등록되면 각 화면에서 이 배열 대신 실제 데이터가 자동으로 표시된다.
 */
export const SAMPLE_OPERATORS: OperatorCardData[] = [
  {
    id: "sample-1",
    name: "김방제",
    region: "경기 파주",
    experienceYears: 8,
    totalAreaPyeong: 245000,
    completedCount: 132,
    avgRating: 4.9,
    reviewCount: 86,
    sample: true,
  },
  {
    id: "sample-2",
    name: "이든든",
    region: "충남 논산",
    experienceYears: 6,
    totalAreaPyeong: 198000,
    completedCount: 97,
    avgRating: 4.8,
    reviewCount: 54,
    sample: true,
  },
  {
    id: "sample-3",
    name: "박정성",
    region: "전남 나주",
    experienceYears: 4,
    totalAreaPyeong: 132000,
    completedCount: 68,
    avgRating: 4.7,
    reviewCount: 31,
    sample: true,
  },
];
