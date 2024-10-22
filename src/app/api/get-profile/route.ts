import { NextRequest, NextResponse } from "next/server";
import { userUrl } from "@/helpers/useUrl";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookiesStore = cookies();

  const token = cookiesStore.get("authToken")?.value;

  try {
    const apiUrl = userUrl("/auth/profile");

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
    const userRole = responseData.role;

    const response = NextResponse.json(responseData, { status: 200 });

    response.cookies.set("userId", String(userId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("userRole", String(userRole), {
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
