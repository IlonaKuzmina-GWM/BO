import { NextRequest, NextResponse } from "next/server";
import { userUrl } from "@/helpers/useUrl";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("authToken")?.value;

  try {
    const apiUrl = userUrl("/admin/kyc");

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

    return responseData;
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
