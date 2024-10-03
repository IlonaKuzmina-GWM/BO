import { NextRequest, NextResponse } from "next/server";
import transactionsData from "@/utils/myjsonfile.json";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let filteredTransactions = transactionsData.transactions;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      filteredTransactions = filteredTransactions.filter(
        (item) =>
          new Date(item.createdAt) >= fromDate &&
          new Date(item.createdAt) <= toDate,
      );
    }
  }
  else if (interval) {
    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      filteredTransactions = filteredTransactions.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= now,
      );
    }
  }

  const totalTransactions = filteredTransactions.length;

  return NextResponse.json({
    totalTransactions,
    filteredTransactions, 
  });
}
