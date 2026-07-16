import { z } from "zod";

const optionalInt = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return Number(val);
}, z.number().int().min(0).optional());

export const POST_TYPES = [
  "SELL_PRODUCT",
  "BUY_PRODUCT",
  "FIND_WORKER",
  "LOOKING_FOR_WORK",
  "RENT_MACHINE",
  "NEED_MACHINE",
  "DRONE_REQUEST",
  "DRONE_SERVICE",
] as const;

export const signupSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요.")
    .regex(/^[0-9-]{9,13}$/, "올바른 전화번호 형식이 아닙니다."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  region: z.string().optional().or(z.literal("")),
});

export const userLoginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phone: z
    .string()
    .min(1, "휴대폰 번호를 입력해주세요.")
    .regex(/^[0-9-]{9,13}$/, "올바른 전화번호 형식이 아닙니다."),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    newPasswordConfirm: z.string().min(1, "새 비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "새 비밀번호가 일치하지 않습니다.",
    path: ["newPasswordConfirm"],
  });

export const postSchema = z.object({
  postType: z.enum(POST_TYPES),
  title: z.string().min(1, "제목을 입력해주세요."),
  category: z.string().optional().or(z.literal("")),
  price: optionalInt,
  unit: z.string().optional().or(z.literal("")),
  region: z.string().min(1, "지역(시/도)을 입력해주세요."),
  regionDetail: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("올바른 URL 형식이 아닙니다.").optional().or(z.literal("")),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const inquirySchema = z.object({
  postId: z.string().min(1),
  message: z.string().max(1000).optional().or(z.literal("")),
  quantity: optionalInt,
});

export const inquiryUpdateSchema = z.object({
  message: z.string().max(1000).optional().or(z.literal("")),
  quantity: optionalInt,
});

export const inquiryStatusUpdateSchema = z.object({
  inquiryId: z.string().min(1),
  status: z.enum(["REQUESTED", "ACCEPTED", "COMPLETED", "CANCELLED"]),
  adminNote: z.string().max(2000).optional().or(z.literal("")),
});

export const droneReservationSchema = z.object({
  region: z.string().min(1, "지역(시/도)을 선택해주세요."),
  regionDetail: z.string().optional().or(z.literal("")),
  areaPyeong: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().min(1, "면적은 1평 이상이어야 합니다.")
  ),
  cropType: z.string().min(1, "작물 종류를 입력해주세요."),
  desiredDate: z.string().min(1, "희망 날짜를 선택해주세요."),
  parcelPnu: z.string().optional().or(z.literal("")),
  parcelJibun: z.string().optional().or(z.literal("")),
  parcelAreaSqm: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
});
