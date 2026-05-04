import { z } from "zod"

export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(225, "Title must be at most 225 characters"),
  state: z.enum(["open", "in progress", "done"], { message: "Invalid task state" }),
})
