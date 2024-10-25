import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFilteredTransactionsRoute } from "@/helpers/getTransactionsRoute";

export async function POST(request: NextRequest) {
  const cookiesStore = cookies();
  const token = cookiesStore.get("authToken")?.value;
  const role = cookiesStore.get("userRole")?.value;

  try {
    const filters = await request.json();

    const apiUrl = userUrl(getFilteredTransactionsRoute(role));

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
    });

    if (!data.ok) {
      console.log("transactions", data);
      const errorData = await data.json();
      return new NextResponse(
        JSON.stringify({
          error: errorData.error || "Failed to fetch siins",
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

    return NextResponse.json({
      totalPages: responseData.totalPages,
      totalTransactionsCount: responseData.totalTransactionsCount,
      transactions: responseData.transactions,
    });
  } catch (error) {
    console.error("Failed to process siins request", error);
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
