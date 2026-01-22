import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { amount } = await req.json()
  const auth = await getUserFromToken(req)

  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({
      where: { userId: auth.userId }
    })

    if (!wallet || wallet.isFrozen)
      throw new Error("Wallet unavailable")

    if (wallet.balance < amount)
      throw new Error("Insufficient balance")

    await tx.wallet.update({
      where: { userId: auth.userId },
      data: { balance: { decrement: amount } }
    })

    const txn = await tx.transaction.create({
      data: {
        userId: auth.userId,
        type: "SEND",
        amount,
        status: "SUCCESS"
      }
    })

    await tx.auditLog.create({
      data: {
        userId: auth.userId,
        action: `SEND ${amount}`
      }
    })

    return NextResponse.json({ success: true, transactionId: txn.id })
  })
}
