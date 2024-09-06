import { NextRequest, NextResponse } from "next/server";
import transactionsData from "@/utils/myjsonfile.json"; // Ensure the path is correct

export async function GET(request: NextRequest) {
  return NextResponse.json({
    transactions: transactionsData.transactions,
  });
}
