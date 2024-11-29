import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Token parameter is missing" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiUrl = userUrl(`/auth/verify/${token}`);

    const data = await fetch(apiUrl, {
      method: "GET",
    });

    if (!data.ok) {
      const errorData = await data.json();

      return new NextResponse(
        JSON.stringify({
          error: errorData.error || "Failed to get-verify-token",
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

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Failed to process get-verify-token request", error);
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
