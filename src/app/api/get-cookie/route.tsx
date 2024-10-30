import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;
  const userId = cookiesStore.get("userId")?.value;

  return NextResponse.json({
    userId: userId,
    authToken: token,
  });
}
