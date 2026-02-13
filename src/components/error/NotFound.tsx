import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <Link
        to="/"
        className="mt-6 flex items-center gap-x-1.5 pr-4 pl-3 text-white transition-colors py-2 text-sm font-medium hover:bg-gray-800 bg-gray-900"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Home
      </Link>
    </div>
  )
}
