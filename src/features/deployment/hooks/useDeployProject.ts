import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api.ts";

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface DeploymentResponse {
  deploymentId: string;
  projectId: string;
  status: string;
  backendStatus: string;
  frontendStatus: string;
  backendUrl: string | null;
  frontendUrl: string | null;
  failureReason: string | null;
}

interface DeployProjectRequest {
  projectId: string;
}

const PROJECT_KEY_PATTERN = /^prj-[0-9]{6}$/;
const POLL_INTERVAL_MS = 3_000;
const DEPLOYMENT_TIMEOUT_MS = 15 * 60 * 1_000;

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function deployProject({ projectId }: DeployProjectRequest) {
  if (!PROJECT_KEY_PATTERN.test(projectId)) {
    throw new Error("배포할 projectKey 형식이 올바르지 않습니다.");
  }

  const startResponse = await api.post<ApiResponse<DeploymentResponse>>(
    `/api/v1/deployments/projects/${encodeURIComponent(projectId)}`,
  );
  let deployment = startResponse.data.data;
  const deadline = Date.now() + DEPLOYMENT_TIMEOUT_MS;

  while (deployment.status !== "SUCCEEDED" && deployment.status !== "FAILED") {
    if (Date.now() >= deadline) {
      throw new Error("배포 완료 대기 시간이 초과되었습니다.");
    }

    await wait(POLL_INTERVAL_MS);
    const statusResponse = await api.get<ApiResponse<DeploymentResponse>>(
      `/api/v1/deployments/${encodeURIComponent(deployment.deploymentId)}`,
    );
    deployment = statusResponse.data.data;
  }

  if (deployment.status === "FAILED") {
    throw new Error(deployment.failureReason ?? "배포에 실패했습니다.");
  }

  const deploymentUrl = deployment.frontendUrl ?? deployment.backendUrl;
  if (!deploymentUrl) {
    throw new Error("배포는 완료됐지만 결과 URL을 받지 못했습니다.");
  }

  return {
    deployment,
    deploymentUrl,
    message: "배포가 완료됐어요.",
  };
}

export function useDeployProject() {
  return useMutation({
    mutationFn: deployProject,
  });
}
