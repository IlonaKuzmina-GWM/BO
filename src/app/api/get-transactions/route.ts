import { NextRequest, NextResponse } from "next/server";
import transactionsData from "@/utils/myjsonfile.json"; // Adjust the path if necessary

export async function GET(request: NextRequest) {
  // Parsing query parameters from the request
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const query = searchParams.get("query");

  // Filter transactions based on the query
  let filteredTransactions = transactionsData.transactions;

  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.txId.includes(lowerCaseQuery),
    );
  }

  // Calculate the starting and ending index for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Paginate the transactions data
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex,
  );

  // Total number of transactions for reference
  const totalTransactions = filteredTransactions.length;

  return NextResponse.json({
    transactions: paginatedTransactions,
    currentPage: page,
    totalPages: Math.ceil(totalTransactions / limit),
    totalTransactions
  });
}
