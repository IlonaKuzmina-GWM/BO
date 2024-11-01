import { NextRequest, NextResponse } from "next/server";
import siin from "@/utils/siin.json";
import { paginateData } from "@/helpers/paginateDate";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const query = searchParams.get("query");

  const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") || "10"), 1);
  const paginated = searchParams.get("paginated") !== "false";

  let filteredSiin = siin;

  // Filtering by date range
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      filteredSiin = filteredSiin.filter(
        (item) =>
          new Date(item.createdAt) >= fromDate &&
          new Date(item.createdAt) <= toDate,
      );
    }
  }
  // Filtering by interval using helper function
  else if (interval) {
    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      filteredSiin = filteredSiin.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= now,
      );
    }
  }

if(query) {
  const lowerCaseQuery = query.toLowerCase();

  filteredSiin = filteredSiin.filter((siin) => {
    const txIdMatches = siin.txId.toLowerCase().includes(lowerCaseQuery);
    const senderName = siin.senderName
      ?.toLowerCase()
      .includes(lowerCaseQuery);
    const senderIban = siin.senderIban
      ?.toLowerCase()
      .includes(lowerCaseQuery);
      const senderBankCountry = siin.senderBankCountry
      ?.toLowerCase()
      .includes(lowerCaseQuery);
      const referenceCode = siin.referenceCode
      ?.toLowerCase()
      .includes(lowerCaseQuery);

    return txIdMatches || senderName || senderIban || senderBankCountry || referenceCode;
  });
}

  // Pagination after filtering
  let paginatedSiins;
  if (paginated) {
    paginatedSiins = paginateData(filteredSiin, page, limit);
  } else {
    paginatedSiins = filteredSiin;
  }

  const totalSiins = filteredSiin.length;

  return NextResponse.json({
    siin: filteredSiin,
    paginatedSiins: paginatedSiins,
    totalPages: Math.ceil(totalSiins / limit),
  });
}
