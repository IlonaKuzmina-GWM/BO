import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Function to extract cookie value by name
  const getCookieValue = (cookieName: string) => {
    const cookieValue = request.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith(`${cookieName}=`));
    return cookieValue ? cookieValue.split("=")[1] : undefined;
  };

  // Specify the cookie names you want to get
  const userId = getCookieValue("userId");
  const authToken = getCookieValue("authToken");

  // Return the values as JSON
  return NextResponse.json({
    userId: userId,
    authToken: authToken,
  });
}
