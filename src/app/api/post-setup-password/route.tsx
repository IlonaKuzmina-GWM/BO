import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiUrl = userUrl("/auth/password");

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${body.token}`
      },
      body: JSON.stringify({
        password: body.password,
        repeatPassword: body.repeatPassword
      }),
    });

    if (!data.ok) {
      const errorData = await data.json();
      console.log('errorData: ', errorData)
      return new NextResponse(
        JSON.stringify({
          error: errorData.error || errorData.message || "Failed to set up password",
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
    console.log('responseData: ', responseData)

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Failed to process setup password request", error);
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
