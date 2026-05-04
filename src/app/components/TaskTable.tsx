"use client"
import { useTransition } from "react"
import { updateTaskState, deleteTask } from "@/app/actions/task"
import { Task } from "@prisma/client"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"

export default function TaskTable({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)

  // Sync state cleanly when server actions complete and new props arrive
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const stateMutation = useMutation({
    mutationFn: async ({ id, state }: { id: number, state: string }) => {
      const result = await updateTaskState(id, state)
      if (!result.success) throw new Error(typeof result.error === "string" ? result.error : "Something went wrong")
    },
    onMutate: async ({ id, state }) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, state } : t))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteTask(id)
      if (!result.success) throw new Error(typeof result.error === "string" ? result.error : "Something went wrong")
    },
    onMutate: async (id) => {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  })

  const handleStateChange = (id: number, newState: string) => {
    stateMutation.mutate({ id, state: newState })
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
        <p className="text-lg">No tasks found. Create one to get started!</p>
      </div>
    )
  }

  const options = ["open", "in progress", "done"]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4 font-semibold">Description</th>
            <th className="px-6 py-4 font-semibold">State</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-white/5 transition-colors duration-150">
              <td className="px-6 py-4 text-gray-200 font-medium">
                {task.title}
              </td>
              <td className="px-6 py-4">
                <select
                  disabled={stateMutation.isPending}
                  value={task.state}
                  onChange={(e) => handleStateChange(task.id, e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 outline-none disabled:opacity-50"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt} className="bg-gray-800">
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                <Link
                  href={`/task/${task.id}`}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 rounded-md transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-md transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
