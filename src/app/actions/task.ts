"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { taskSchema } from "@/lib/schemas";
import { tryCatch, TryCatchResult } from "@/lib/tryCatch";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createTask(title: string, state: string): Promise<TryCatchResult<null>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = taskSchema.safeParse({ title, state });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const result = await tryCatch(() =>
    db.task.create({ data: { title: parsed.data.title, state: parsed.data.state, userId: parseInt(session.user.id) } })
  );
  if (!result.success) return result;

  revalidatePath("/");
  return { success: true, data: null };
}

export async function updateTaskState(id: number, state: string): Promise<TryCatchResult<null>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = taskSchema.shape.state.safeParse(state);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const result = await tryCatch(() =>
    db.task.update({ where: { id, userId: parseInt(session.user.id) }, data: { state: parsed.data } })
  );
  if (!result.success) return result;

  revalidatePath("/");
  return { success: true, data: null };
}

export async function updateTask(id: number, title: string, state: string): Promise<TryCatchResult<null>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = taskSchema.safeParse({ title, state });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const result = await tryCatch(() =>
    db.task.update({ where: { id, userId: parseInt(session.user.id) }, data: { title: parsed.data.title, state: parsed.data.state } })
  );
  if (!result.success) return result;

  revalidatePath("/");
  return { success: true, data: null };
}

export async function deleteTask(id: number): Promise<TryCatchResult<null>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const result = await tryCatch(() =>
    db.task.delete({ where: { id, userId: parseInt(session.user.id) } })
  );
  if (!result.success) return result;

  revalidatePath("/");
  return { success: true, data: null };
}
