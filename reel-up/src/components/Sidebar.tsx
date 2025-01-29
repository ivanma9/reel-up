import Link from 'next/link'
import { Home, Compass, Plus, Bell, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <nav className="w-20 h-screen bg-zinc-900 fixed left-0 top-0 flex flex-col items-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <Link 
          href="/" 
          className="text-zinc-200 hover:bg-zinc-800 p-3 rounded-lg transition-colors duration-200"
        >
          <Home size={24} />
        </Link>
        <Link 
          href="/explore" 
          className="text-zinc-200 hover:bg-zinc-800 p-3 rounded-lg transition-colors duration-200"
        >
          <Compass size={24} />
        </Link>

        {/* Upload button (middle) */}
        <button 
          className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-full transition-colors duration-200"
        >
          <Plus size={32} className="text-zinc-200" />
        </button>

        {/* Bottom section */}
        <Link 
          href="/notifications" 
          className="text-zinc-200 hover:bg-zinc-800 p-3 rounded-lg transition-colors duration-200"
        >
          <Bell size={24} />
        </Link>
        <Link 
          href="/profile" 
          className="text-zinc-200 hover:bg-zinc-800 p-3 rounded-lg transition-colors duration-200"
        >
          <User size={24} />
        </Link>
      </div>
    </nav>
  )
} 