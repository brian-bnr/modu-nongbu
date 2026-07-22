"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { signupAction, type SignupActionState } from "@/app/(consumer)/signup/actions";
import { REGIONS } from "@/lib/regions";

const initialState: SignupActionState = {};

const EMAIL_DOMAINS = ["gmail.com", "naver.com", "daum.net"];

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length < 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

const STEP_FIELDS = [
  ["name", "phone", "email", "password"],
  ["role"],
  [
    "hasPaddyField",
    "hasUplandField",
    "droneModel",
    "experienceYears",
    "activityRegion",
    "equipmentInfo",
    "specialty",
    "bio",
    "companyType",
    "mainItem",
    "businessInfo",
  ],
];

const fieldClass =
  "mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

type RoleKey = "FARMER" | "OPERATOR" | "EXPERT" | "COMPANY";

const ROLE_OPTIONS: {
  key: RoleKey;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    key: "FARMER",
    icon: "/icons/category/farmer.png",
    title: "농민입니다",
    description: "방제 신청, 위탁영농, 계약재배, 농산물 판매",
  },
  {
    key: "OPERATOR",
    icon: "/icons/category/drone.png",
    title: "방제사입니다",
    description: "작업 신청, 일정, 정산, 작업지 선택, 고객관리",
  },
  {
    key: "EXPERT",
    icon: "/icons/category/sprout.png",
    title: "농업 전문가입니다",
    description: "농업 정보 공유, 비료·병해충, 컨설팅",
  },
  {
    key: "COMPANY",
    icon: "/icons/category/bank.png",
    title: "업체입니다",
    description: "농산물 구매, 계약재배, 기업화된 서비스",
  },
];

const EXPERIENCE_OPTIONS = [
  { label: "1년 미만", value: 0 },
  { label: "1~3년", value: 2 },
  { label: "3~5년", value: 4 },
  { label: "5~10년", value: 7 },
  { label: "10년 이상", value: 12 },
];

