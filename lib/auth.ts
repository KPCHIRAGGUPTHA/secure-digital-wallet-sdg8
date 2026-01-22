import jwt from "jsonwebtoken"

export async function getUserFromToken(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth) throw new Error("No token")

  const token = auth.replace("Bearer ", "")
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

  return decoded
}
