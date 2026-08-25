import { ArrowUpRight, Braces, UsersRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../../components/ui/Button.tsx'
import { Input } from '../../../components/ui/Input.tsx'
import {
  getTeamNameError,
  TEAM_NAME_MAX_LENGTH,
} from '../utils/teamName.ts'

interface TeamNameGateProps {
  onContinue: (teamName: string) => void
}

export function TeamNameGate({ onContinue }: TeamNameGateProps) {
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = getTeamNameError(teamName)
    setError(validationError)

    if (!validationError) {
      onContinue(teamName.trim())
    }
  }

  return (
    <div className="demo-grid relative grid min-h-screen place-items-center overflow-hidden bg-[#f3f0e7] px-5 py-10 text-[#17332f]">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#d9ef7d]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/35 blur-3xl" />

      <main className="relative z-10 w-full max-w-lg">
        <a
          aria-label="DemoForge 홈"
          className="mx-auto mb-9 flex w-fit items-center gap-3"
          href="/"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[4px_4px_0_#ec6b42]">
            <Braces aria-hidden="true" size={22} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-black tracking-[-0.04em]">
            DemoForge
          </span>
        </a>

        <form
          className="rounded-[30px] border border-[#17332f]/15 bg-white/85 p-6 shadow-[0_28px_80px_rgba(23,51,47,0.14)] backdrop-blur sm:p-9"
          onSubmit={handleSubmit}
        >
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f2cc] text-[#375226] shadow-[4px_4px_0_rgba(23,51,47,0.14)]">
            <UsersRound aria-hidden="true" size={26} />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-black tracking-[0.14em] text-[#ec6b42]">
              STEP 01 · TEAM
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              먼저, 팀을 알려주세요
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#17332f]/55">
              팀 이름은 프로젝트와 생성 결과를 구분하는 고유한 이름으로
              사용됩니다.
            </p>
          </div>

          <div className="mt-8">
            <label
              className="mb-2 block text-sm font-bold text-[#17332f]"
              htmlFor="team-name"
            >
              팀 이름
            </label>
            <Input
              aria-describedby="team-name-status"
              aria-invalid={Boolean(error)}
              autoComplete="organization"
              autoFocus
              id="team-name"
              maxLength={TEAM_NAME_MAX_LENGTH}
              onChange={(event) => {
                setTeamName(event.target.value)
                setError(null)
              }}
              placeholder="예) 모닥불"
              value={teamName}
            />
            <div className="mt-2 flex min-h-5 justify-between gap-4 px-1 text-xs">
              <p
                className={error ? 'font-semibold text-[#c94d2a]' : 'text-[#17332f]/40'}
                id="team-name-status"
                role={error ? 'alert' : undefined}
              >
                {error ?? '한글, 영문, 숫자 기준 2~20자'}
              </p>
              <span className="shrink-0 font-mono text-[#17332f]/35">
                {teamName.length}/{TEAM_NAME_MAX_LENGTH}
              </span>
            </div>
          </div>

          <Button className="mt-5 w-full" size="lg" type="submit">
            이 이름으로 시작하기
            <ArrowUpRight aria-hidden="true" size={19} />
          </Button>

          <p className="mt-5 text-center text-[11px] text-[#17332f]/38">
            팀 이름의 중복 여부는 서버 연결 시 최종 확인됩니다.
          </p>
        </form>
      </main>
    </div>
  )
}
