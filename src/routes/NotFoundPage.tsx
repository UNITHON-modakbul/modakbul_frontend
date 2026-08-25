import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-slate-950">
      <section className="text-center">
        <p className="text-sm font-semibold tracking-[0.18em] text-blue-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <Link
          className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          to="/"
        >
          홈으로 이동
        </Link>
      </section>
    </main>
  )
}
