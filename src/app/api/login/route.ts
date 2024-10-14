import { NextRequest, NextResponse } from "next/server";
import { userUrl } from "@/helpers/useUrl";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Email and password are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const apiUrl = userUrl('/auth/login');

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!data.ok) {
      const errorData = await data.json();
      return new NextResponse(
        JSON.stringify({
          error: errorData.error || "Invalid email or password",
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
    const { token } = responseData;

    const response = new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to process login request", error);
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
