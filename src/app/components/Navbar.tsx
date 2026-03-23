"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function Navbar() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  return (
    <nav className="w-full bg-white/5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-80 transition-opacity">
          SecureTasks
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-300 font-medium hidden sm:inline-block">
                Welcome, {session.user.name}
              </span>
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 rounded-lg transition-colors duration-200">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
