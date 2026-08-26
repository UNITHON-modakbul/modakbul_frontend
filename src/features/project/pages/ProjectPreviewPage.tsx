import {
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  CircleDashed,
  CloudUpload,
  ExternalLink,
  GitBranch,
  Home,
  LayoutDashboard,
  LoaderCircle,
  PackageCheck,
  PencilLine,
  Rocket,
  ServerCog,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { Button } from "../../../components/ui/Button.tsx";
import { cn } from "../../../utils/cn.ts";
import {
  useDeployProject,
  type DeploymentResponse,
  type DeploymentRun,
} from "../../deployment/hooks/useDeployProject.ts";
import { servicePreviewUrl } from "../utils/preview.ts";

const developmentSessionId = "01a038ee-5f82-79e0-96a9-1ce584341e5e";

const deploymentSteps: Array<{
  key: keyof Pick<
    DeploymentResponse,
    | "prepare"
    | "backendCi"
    | "frontendCi"
    | "qa"
    | "image"
    | "route"
    | "backendDeploy"
    | "frontendDeploy"
  >;
  label: string;
}> = [
  { key: "prepare", label: "배포 환경 준비" },
  { key: "backendCi", label: "백엔드 CI" },
  { key: "frontendCi", label: "프론트엔드 CI" },
  { key: "qa", label: "QA 검증" },
  { key: "image", label: "이미지 빌드" },
  { key: "route", label: "라우팅 연결" },
  { key: "backendDeploy", label: "백엔드 배포" },
  { key: "frontendDeploy", label: "프론트엔드 배포" },
];

const deploymentStatusLabels: Record<string, string> = {
  PREPARING: "배포 환경을 준비하고 있어요.",
  BACKEND_CI: "백엔드 빌드와 테스트를 진행하고 있어요.",
  FRONTEND_CI: "프론트엔드 빌드와 테스트를 진행하고 있어요.",
  QA_RUNNING: "서비스 품질을 검증하고 있어요.",
  IMAGE_BUILDING: "실행 이미지를 만들고 있어요.",
  ROUTING: "서비스 접속 경로를 연결하고 있어요.",
  BACKEND_DEPLOYING: "백엔드를 배포하고 있어요.",
  FRONTEND_DEPLOYING: "프론트엔드를 배포하고 있어요.",
};

function getDeploymentStatusLabel(status: string) {
  return (
    deploymentStatusLabels[status] ??
    `${status.replaceAll("_", " ")} 단계를 진행하고 있어요.`
  );
}

function DeploymentLoading({
  deployment,
}: {
  deployment: DeploymentResponse | null;
}) {
  const runs = deployment
    ? deploymentSteps.map((step) => deployment[step.key] as DeploymentRun)
    : [];
  const lastStartedIndex = runs.reduce(
    (lastIndex, run, index) => (run.runId ? index : lastIndex),
    -1,
  );
  const progress = deployment
    ? Math.max(
        6,
        ((lastStartedIndex + 0.5) / deploymentSteps.length) * 100,
      )
    : 4;

  return (
    <section
      aria-live="polite"
      className="min-h-0 w-full flex-1 overflow-y-auto rounded-[30px] border border-[#17332f]/15 bg-white/90 p-5 shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-7"
    >
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative grid size-16 shrink-0 place-items-center">
              <span className="absolute inset-0 animate-spin rounded-2xl border-4 border-[#17332f]/8 border-t-[#ec6b42]" />
              <span className="grid size-11 place-items-center rounded-xl bg-[#17332f] text-white shadow-[3px_3px_0_#d9ef7d]">
                <ServerCog aria-hidden="true" size={22} />
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.14em] text-[#ec6b42]">
                {deployment?.status ?? "DEPLOYMENT REQUESTING"}
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                {deployment
                  ? getDeploymentStatusLabel(deployment.status)
                  : "배포 요청을 전달하고 있어요."}
              </h1>
              <p className="mt-2 text-xs leading-5 text-[#17332f]/50">
                완료될 때까지 배포 상태를 자동으로 확인합니다.
              </p>
            </div>
          </div>

          {deployment && (
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#17332f]/10 bg-[#f3f0e7]/70 px-3 py-2">
                <p className="text-[9px] font-black text-[#17332f]/35">BACKEND</p>
                <p className="mt-0.5 font-mono text-[11px] font-black text-[#375226]">
                  {deployment.backendStatus}
                </p>
              </div>
              <div className="rounded-xl border border-[#17332f]/10 bg-[#f3f0e7]/70 px-3 py-2">
                <p className="text-[9px] font-black text-[#17332f]/35">FRONTEND</p>
                <p className="mt-0.5 font-mono text-[11px] font-black text-[#ec6b42]">
                  {deployment.frontendStatus}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#17332f]/8">
          <div
            className="h-full rounded-full bg-[#ec6b42] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {deploymentSteps.map((step, index) => {
            const run = deployment?.[step.key] as DeploymentRun | undefined;
            const isActive = Boolean(run?.runId) && index === lastStartedIndex;
            const isDone = Boolean(run?.runId) && index < lastStartedIndex;
            const isSkipped = !run?.runId && index < lastStartedIndex;
            const content = (
              <>
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full font-mono text-[10px] font-black",
                    isDone
                      ? "bg-[#5f8a39] text-white"
                      : isActive
                        ? "bg-[#ec6b42] text-white"
                        : "bg-[#17332f]/8 text-[#17332f]/35",
                  )}
                >
                  {isDone ? (
                    <Check aria-hidden="true" size={14} strokeWidth={3} />
                  ) : isActive ? (
                    <LoaderCircle
                      aria-hidden="true"
                      className="animate-spin"
                      size={14}
                    />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-[#17332f]/70">
                    {step.label}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[9px] text-[#17332f]/35">
                    {isDone
                      ? "완료"
                      : isActive
                        ? `RUN ${run?.runId}`
                        : isSkipped
                          ? "건너뜀"
                          : "대기 중"}
                  </span>
                </span>
                {run?.url && (
                  <ExternalLink
                    aria-hidden="true"
                    className="shrink-0 text-[#17332f]/30"
                    size={13}
                  />
                )}
              </>
            );

            const className = cn(
              "flex min-h-16 items-center gap-3 rounded-2xl border px-3 text-left transition",
              isActive
                ? "border-[#ec6b42]/35 bg-[#fff1ea]"
                : isDone
                  ? "border-[#b6cf5b] bg-[#e9f2cc]/70"
                  : "border-[#17332f]/8 bg-[#f3f0e7]/55",
            );

            return run?.url ? (
              <a
                className={className}
                href={run.url}
                key={step.key}
                rel="noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <div className={className} key={step.key}>
                {content}
              </div>
            );
          })}
        </div>

        {deployment && (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#17332f]/10 bg-white px-4 py-3 transition hover:border-[#17332f]/25"
              href={`https://github.com/${deployment.repository}`}
              rel="noreferrer"
              target="_blank"
            >
              <GitBranch aria-hidden="true" className="shrink-0 text-[#5f8a39]" size={17} />
              <span className="min-w-0">
                <span className="block text-[9px] font-black text-[#17332f]/35">REPOSITORY</span>
                <span className="block truncate font-mono text-[11px] font-bold">{deployment.repository}</span>
              </span>
            </a>
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#17332f]/10 bg-white px-4 py-3">
              {deployment.backendUrl ? (
                <CheckCircle2 aria-hidden="true" className="shrink-0 text-[#5f8a39]" size={17} />
              ) : (
                <CircleDashed aria-hidden="true" className="shrink-0 text-[#17332f]/30" size={17} />
              )}
              <span className="min-w-0">
                <span className="block text-[9px] font-black text-[#17332f]/35">RUNTIME</span>
                <span className="block truncate font-mono text-[11px] font-bold">
                  {deployment.runtimeHostId ?? "호스트 배정 대기 중"}
                </span>
              </span>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-[10px] font-semibold text-[#17332f]/35">
          {deployment
            ? `배포 ID ${deployment.deploymentId} · 프로젝트 ${deployment.projectId}`
            : "배포 정보를 기다리고 있어요."}
        </p>
      </div>
    </section>
  );
}

interface DeploymentCompleteProps {
  deploymentUrl: string;
}

function DeploymentComplete({ deploymentUrl }: DeploymentCompleteProps) {
  return (
    <section
      aria-live="polite"
      className="grid min-h-0 w-full flex-1 place-items-center rounded-[30px] border border-[#17332f]/15 bg-white/92 p-6 shadow-[0_24px_70px_rgba(23,51,47,0.12)]"
    >
      <div className="w-full max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[5px_5px_0_#d9ef7d]">
          <Rocket aria-hidden="true" size={29} />
        </span>
        <p className="mt-7 text-xs font-black tracking-[0.14em] text-[#5f8a39]">
          DEPLOYMENT COMPLETE
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
          배포가 완료됐어요!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#17332f]/55">
          아래 주소에서 완성된 서비스를 바로 확인할 수 있어요. 지금 접속하지
          않아도 대시보드에서 다시 찾을 수 있습니다.
        </p>

        <a
          className="mx-auto mt-7 flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-[#b6cf5b] bg-[#e9f2cc] px-5 py-4 text-left transition hover:border-[#91ad34] hover:bg-[#eef7d7]"
          href={deploymentUrl}
          rel="noreferrer"
          target="_blank"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-black tracking-[0.12em] text-[#5f8a39]">
              DEPLOYED URL
            </span>
            <span className="mt-1 block truncate font-mono text-sm font-bold text-[#17332f]">
              {deploymentUrl}
            </span>
          </span>
          <ExternalLink
            aria-hidden="true"
            className="shrink-0 text-[#375226]"
            size={19}
          />
        </a>

        <div className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
          <Button asChild variant="outline">
            <Link to="/">
              <Home aria-hidden="true" size={17} />
              홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild>
            <a href={deploymentUrl} rel="noreferrer" target="_blank">
              배포된 서비스 열기
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ProjectPreviewPage() {
  const { projectId = developmentSessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const didAutoStart = useRef(false);
  const deployProject = useDeployProject();

  const handleDeploy = async () => {
    try {
      await deployProject.mutateAsync({
        projectId,
      });
    } catch {
      // React Query의 isError/error 상태로 화면에서 처리합니다.
    }
  };

  useEffect(() => {
    const shouldStartDeployment = (
      location.state as { startDeployment?: boolean } | null
    )?.startDeployment;

    if (!shouldStartDeployment || didAutoStart.current) return;

    didAutoStart.current = true;
    navigate(location.pathname, { replace: true });
    void handleDeploy();
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="demo-grid relative h-dvh overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#d9ef7d]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/30 blur-3xl" />

      <header className="relative z-20 h-16 border-b border-[#17332f]/10 bg-[#f3f0e7]/80 backdrop-blur sm:h-[72px]">
        <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
          <Link
            className="flex shrink-0 items-center gap-3"
            to="/"
            aria-label="mvpilot 홈"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[3px_3px_0_#ec6b42] sm:size-10">
              <Braces aria-hidden="true" size={20} strokeWidth={2.4} />
            </span>
            <span className="hidden text-lg font-black tracking-[-0.04em] sm:block">
              mvpilot
            </span>
          </Link>

          <div className="min-w-0 text-center">
            <p className="font-mono text-[10px] font-black tracking-[0.14em] text-[#ec6b42]">
              SERVICE PREVIEW
            </p>
            <p className="truncate text-xs font-extrabold text-[#17332f]/60 sm:text-sm">
              개발 결과 미리보기
            </p>
          </div>

          <Link
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65 transition hover:bg-white"
            to="/"
          >
            <LayoutDashboard aria-hidden="true" size={14} />
            <span className="hidden sm:inline">프로젝트</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-[1600px] px-3 pb-3 pt-3 sm:h-[calc(100dvh-72px)] sm:px-6 sm:pb-5 sm:pt-4 lg:px-10">
        {deployProject.isPending ? (
          <DeploymentLoading deployment={deployProject.currentDeployment} />
        ) : deployProject.isSuccess ? (
          <DeploymentComplete
            deploymentUrl={deployProject.data.deploymentUrl}
          />
        ) : (
          <section className="flex min-h-0 w-full flex-1 flex-col rounded-[30px] border border-[#17332f]/15 bg-white/90 p-3 shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-4">
            <div className="flex min-h-0 flex-1 flex-col rounded-3xl bg-[#17332f] p-3 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:p-4">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#d9ef7d]" />
                  <span className="text-xs font-black">서비스 미리보기</span>
                  <span className="hidden text-[10px] text-white/38 sm:inline">
                    읽기 전용
                  </span>
                </div>
                <a
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold text-[#d9ef7d] transition hover:bg-white/8"
                  href={servicePreviewUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  전체 화면
                  <ExternalLink aria-hidden="true" size={13} />
                </a>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-2xl bg-white">
                <iframe
                  className="h-full min-h-0 w-full border-0 bg-white"
                  src={servicePreviewUrl}
                  title="AI가 개발한 서비스 미리보기"
                />
              </div>

              <div className="mt-3 flex shrink-0 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <PackageCheck
                    aria-hidden="true"
                    className="shrink-0 text-[#d9ef7d]"
                    size={20}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white">
                      이 결과로 다음 단계를 선택해주세요.
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-[11px]",
                        deployProject.isError
                          ? "font-bold text-[#ffad91]"
                          : "text-white/45",
                      )}
                      role="status"
                    >
                      {deployProject.isError
                        ? "배포 요청 처리에 실패했어요."
                        : "수정 방향을 검토하거나 현재 결과의 배포를 요청할 수 있어요."}
                    </p>
                  </div>
                </div>

                <div className="grid shrink-0 grid-cols-2 gap-2">
                  <Button
                    asChild
                    className="h-10 border-white/18 bg-white/10 px-4 text-xs text-white hover:border-white/35 hover:bg-white/15"
                    variant="outline"
                  >
                    <Link to={`/projects/${projectId}/revisions/new`}>
                      <PencilLine aria-hidden="true" size={15} />
                      수정 요청
                    </Link>
                  </Button>
                  <Button
                    className="h-10 bg-[#d9ef7d] px-4 text-xs text-[#17332f] shadow-[0_5px_0_#91ad34] hover:bg-[#e3f696] hover:shadow-[0_7px_0_#91ad34]"
                    onClick={handleDeploy}
                    type="button"
                  >
                    <CloudUpload aria-hidden="true" size={15} />
                    배포하기
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
