"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateTask } from "@/app/actions/task"
import { Task } from "@prisma/client"
import Link from "next/link"

export default function EditTaskClient({ task }: { task: Task }) {
  const router = useRouter()
  const [title, setTitle] = useState(task.title)
  const [state, setState] = useState(task.state)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      await updateTask(task.id, title, state)
      router.push("/")
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Edit Task
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Modify the description or state of your task.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder-gray-500 outline-none transition-all duration-200"
              placeholder="e.g. Complete the security audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Initial State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white outline-none transition-all duration-200"
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <Link 
              href="/"
              className="px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
