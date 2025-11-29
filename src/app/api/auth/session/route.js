"use server";
import { cookies } from "next/headers";
import { verifyTokenAndGetRole } from "../../../../lib/auth-helpers";

export async function POST(req) {
  const cookieStore = await cookies();

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ message: "No token provided" }, { status: 401 });
  }

  const idToken = authHeader.split("Bearer ")[1];

  // Verify token before setting cookie
  try {
    const userInfo = await verifyTokenAndGetRole(idToken);
    if (!userInfo) {
      return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    // Set cookie with token
    cookieStore.set("authToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({ 
      message: "Session created",
      user: {
        uid: userInfo.uid,
        role: userInfo.role
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token:", error);
    return Response.json({ message: "Token verification failed" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("authToken");

  return Response.json({ message: "Session deleted" }, { status: 200 });
}
