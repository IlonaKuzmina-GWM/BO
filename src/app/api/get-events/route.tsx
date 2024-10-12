import { NextRequest, NextResponse } from "next/server";
import logs from "@/utils/logs.json";
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

  let logsList = logs;

  // Filtering by date range
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      logsList = logsList.filter(
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
      logsList = logsList.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= now,
      );
    }
  }

  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    logsList = logsList.filter((log) => {
      const logPerson = log.person?.toLowerCase().includes(lowerCaseQuery);
      const logAction = log.action?.toLowerCase().includes(lowerCaseQuery);
      const logType = log.type?.toLowerCase().includes(lowerCaseQuery);

      return logPerson || logAction  || logType;
    });
  }

  // Pagination after filtering
  let paginatedLogs;
  if (paginated) {
    paginatedLogs = paginateData(logsList, page, limit);
  } else {
    paginatedLogs = logsList;
  }

  const totalLogs = logsList.length;

  return NextResponse.json({
    logsData: logsList,
    paginatedLogs: paginatedLogs,
    totalPages: Math.ceil(totalLogs / limit),
  });
}
