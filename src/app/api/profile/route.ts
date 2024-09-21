import { NextRequest, NextResponse } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode"; // Import jwt-decode

export async function GET(request: NextRequest) {
    try {
        // Fetch the profile data from the backend API
        const data = await fetch(`http://127.0.0.1:8000/auth/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response from the API is successful
        if (!data.ok) {
            const errorData = await data.json();
            return new NextResponse(
                JSON.stringify({ error: errorData.error || "Invalid email or password" }),
                {
                    status: data.status,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Parse the response from the API
        const responseData = await data.json();
        const { userId, token } = responseData;

        // Set the userId in a cookie
        const response = new NextResponse(JSON.stringify({ userId }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

        response.cookies.set("authId", userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure flag for production
            sameSite: "lax",
            path: "/",
        });

        // Optionally decode the JWT token
        const decodedToken = jwtDecode(token); // Assuming the token is a JWT and you want to decode it

        return response; // Return the NextResponse with the cookie set
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
            }
        );
    }
}
