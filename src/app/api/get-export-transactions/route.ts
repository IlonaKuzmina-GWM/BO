import { NextRequest, NextResponse } from "next/server";
import transactionsData from "@/utils/myjsonfile.json"; // Adjust the path if necessary


// export function getExportTransactionsRoute (role: string) {
//   if (role === 'merchant') {
//       return '/transactions/export';
//   } else if (role === 'developer' || role === 'admin') {
//       return '/admin/export-transactions';
//   } else if (role === 'manager') {
//       return '/manager/export-transactions';
//   } else if (role === 'support') {
//       return ('/support/export-transactions')
//   } else if (role === 'refund') { // refund isnt role, just to get correct route
//       return '/admin/export-refund-transactions';
//   }
// }



export async function GET(request: NextRequest) {
  // Parsing query parameters from the request
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  // Filter transactions based on the query
  let filteredTransactions = transactionsData.transactions;

  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    filteredTransactions = filteredTransactions.filter((transaction) =>
      transaction.txId.includes(lowerCaseQuery),
    );
  }


  // Total number of transactions for reference
  const totalTransactions = filteredTransactions.length;

  return NextResponse.json({

    totalTransactions
  });
}

