import { NextRequest, NextResponse } from "next/server";
import siin from "@/utils/siin.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get("interval");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let filteredSiin = siin;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    filteredSiin = siin.filter(
      (item) =>
        new Date(item.createdAt) >= fromDate && new Date(item.createdAt) <= toDate
    );
  } else if (interval) {
    const now = new Date();
    let startDate = new Date();

    switch (interval) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "yesterday":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );
        break;
      case "last-3-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2
        );
        break;
      case "last-7-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 6
        );
        break;
      case "last-14-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 13
        );
        break;
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    filteredSiin = siin.filter(
      (item) =>
        new Date(item.createdAt) >= startDate && new Date(item.createdAt) <= now
    );
  }

  return NextResponse.json({ siin: filteredSiin });
}