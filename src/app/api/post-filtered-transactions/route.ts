import { userUrl } from "@/helpers/useUrl";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getFilteredTransactionsRoute } from "@/helpers/getTransactionsRoute";

export async function POST(request: NextRequest) {
  const cookiesStore = cookies();
  const token = cookiesStore.get("authToken")?.value;
  const role = cookiesStore.get("userRole")?.value;

  try {
    // Read and parse the body only once
    const filters = await request.json();

    const apiUrl = userUrl(getFilteredTransactionsRoute(role));

    console.log("API URL:", apiUrl);
    console.log("Request Options:", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filters),
    });

    // Forward the filters as JSON in the fetch request body
    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filters), // Only read `filters` once from `request`
    });

    if (!data.ok) {
      const errorText = await data.text();
      console.log("Error Response Body:", errorText);
      // Parsing the error response body only once
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

    // Parse the success response body only once
    const responseData = await data.json();

    return NextResponse.json({
      totalPages: responseData.totalPages,
      totalTransactionsCount: responseData.totalTransactionsCount,
      transactions: responseData.transactions,
    });
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
