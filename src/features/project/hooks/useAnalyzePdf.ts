import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "../../../lib/api.ts";

interface CreateProjectFromPdfRequest {
  file: File;
  name: string;
}

async function createProjectFromPdf({
  file,
  name,
}: CreateProjectFromPdfRequest) {
  const formData = new FormData();
  formData.append("file", file);

  const projectResponse = await api.post<unknown>("/api/v1/projects", {
    sourcePdfId: 16,
    name,
  });

  console.log(projectResponse.data);
  return {
    pdfId: 16,
    project: projectResponse.data,
  };
}

export function useAnalyzePdf() {
  return useMutation({
    mutationFn: createProjectFromPdf,
  });
}

export function getPdfAnalysisErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return "PDF 분석과 프로젝트 생성을 완료하지 못했어요. 잠시 후 다시 시도해주세요.";
  }

  if (!error.response) {
    return "분석 서버에 연결할 수 없어요. 네트워크 상태를 확인해주세요.";
  }

  if (error.response.status === 413) {
    return "서버에서 허용하는 PDF 용량을 초과했어요.";
  }

  if (error.response.status >= 500) {
    return "분석 서버에 문제가 발생했어요. 잠시 후 다시 시도해주세요.";
  }

  return "PDF 분석 또는 프로젝트 생성 요청을 완료하지 못했어요. 입력 내용을 확인해주세요.";
}
