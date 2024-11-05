import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFilteredTransactionsRoute } from "@/helpers/getTransactionsRoute";
import { getMerchantsRoute } from "@/helpers/getMerchantsRoute";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;
  const role = cookiesStore.get("userRole")?.value;

  try {
    const filters = await request.json();
    const apiUrl = userUrl(getMerchantsRoute(role));

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
    });

    if (!data.ok) {
      const errorText = await data.text();

      return new NextResponse(
        JSON.stringify({
          error: errorText || "Failed to fetch siins",
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
    console.error("Failed to process transaction request", error);

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
