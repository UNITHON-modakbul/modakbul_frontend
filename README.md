# B2B Hackathon

React + TypeScript + Vite 기반의 B2B 해커톤 프로젝트입니다.

## Included

- React 19 + TypeScript
- Tailwind CSS 4 (Vite 플러그인 방식)
- Axios 공통 인스턴스 (`src/lib/api.ts`)
- TanStack Query 전역 `QueryClient` (`src/lib/queryClient.ts`)
- React Router 라우트 설정 (`src/routes/router.tsx`)
- shadcn/ui 방식의 공통 UI 컴포넌트 (`src/components/ui`)
- PDF 분석 결과 질문 UI (`src/features/requirements`)

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## API endpoint

`.env.example`을 복사해 `.env.local`을 만들고 API 주소를 설정할 수 있습니다.

```bash
cp .env.example .env.local
```

`VITE_API_BASE_URL`이 없으면 Axios는 `/api`를 기본 경로로 사용합니다.

## Deployment

GitHub Actions에서 빌드한 정적 결과물을 `s3://mvpilot.cloud`에 배포하고 CloudFront로 제공합니다. AWS와 GitHub 설정 방법은 [S3 · CloudFront 배포 가이드](docs/deployment/s3-static-hosting.md)를 참고하세요.
