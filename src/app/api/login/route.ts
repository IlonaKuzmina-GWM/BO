import { NextRequest, NextResponse } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Import jwt-decode

// http://127.0.0.1:8000

// A mock function to simulate backend authentication
async function authenticateUser(email: string, password: string) {
  if (email === "admin@siquro.com" && password === "password987") {
    return {
      token: "mock.jwt.token", // Mock JWT token
      userRole: "admin", // Mock role
    };
  }
  throw new Error("Invalid email or password");
}

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

    // Authenticate the user (mock logic)
    const { token, userRole } = await authenticateUser(email, password);

    // Create the response and set cookies
    const response = new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // const data = await fetch(`http://127.0.0.1:8000/auth/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // });

    // if (!data.ok) {
    //   const errorData = await data.json();
    //   return new NextResponse(
    //     JSON.stringify({
    //       error: errorData.error || "Invalid email or password",
    //     }),
    //     {
    //       status: data.status,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     },
    //   );
    // }

    // const responseData = await data.json();
    // const { token } = responseData;

    // const decodedToken = jwtDecode(token);

    //   const customToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzaXF1cm8uY29tIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTcyNjkyODI0NiwiZXhwIjoxNzI2OTM5MDQ2fQ.KdCRIYMWYy5c2p-YBdMc-JaWrsRZ773qtu_sQDTfwlI"

    // const response = new NextResponse(JSON.stringify({ token }), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // Set the token and userRole in cookies
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("userRole", userRole, {
      httpOnly: false, // Can be accessed on the client side
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
