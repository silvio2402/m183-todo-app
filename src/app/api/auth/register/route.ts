import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    await db.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
