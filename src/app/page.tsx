import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import TaskTable from "./components/TaskTable"
import Link from "next/link"
import Search from "./components/Search"
import { Suspense } from "react"

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined

  const tasks = await db.task.findMany({
    where: { 
      userId: parseInt(session.user.id),
      ...(query ? { title: { contains: query, mode: "insensitive" } } : {})
    },
    orderBy: { id: "desc" }
  })

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
            Your Tasks
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your secure to-do list efficiently.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
          <Suspense fallback={<div className="h-10 w-full sm:w-64 bg-white/5 animate-pulse rounded-xl" />}>
            <Search />
          </Suspense>
          <Link 
            href="/task/new" 
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            + New Task
          </Link>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        <TaskTable tasks={tasks} />
      </div>
    </div>
  )
}
