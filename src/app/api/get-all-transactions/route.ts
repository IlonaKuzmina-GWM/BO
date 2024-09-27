import { NextRequest, NextResponse } from "next/server";
import transactionsData from "@/utils/myjsonfile.json";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { paginateData } from "@/helpers/paginateDate";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "10"), 1);
  const query = searchParams.get("query");
  const paginated = searchParams.get("paginated") !== "false";
  const status = searchParams.get("status");

  const merchants = searchParams.get("merchant")?.split(",") || [];
  const providers = searchParams.get("provider")?.split(",") || [];

  let filteredTransactions = transactionsData.transactions;

  // Helper function to extract unique values from an array of objects
  // const getUniqueListBy = (arr:any, key:any) => {
  //   return [...new Map(arr.map((item:string) => [item[key], item])).values()];
  // };

  // const providersList = getUniqueListBy(
  //   transactionsData.transactions
  //     .filter((item) => item.provider && item.provider.name) // Ensure provider exists
  //     .map((item) => ({ name: item.provider.name })),
  //   "name",
  // ).map((item:any) => item.name);

  // const merchantsList = getUniqueListBy(
  //   transactionsData.transactions
  //     .filter((item) => item.merchant && item.merchant.name) // Ensure merchant exists
  //     .map((item) => ({ name: item.merchant.name })),
  //   "name",
  // ).map((item:any) => item.name);

  // Collect all merchants and providers
  const merchantsList = Array.from(
    new Set(filteredTransactions.map((tx) => tx.merchant.name)),
  );
  const providersList = Array.from(
    new Set(filteredTransactions.map((tx) => tx.provider.name)),
  );

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
  } else if (interval) {
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

  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    filteredTransactions = filteredTransactions.filter((transaction) => {
      const txIdMatches = transaction.txId
        .toLowerCase()
        .includes(lowerCaseQuery);
      const emailMatches = transaction.initialRequest?.email
        ?.toLowerCase()
        .includes(lowerCaseQuery);
      const firstNameMatches = transaction.initialRequest?.firstName
        ?.toLowerCase()
        .includes(lowerCaseQuery);
      const lastNameMatches = transaction.initialRequest?.lastName
        ?.toLowerCase()
        .includes(lowerCaseQuery);

      return txIdMatches || emailMatches || firstNameMatches || lastNameMatches;
    });
  }

  if (merchants.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      merchants.includes(transaction.merchant.name),
    );
  }

  if (providers.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      providers.includes(transaction.provider.name),
    );
  }

  // Filter by status (if selected)
  if (status && status !== "all") {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.status === status,
    );
  }

  // Pagination after filtering
  let paginatedTransactions;
  if (paginated) {
    paginatedTransactions = paginateData(filteredTransactions, page, limit);
  } else {
    paginatedTransactions = filteredTransactions;
  }

  // Total number of transactions for reference
  const totalTransactions = filteredTransactions.length;

  return NextResponse.json({
    currentPage: page,
    paginatedTransactions: paginatedTransactions,
    totalPages: Math.ceil(totalTransactions / limit),
    totalTransactions,

    filteredTransactions: filteredTransactions,
    merchantsList,
    providersList,
  });
}
