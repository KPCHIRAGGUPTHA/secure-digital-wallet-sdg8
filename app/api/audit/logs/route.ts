import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const auth = await getUserFromToken(req)

  const logs = await prisma.auditLog.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(logs)
}
