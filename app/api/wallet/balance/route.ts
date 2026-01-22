import { getUserFromToken } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const user = await getUserFromToken(req)

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.userId }
  })

  return NextResponse.json({ balance: wallet?.balance })
}
