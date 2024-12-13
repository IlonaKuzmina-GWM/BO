import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userUrl } from "@/helpers/useUrl";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;

  try {
    const formData = await request.json();
    const apiUrl = userUrl("/users/create-agent");

    const data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!data.ok) {
      const errorText = await data.text();

      return new NextResponse(
        JSON.stringify({
          error: errorText || "Failed to create agent account",
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
    console.error("Failed to process account creation request", error);

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
