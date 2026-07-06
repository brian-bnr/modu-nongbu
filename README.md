# 모두의농부

전국 농가의 농산물을 검색하고, 농가에 직접 문의하거나 구매요청을 보낼 수 있는 웹 서비스입니다.
농가/농산물 데이터는 별도 농민 로그인 없이 **운영자가 관리자 화면에서 대신 등록·관리**합니다.

## 주요 기능

- **소비자**: 지역/카테고리 검색, 농가·농산물 상세, 전화/이메일 직접 문의, 구매요청 제출, 이름+연락처로 주문 조회
- **운영자(`/admin`)**: 로그인, 대시보드, 농가/농산물 CRUD, 구매요청 상태 관리(요청 접수 → 확인중 → 결제 대기 → 결제 완료 → 배송중 → 완료/취소)

결제는 MVP 단계에서 실제 PG 연동 없이 **구매요청서 + 운영자 수동 확인** 방식으로 처리합니다. 이후 토스페이먼츠/포트원 등의 PG를 연동할 경우, `PurchaseRequest.status` 값을 그대로 결제 상태로 확장해 사용할 수 있습니다.

## 기술 스택

- Next.js (App Router) + TypeScript
- Prisma ORM + SQLite (배포 시 Postgres 등으로 전환 가능)
- Tailwind CSS
- NextAuth(Auth.js) v5, Credentials Provider — `/admin` 전용 운영자 로그인

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env`를 만들고 값을 채워주세요.

```bash
cp .env.example .env
```

- `DATABASE_URL`: SQLite 파일 경로 (기본값 그대로 사용 가능)
- `AUTH_SECRET`: NextAuth 세션 암호화 키. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` 로 생성
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: 시드 스크립트가 생성할 운영자 계정 정보

### 3. DB 마이그레이션 및 시드

```bash
npx prisma migrate dev
npx prisma db seed
```

시드 스크립트는 운영자 계정 1개와 샘플 농가/농산물 데이터를 생성합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

- 소비자 화면: http://localhost:3000
- 운영자 로그인: http://localhost:3000/admin/login (`.env`에 설정한 `ADMIN_EMAIL`/`ADMIN_PASSWORD`로 로그인)

## 프로젝트 구조

```
prisma/schema.prisma       # Farm, Product, PurchaseRequest, Admin 모델
prisma/seed.ts             # 운영자 계정 + 샘플 데이터 시드
src/lib/prisma.ts          # Prisma client singleton
src/lib/auth.ts            # NextAuth 설정 (Credentials)
src/lib/validation.ts      # zod 입력 검증 스키마
src/middleware.ts          # /admin/* 라우트 보호
src/app/(consumer)/...     # 홈, 농가, 농산물, 주문조회 (로그인 불필요)
src/app/admin/...          # 로그인, 대시보드, 농가/농산물 CRUD, 구매요청 관리
src/components/...         # 공용 UI 컴포넌트
```

## 범위 밖 (추후 작업)

- 실제 PG(토스페이먼츠/포트원 등) 결제 연동
- 이미지 파일 업로드 (현재는 이미지 URL 입력만 지원)
- 농민 self-service 로그인/가입
- 신규 구매요청 시 이메일/SMS 자동 알림 (현재는 운영자가 `/admin` 대시보드에서 확인)
