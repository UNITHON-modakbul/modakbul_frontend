import { Braces, FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router";
import { ProjectCard } from "../components/ProjectCard.tsx";
import { mockProjects } from "../data/mockProjects.ts";

export function ProjectDashboardPage() {
  return (
    <div className="demo-grid relative min-h-screen overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#d9ef7d]/38 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/28 blur-3xl" />

      <header className="relative z-20 border-b border-[#17332f]/10 bg-[#f3f0e7]/82 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            className="flex items-center gap-3"
            to="/"
            aria-label="mvpilot 프로젝트 홈"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[4px_4px_0_#ec6b42]">
              <Braces aria-hidden="true" size={21} strokeWidth={2.4} />
            </span>
            <span className="text-lg font-black tracking-[-0.04em]">
              mvpilot
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65">
            <FolderKanban aria-hidden="true" size={14} />
            <span>PROJECT DASHBOARD</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-9 sm:px-8 sm:pt-12 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f2cc] px-3 py-1.5 text-[11px] font-black text-[#375226]">
              <FolderKanban aria-hidden="true" size={14} />
              {mockProjects.length} ACTIVE PROJECTS
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              내 프로젝트
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#17332f]/52">
              만들던 프로젝트를 이어가거나 새로운 아이디어를 시작하세요.
            </p>
          </div>

          <Link
            className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-[#ec6b42] px-5 text-sm font-black text-white shadow-[0_7px_0_#b94727] transition hover:-translate-y-0.5 hover:bg-[#f27a55] hover:shadow-[0_9px_0_#b94727] active:translate-y-1 active:shadow-[0_3px_0_#b94727]"
            to="/projects/new"
          >
            <Plus aria-hidden="true" size={17} strokeWidth={3} />새 프로젝트
            만들기
          </Link>
        </div>

        <section className="mt-9" aria-labelledby="project-list-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black" id="project-list-title">
              전체 프로젝트
            </h2>
            <span className="font-mono text-[11px] font-bold text-[#17332f]/38">
              {mockProjects.length} PROJECTS
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
