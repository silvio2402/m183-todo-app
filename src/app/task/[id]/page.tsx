import { db } from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import EditTaskClient from "./EditTaskClient"

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const { id: paramId } = await params;
  const id = parseInt(paramId)
  if (isNaN(id)) return <div className="text-center p-8 text-red-400">Invalid Task ID</div>

  const task = await db.task.findUnique({
    where: { 
      id,
      userId: parseInt(session.user.id)
    }
  })

  if (!task) return <div className="text-center p-8 text-red-400">Task protected or not found</div>

  return <EditTaskClient task={task} />
}
