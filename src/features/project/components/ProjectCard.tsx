import { ArrowUpRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router'
import { cn } from '../../../utils/cn.ts'
import type { ProjectSummary } from '../types.ts'
import { ProjectPreview } from './ProjectPreview.tsx'

interface ProjectCardProps {
  project: ProjectSummary
}

const statusStyles: Record<ProjectSummary['status'], string> = {
  '기획 보완 중': 'bg-[#fff1ea] text-[#b94727]',
  'AI 개발 중': 'bg-[#fff8c7] text-[#725f0b]',
  '실행 준비 완료': 'bg-[#e9f2cc] text-[#375226]',
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-[26px] border border-[#17332f]/13 bg-white/88 shadow-[0_14px_42px_rgba(23,51,47,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(23,51,47,0.13)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[#17332f]/10 bg-[#17332f] p-2.5 sm:p-3">
        <div className="h-full overflow-hidden rounded-xl bg-white">
          <ProjectPreview variant={project.previewVariant} />
        </div>
        <span
          className={cn(
            'absolute left-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm',
            statusStyles[project.status],
          )}
        >
          {project.status}
        </span>
      </div>

      <div className="p-5">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black tracking-[-0.035em] text-[#17332f]">
            {project.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-[#17332f]/50">
            {project.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#17332f]/9 pt-4">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-[10px] font-bold text-[#17332f]/38">
            <Clock3 aria-hidden="true" className="shrink-0" size={12} />
            {project.updatedAt}
          </span>
          <Link
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#17332f] px-4 text-xs font-black text-white shadow-[0_5px_0_#0d2421] transition hover:-translate-y-0.5 hover:bg-[#214640] hover:shadow-[0_7px_0_#0d2421] active:translate-y-1 active:shadow-[0_2px_0_#0d2421]"
            to={`/projects/${project.id}/requirements/review`}
          >
            이어 만들기
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </article>
  )
}
