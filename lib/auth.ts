import { verifyToken } from "@/lib/utils/jwt";

export function isAuthenticated(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = verifyToken(token);
    return decoded; // return user instead of attaching to req
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
