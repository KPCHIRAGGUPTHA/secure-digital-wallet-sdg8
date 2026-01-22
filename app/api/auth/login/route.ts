import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  )

  return NextResponse.json({ token })
}
