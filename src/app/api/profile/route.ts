import { NextRequest, NextResponse } from "next/server";
import { userUrl } from "@/helpers/useUrl";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];

    const apiUrl = userUrl("/auth/profile");

    // const apiUrl ='https://pay.siquro.com/auth/profile';

    const data = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data.ok) {
      const errorData = await data.json();
      return new NextResponse(
        JSON.stringify({
          error: errorData.error || "Failed to fetch profile",
        }),
        {
          status: data.status,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const responseData = await data.json();

    const userId = responseData.id;

    // Ensure userId is available
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in response data" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(responseData, { status: 200 });

    response.cookies.set("userId", String(userId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to process profile request", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Failed to process the request",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
