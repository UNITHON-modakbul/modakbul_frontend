import { Braces, Check, ShieldCheck, UsersRound, Workflow } from 'lucide-react'
import { ProjectPdfUpload } from '../components/ProjectPdfUpload.tsx'

const pipelineSteps = [
  { label: 'Template', number: '01' },
  { label: 'Generate', number: '02' },
  { label: 'Verify', number: '03' },
  { label: 'Deploy', number: '04' },
]

interface ProjectStartPageProps {
  teamName: string
}

export function ProjectStartPage({ teamName }: ProjectStartPageProps) {
  return (
    <div className="demo-grid relative min-h-screen overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-24 top-28 h-64 w-64 rounded-full bg-[#d9ef7d]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-4 h-80 w-80 rounded-full bg-[#ff9b75]/35 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <a className="flex items-center gap-3" href="/" aria-label="DemoForge 홈">
          <span className="grid size-10 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[4px_4px_0_#ec6b42]">
            <Braces aria-hidden="true" size={21} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-black tracking-[-0.04em]">
            DemoForge
          </span>
        </a>

        <div className="flex items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65 backdrop-blur">
          <UsersRound aria-hidden="true" size={14} />
          <span className="max-w-28 truncate sm:max-w-52">{teamName}</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-14 pt-8 sm:px-8 sm:pt-14 lg:min-h-[calc(100vh-160px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:pb-20 lg:pt-8">
        <section>
          <div className="mb-7 inline-flex -rotate-2 items-center gap-2 rounded-lg border border-[#17332f]/15 bg-[#fff8c7] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_rgba(23,51,47,0.16)]">
            <Workflow aria-hidden="true" size={15} />
            From idea to live demo
          </div>

          <h1 className="max-w-3xl text-[clamp(2.15rem,8vw,6.7rem)] font-black leading-[0.91] tracking-[-0.075em]">
            아이디어를
            <br />
            <span className="relative inline-block whitespace-nowrap text-[#ec6b42]">
              작동하는 데모로.
              <span className="absolute -bottom-2 left-1 h-2 w-full -rotate-1 rounded-full bg-[#d9ef7d] -z-10" />
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-[#17332f]/65 sm:text-lg">
            검증된 Template 위에 필요한 도메인만 생성하고, 테스트와 배포까지
            하나의 파이프라인으로 연결합니다. 기능명세 PDF 한 장이면 시작할
            수 있어요.
          </p>

          <div className="mt-9 flex flex-wrap gap-2.5">
            {pipelineSteps.map((step) => (
              <div
                className="flex items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/45 py-2 pl-2 pr-3 text-xs font-bold backdrop-blur"
                key={step.number}
              >
                <span className="grid size-6 place-items-center rounded-full bg-[#17332f] font-mono text-[9px] text-white">
                  {step.number}
                </span>
                {step.label}
              </div>
            ))}
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 border-t border-[#17332f]/12 pt-6 text-sm text-[#17332f]/60 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Check aria-hidden="true" className="text-[#5f8a39]" size={16} />
              검증된 Repository Template
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck
                aria-hidden="true"
                className="text-[#5f8a39]"
                size={16}
              />
              Build · Test 통과 후 배포
            </p>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="gentle-float absolute -right-3 -top-8 z-20 hidden rounded-xl bg-[#ec6b42] px-4 py-3 text-xs font-black text-white shadow-[5px_5px_0_#17332f] sm:block">
            ONE INPUT,
            <br />
            FULL PIPELINE ↗
          </div>
          <ProjectPdfUpload />
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-t border-[#17332f]/10 px-5 py-5 text-[11px] font-semibold text-[#17332f]/45 sm:px-8 lg:px-10">
        <span>© 2026 DemoForge</span>
        <span>React · FastAPI · AWS</span>
      </footer>
    </div>
  )
}
