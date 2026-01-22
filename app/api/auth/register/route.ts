import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  const hash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
      name,
      wallet: { create: {} }
    }
  })

  return NextResponse.json({ success: true, userId: user.id })
}
