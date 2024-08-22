"use client";

import ChartWrapper from "@/components/shared/Charts/ChartWrapper";
import DashPageTitle from "@/components/shared/DashPageTitle";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import LinearChart from "@/components/shared/Charts/LinearChart";
import { Transaction } from "@/types";
import { DatePickerWithRange } from "@/components/shared/DataPickerWithRange";
// import DatePickerWithRange from "@/components/shared/DataPickerWithRange";

const MainDashPage = () => {
  const [chartData, setChartData] = useState<
    { date: string; successAmount: string; acceptedAmount: string }[]
  >([]);
  const [selectedInterval, setSelectedInterval] = useState("this-year");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get-transactions", {
          method: "GET",
        });
        const transactions: Transaction[] = await response.json();

        const groupedData: { [date: string]: any } = {};

        transactions.forEach((transaction) => {
          const date = new Date(transaction.createdAt)
            .toISOString()
            .split("T")[0];

          if (!groupedData[date]) {
            groupedData[date] = {
              date,
              successAmount: 0,
              acceptedAmount: 0,
              totalAmount: 0,
              transactionCount: 0,
            };
          }

          const amount = parseFloat(transaction.amount);
          groupedData[date].totalAmount += amount;
          groupedData[date].transactionCount += 1;

          if (transaction.status === "PAYMENT_SUCCESS") {
            groupedData[date].successAmount += amount;
          } else if (transaction.status === "PAYMENT_ACCEPTED") {
            groupedData[date].acceptedAmount += amount;
          }
        });

        let formattedData = Object.values(groupedData).map((item) => ({
          ...item,
          successAmount: item.successAmount.toFixed(2),
          acceptedAmount: item.acceptedAmount.toFixed(2),
        }));

        formattedData = formattedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        if (selectedDateRange) {
          formattedData = filterDataByDateRange(
            formattedData,
            selectedDateRange,
          );
        } else {
          formattedData = filterDataByInterval(formattedData, selectedInterval);
        }

        // Calculate totals
        const totalTransactions = formattedData.reduce(
          (acc, item) => acc + item.transactionCount,
          0,
        );
        const totalAmount = formattedData.reduce(
          (acc, item) => acc + parseFloat(item.totalAmount),
          0,
        );

        setTotalTransactions(totalTransactions);
        setTotalAmount(totalAmount.toFixed(2));
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedInterval, selectedDateRange]);

  const filterDataByInterval = (
    data: { date: string; successAmount: string; acceptedAmount: string }[],
    interval: string,
  ) => {
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
          now.getDate() - 1,
        );
        break;
      case "last-3-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 2,
        );
        break;
      case "last-7-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 6,
        );
        break;
      case "last-14-days":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 13,
        );
        break;
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return data;
    }

    return data.filter(
      (item) => new Date(item.date) >= startDate && new Date(item.date) <= now,
    );
  };

  const filterDataByDateRange = (
    data: { date: string; successAmount: string; acceptedAmount: string }[],
    dateRange: DateRange,
  ) => {
    const { from, to } = dateRange;
    if (!from || !to) return data;

    return data.filter(
      (item) => new Date(item.date) >= from && new Date(item.date) <= to,
    );
  };

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInterval(event.target.value);
    setSelectedDateRange(undefined); // Reset date range if interval changes
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval(""); // Reset interval if date range is selected
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-between">
          <select
            value={selectedInterval}
            onChange={handleIntervalChange}
            className="rounded-sm border border-divider bg-white p-2 text-start text-sm text-main"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last-3-days">Last 3 Days</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-14-days">Last 14 Days</option>
            <option value="this-month">This Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>

        {/* <DatePickerWithRange onDateChange={handleDateRangeChange} /> */}

        <DatePickerWithRange/>
      </div>

      <div className="w-full">
        <ChartWrapper
          title={`Transaction Overview (${totalTransactions} Transactions)`}
          dataInterval={`Total Amount: $${totalAmount}`}
          shortOverview={[
            {
              title: `$${totalAmount}`,
              description: `${totalTransactions} Transactions`,
            },
          ]}
        >
          <LinearChart data={chartData} />
        </ChartWrapper>
      </div>
    </div>
  );
};

export default MainDashPage;
