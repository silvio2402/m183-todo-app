import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const username = credentials.username as string
        const password = credentials.password as string
        if (!username || !password) return null

        const user = await db.user.findUnique({ where: { username } })
        if (!user) return null

        const valid = await compare(password, user.password)
        if (!valid) return null

        return { id: user.id.toString(), name: user.username }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  },
  pages: { signIn: "/login" }
})

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
