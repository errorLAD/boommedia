import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-950 text-white">
      <div className="h-16 w-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-5xl font-black mb-3">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Explore campaigns or return home.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Homepage
      </Link>
    </div>
  )
}
