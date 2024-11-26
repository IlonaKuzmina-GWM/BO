import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;

  try {
    const filters = await request.json();

    const apiUrl = userUrl("/v2/statistics");

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
    });

    if (!data.ok) {
      const errorData = await data.json();
      return new NextResponse(
        JSON.stringify({
          error: errorData.error || "Failed to fetch statistics",
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
    console.error("Failed to process statistics request", error);
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
