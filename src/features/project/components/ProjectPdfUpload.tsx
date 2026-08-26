import {
  ArrowUpRight,
  Download,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../../components/ui/Button.tsx";
import { cn } from "../../../utils/cn.ts";
import {
  getPdfAnalysisErrorMessage,
  useAnalyzePdf,
} from "../hooks/useAnalyzePdf.ts";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getPdfError(file: File) {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (!isPdf) {
    return "PDF 파일만 업로드할 수 있어요.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "파일 크기는 최대 20MB까지 업로드할 수 있어요.";
  }

  return null;
}

export function ProjectPdfUpload() {
  const navigate = useNavigate();
  const analyzePdf = useAnalyzePdf();
  const inputRef = useRef<HTMLInputElement>(null);
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (selectedFile?: File) => {
    if (!selectedFile) return;

    analyzePdf.reset();
    const validationError = getPdfError(selectedFile);
    setError(validationError);

    if (!validationError) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  const clearFile = () => {
    analyzePdf.reset();
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = () => {
    const name = projectName.trim();
    if (!file || !name) return;

    analyzePdf.mutate(
      { file, name },
      {
        onSuccess: () => navigate("/requirements/review"),
      },
    );
  };

  return (
    <section className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[28px] border border-[#17332f]/15 bg-white/85 p-5 shadow-[0_28px_80px_rgba(23,51,47,0.14)] backdrop-blur sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e9f2cc] px-3 py-1.5 text-xs font-bold text-[#375226]">
            <FileText aria-hidden="true" size={14} />
            REQUIREMENTS PDF
          </div>
          <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#17332f] sm:text-2xl">
            기능명세서를 올려주세요
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#17332f]/60">
            PDF를 분석한 뒤 필요한 정보만 GUI로 다시 확인합니다.
          </p>
        </div>
        <span className="hidden rounded-lg border border-[#17332f]/10 bg-[#f3f0e7] px-2.5 py-1 font-mono text-[11px] font-bold text-[#17332f]/50 sm:block">
          INPUT 01
        </span>
      </div>

      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-extrabold text-[#17332f]"
          htmlFor="project-name"
        >
          프로젝트 제목
        </label>
        <input
          autoComplete="off"
          className="h-12 w-full rounded-2xl border border-[#17332f]/15 bg-[#fffdf7] px-4 text-sm font-bold text-[#17332f] outline-none transition placeholder:font-medium placeholder:text-[#17332f]/30 focus:border-[#ec6b42] focus:ring-4 focus:ring-[#ec6b42]/10 disabled:cursor-wait disabled:opacity-60"
          disabled={analyzePdf.isPending}
          id="project-name"
          maxLength={100}
          onChange={(event) => {
            analyzePdf.reset();
            setProjectName(event.target.value);
          }}
          placeholder="예) 동네 클래스 예약 서비스"
          type="text"
          value={projectName}
        />
      </div>

      <div
        className={cn(
          "w-full min-w-0 max-w-full rounded-2xl border-2 border-dashed p-3 transition",
          isDragging
            ? "border-[#ec6b42] bg-[#fff3eb]"
            : "border-[#17332f]/15 bg-[#fffdf7]",
        )}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          accept="application/pdf,.pdf"
          className="sr-only"
          id="requirements-pdf"
          onChange={(event) => selectFile(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />

        {file ? (
          <div className="flex min-h-44 w-full min-w-0 max-w-full items-center gap-4 overflow-hidden rounded-xl bg-[#f3f0e7] p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#ec6b42] text-white shadow-[3px_3px_0_#17332f]">
              <FileText aria-hidden="true" size={22} />
            </span>
            <div className="group relative min-w-0 flex-1">
              <p
                aria-describedby="selected-pdf-name-tooltip"
                className="block max-w-full truncate text-sm font-extrabold text-[#17332f]"
                tabIndex={0}
              >
                {file.name}
              </p>
              <span
                className="pointer-events-none invisible absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 break-all rounded-xl bg-[#17332f] px-3 py-2 text-[11px] font-semibold leading-5 text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                id="selected-pdf-name-tooltip"
                role="tooltip"
              >
                {file.name}
              </span>
              <p className="mt-1 font-mono text-xs text-[#17332f]/45">
                PDF · {formatFileSize(file.size)}
              </p>
            </div>
            <button
              aria-label="선택한 PDF 제거"
              className="grid size-9 shrink-0 place-items-center rounded-full text-[#17332f]/45 transition hover:bg-white hover:text-[#c94d2a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ec6b42]/15"
              onClick={clearFile}
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
        ) : (
          <label
            className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl px-5 text-center transition hover:bg-[#f3f0e7]/65"
            htmlFor="requirements-pdf"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-[#e9f2cc] text-[#375226]">
              <UploadCloud aria-hidden="true" size={23} />
            </span>
            <strong className="mt-4 text-sm text-[#17332f]">
              PDF를 끌어놓거나 클릭해서 선택
            </strong>
            <span className="mt-1.5 text-xs text-[#17332f]/40">
              PDF 1개 · 최대 20MB
            </span>
          </label>
        )}
      </div>

      <p
        className={cn(
          "mt-2 min-h-5 px-1 text-xs",
          error ? "font-semibold text-[#c94d2a]" : "text-[#17332f]/42",
        )}
        role="status"
      >
        {error ??
          (analyzePdf.isError
            ? getPdfAnalysisErrorMessage(analyzePdf.error)
            : analyzePdf.isPending
              ? "PDF 분석과 프로젝트 생성을 순서대로 진행하고 있어요."
              : "선택한 파일은 아직 서버로 전송되지 않습니다.")}
      </p>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#b6cf5b] bg-[#e9f2cc] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#17332f] text-white">
            <FileText aria-hidden="true" size={18} />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#17332f]">
              예시 PDF가 필요하신가요?
            </p>
            <p className="mt-1 text-xs leading-5 text-[#17332f]/55">
              현재는 양식 확정 전 빈 PDF가 제공됩니다.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="h-10 shrink-0 px-4 text-xs shadow-none hover:translate-y-0 hover:shadow-none"
          variant="outline"
        >
          <a
            download="mvpilot_기능명세서_예시.pdf"
            href="/examples/board_crud_function_spec_v2.pdf"
          >
            <Download aria-hidden="true" size={16} />
            예시 PDF 받기
          </a>
        </Button>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!file || !projectName.trim() || analyzePdf.isPending}
        onClick={handleAnalyze}
        size="lg"
        type="button"
      >
        {analyzePdf.isPending ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              size={19}
            />
            PDF 분석 및 프로젝트 생성 중
          </>
        ) : (
          <>
            PDF 분석 시작하기
            <ArrowUpRight aria-hidden="true" size={19} />
          </>
        )}
      </Button>
    </section>
  );
}
