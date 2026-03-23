"use server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createTask(title: string, state: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  await db.task.create({
    data: { title, state, userId: parseInt(session.user.id) }
  })
  revalidatePath("/")
}

export async function updateTaskState(id: number, state: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  await db.task.update({
    where: { id, userId: parseInt(session.user.id) },
    data: { state }
  })
  revalidatePath("/")
}

export async function updateTask(id: number, title: string, state: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  await db.task.update({
    where: { id, userId: parseInt(session.user.id) },
    data: { title, state }
  })
  revalidatePath("/")
}

export async function deleteTask(id: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")
  
  await db.task.delete({
    where: { id, userId: parseInt(session.user.id) }
  })
  revalidatePath("/")
}
