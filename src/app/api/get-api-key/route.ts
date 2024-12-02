import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;

  try {

    const apiUrl = userUrl("/merchant/keys");

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
          error: errorData.error || "Failed to fetch key data",
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
    console.error("Failed to process key request", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "You can only see the keys once. You can delete and regenerate them.",
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