const COMPANY_TYPES = ["유통업체", "농자재업체", "가공업체", "금융업체", "기타"];

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [isCustomDomain, setIsCustomDomain] = useState(true);
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");

  const [role, setRole] = useState<RoleKey | "">("");

  const [hasPaddyField, setHasPaddyField] = useState<"yes" | "no" | "">("");
  const [hasUplandField, setHasUplandField] = useState<"yes" | "no" | "">("");

  const [droneModel, setDroneModel] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [activityRegion, setActivityRegion] = useState("");
  const [equipmentInfo, setEquipmentInfo] = useState("");

  const [specialty, setSpecialty] = useState<"DISTRIBUTION" | "SUPPLIES" | "OTHER" | "">("");
  const [bio, setBio] = useState("");

  const [companyType, setCompanyType] = useState("");
  const [mainItem, setMainItem] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");

  const email = emailLocal && emailDomain ? `${emailLocal}@${emailDomain}` : "";
  const step0Valid = name && phone && email && password.length >= 8;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleEmailDomainSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setIsCustomDomain(true);
      setEmailDomain("");
    } else {
      setIsCustomDomain(false);
      setEmailDomain(value);
    }
  };

  // 서버 검증 에러가 현재 보이지 않는 단계(예: 이메일 중복 에러가 1~3단계에 있는 동안
  // 화면에는 안 보임)에 있으면, 에러 메시지가 실제로 보이는 단계로 자동 이동시킨다.
  useEffect(() => {
    const errorKeys = state.errors ? Object.keys(state.errors) : [];
    if (errorKeys.length === 0) return;
    const stepWithError = STEP_FIELDS.findIndex((fields) =>
      errorKeys.some((key) => fields.includes(key))
    );
    if (stepWithError !== -1) {
      setStep(stepWithError);
    }
  }, [state]);

  const yesNoButtonClass = (selected: boolean) =>
    `flex-1 rounded-full border px-4 py-2 text-sm font-medium transition ${
      selected
        ? "border-brand-700 bg-brand-700 text-white"
        : "border-black/10 text-black/70 hover:border-brand-700 dark:border-white/20 dark:text-white/70"
    }`;

  const allErrorMessages = state.errors
    ? Object.values(state.errors).flatMap((m) => m ?? [])
    : [];

  return (
    <form action={formAction} className="space-y-4">
      {allErrorMessages.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
          {allErrorMessages.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
      )}
      {/* Step 0: 기본 정보 */}
      <div className={step === 0 ? "space-y-4" : "hidden"}>
        <div>
          <label className="block text-sm font-medium">이름</label>
          <input
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
          {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">연락처</label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={13}
            className={fieldClass}
          />
          <input type="hidden" name="phone" value={phone} />
          {state.errors?.phone && <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">이메일</label>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <input
              type="text"
              autoComplete="username"
              placeholder="아이디"
              value={emailLocal}
              onChange={(e) => setEmailLocal(e.target.value)}
              className="w-28 flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
            />
            <span className="text-sm text-black/50 dark:text-white/50">@</span>
            <input
              type="text"
              placeholder="도메인"
              value={emailDomain}
              readOnly={!isCustomDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              className="w-28 flex-1 rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
            />
            <select
              value={isCustomDomain ? "" : emailDomain}
              onChange={handleEmailDomainSelectChange}
              className="rounded-md border border-black/10 px-2 py-2 text-sm dark:border-white/20 dark:bg-transparent"
            >
              <option value="">직접 입력</option>
              {EMAIL_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <input type="hidden" name="email" value={email} />
          {state.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">비밀번호</label>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
          {state.errors?.password && (
            <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">지역 (선택)</label>
          <input
            name="region"
            placeholder="예: 전남 나주시"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={fieldClass}
          />
        </div>
        <button
          type="button"
          disabled={!step0Valid}
          onClick={() => setStep(1)}
          className="w-full rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40"
        >
          다음
        </button>
      </div>

      {/* Step 1: 역할 선택 */}
      <div className={step === 1 ? "space-y-3" : "hidden"}>
        <div>
          <h2 className="text-base font-bold">당신은 어떤 서비스를 이용하시나요?</h2>
          <p className="mt-1 text-xs text-black/50 dark:text-white/50">
            모두의농부는 역할에 따라 맞춤 서비스를 제공해요.
          </p>
        </div>
        {ROLE_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setRole(opt.key)}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
              role === opt.key
                ? "border-brand-700 bg-brand-50 dark:bg-brand-900/20"
                : "border-black/10 dark:border-white/15"
            }`}
          >
            <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-lg">
              <Image src={opt.icon} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{opt.title}</span>
              <span className="block text-xs text-black/50 dark:text-white/50">{opt.description}</span>
            </span>
          </button>
        ))}
        <input type="hidden" name="role" value={role} />
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex-1 rounded-md border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/20"
          >
            이전
          </button>
          <button
            type="button"
            disabled={!role}
            onClick={() => setStep(2)}
            className="flex-1 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      </div>

      {/* Step 2: 역할별 질문 */}
      <div className={step === 2 ? "space-y-4" : "hidden"}>
        {role === "FARMER" && (
          <>
            <div>
              <p className="text-sm font-medium">논이 있으신가요?</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={yesNoButtonClass(hasPaddyField === "yes")}
                  onClick={() => setHasPaddyField("yes")}
                >
                  있어요
                </button>
                <button
                  type="button"
                  className={yesNoButtonClass(hasPaddyField === "no")}
                  onClick={() => setHasPaddyField("no")}
                >
                  없어요
                </button>
              </div>
              <input type="hidden" name="hasPaddyField" value={hasPaddyField} />
              {state.errors?.hasPaddyField && (
                <p className="mt-1 text-xs text-red-600">{state.errors.hasPaddyField[0]}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">밭이 있으신가요?</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={yesNoButtonClass(hasUplandField === "yes")}
                  onClick={() => setHasUplandField("yes")}
                >
                  있어요
                </button>
                <button
                  type="button"
                  className={yesNoButtonClass(hasUplandField === "no")}
                  onClick={() => setHasUplandField("no")}
                >
                  없어요
                </button>
              </div>
              <input type="hidden" name="hasUplandField" value={hasUplandField} />
              {state.errors?.hasUplandField && (
                <p className="mt-1 text-xs text-red-600">{state.errors.hasUplandField[0]}</p>
              )}
            </div>
          </>
        )}

        {role === "OPERATOR" && (
          <>
            <div>
              <label className="block text-sm font-medium">보유 드론 기종은 무엇인가요?</label>
              <input
                name="droneModel"
                placeholder="예: DJI T30"
                value={droneModel}
                onChange={(e) => setDroneModel(e.target.value)}
                className={fieldClass}
              />
              {state.errors?.droneModel && (
                <p className="mt-1 text-xs text-red-600">{state.errors.droneModel[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">방제 경력은 얼마나 되셨나요?</label>
              <select
                name="experienceYears"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className={fieldClass}
              >
                <option value="">선택해주세요</option>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {state.errors?.experienceYears && (
                <p className="mt-1 text-xs text-red-600">{state.errors.experienceYears[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">활동 지역은 어디신가요?</label>
              <select
                name="activityRegion"
                value={activityRegion}
                onChange={(e) => setActivityRegion(e.target.value)}
                className={fieldClass}
              >
                <option value="">선택해주세요</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {state.errors?.activityRegion && (
                <p className="mt-1 text-xs text-red-600">{state.errors.activityRegion[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">보유 장비 / 자격 정보 (선택)</label>
              <textarea
                name="equipmentInfo"
                rows={3}
                placeholder="드론 대수, 방제 자격증 등을 입력해주세요."
                value={equipmentInfo}
                onChange={(e) => setEquipmentInfo(e.target.value)}
                className={fieldClass}
              />
            </div>
            <p className="rounded-lg bg-black/5 px-3 py-2 text-xs text-black/60 dark:bg-white/10 dark:text-white/60">
              방제사는 관리자 승인 후 활동하실 수 있어요. 가입 후 홈 화면에서 승인 상태를 확인할 수 있어요.
            </p>
          </>
        )}

        {role === "EXPERT" && (
          <>
            <div>
              <p className="text-sm font-medium">어떤 분야의 전문가이신가요?</p>
              <div className="mt-2 flex gap-2">
                {(
                  [
                    { key: "DISTRIBUTION", label: "유통" },
                    { key: "SUPPLIES", label: "농자재" },
                    { key: "OTHER", label: "기타" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    className={yesNoButtonClass(specialty === o.key)}
                    onClick={() => setSpecialty(o.key)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="specialty" value={specialty} />
              {state.errors?.specialty && (
                <p className="mt-1 text-xs text-red-600">{state.errors.specialty[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">주요 활동 지역은 어디신가요?</label>
              <select
                name="activityRegion"
                value={activityRegion}
                onChange={(e) => setActivityRegion(e.target.value)}
                className={fieldClass}
              >
                <option value="">선택해주세요</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {state.errors?.activityRegion && (
                <p className="mt-1 text-xs text-red-600">{state.errors.activityRegion[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">경력 및 소개 (선택)</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="경력, 전문 분야 소개를 입력해주세요."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={fieldClass}
              />
            </div>
          </>
        )}

        {role === "COMPANY" && (
          <>
            <div>
              <label className="block text-sm font-medium">업체 유형을 선택해주세요</label>
              <select
                name="companyType"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className={fieldClass}
              >
                <option value="">선택해주세요</option>
                {COMPANY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {state.errors?.companyType && (
                <p className="mt-1 text-xs text-red-600">{state.errors.companyType[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">주요 취급 품목은 무엇인가요? (선택)</label>
              <input
                name="mainItem"
                placeholder="예: 쌀"
                value={mainItem}
                onChange={(e) => setMainItem(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">주요 활동 지역은 어디신가요?</label>
              <select
                name="activityRegion"
                value={activityRegion}
                onChange={(e) => setActivityRegion(e.target.value)}
                className={fieldClass}
              >
                <option value="">선택해주세요</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {state.errors?.activityRegion && (
                <p className="mt-1 text-xs text-red-600">{state.errors.activityRegion[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">사업자 정보 (선택)</label>
              <input
                name="businessInfo"
                placeholder="사업자등록번호 등"
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                className={fieldClass}
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 rounded-md border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/20"
          >
            이전
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-60"
          >
            {isPending ? "가입 중..." : "가입 완료"}
          </button>
        </div>
      </div>
    </form>
  );
}
