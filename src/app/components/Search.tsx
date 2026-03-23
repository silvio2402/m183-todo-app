"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input 
        type="search" 
        className="block w-full p-2.5 pl-10 text-sm text-white bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-gray-500 shadow-inner" 
        placeholder="Search tasks by description..." 
        defaultValue={searchParams.get("q")?.toString() || ""}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
