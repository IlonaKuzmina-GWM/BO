"use client";

import ChartWrapper from "@/components/shared/Charts/ChartWrapper";
import DashPageTitle from "@/components/shared/DashPageTitle";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import LinearChart from "@/components/shared/Charts/LinearChart";
import SimpleBarChart from "@/components/shared/Charts/SimpleBarChart";
import VerticalComposedChart from "@/components/shared/Charts/VerticalComposedChart";
import DatePickerWithRange from "@/components/shared/DatePickerWithRange";
import DashSideTable from "@/components/shared/Transactions/DashSideTable";
import { DashTableData, Siin, Transaction } from "@/types";

const MainDashPage = () => {
  const [chartData, setChartData] = useState<
    {
      date: string;
      successAmount: number;
      acceptedAmount: number;
      successCount: number;
      failedCount: number;
    }[]
  >([]);
  const [barChartData, setBarChartData] = useState<
    { date: string; successCount: number; failedCount: number }[]
  >([]);
  const [merchantChartData, setMerchantChartData] = useState<
    { merchant: string; successCount: number; failedCount: number }[]
  >([]);
  const [selectedInterval, setSelectedInterval] = useState("this-year");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [merchnatsTableData, setMerchantsTableData] = useState<DashTableData[]>(
    [],
  );
  const [countryTableData, setCountryTableData] = useState<DashTableData[]>([]);

  useEffect(() => {
    fetchData();
    fetchCountriesData();
  }, [selectedInterval, selectedDateRange]);

  const fetchCountriesData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        params.append("from", selectedDateRange.from.toISOString());
        params.append("to", selectedDateRange.to.toISOString());
      } else if (selectedInterval) {
        params.append("interval", selectedInterval);
      }

      const response = await fetch(`/api/get-siin?${params.toString()}`, {
        method: "GET",
      });
      const { siin }: { siin: Siin[] } = await response.json();

      const totalAmount = siin.reduce((acc, item) => {
        const amount = Math.round(Number(item.amount) * 100);
        return acc + amount;
      }, 0);

      const countryAmounts = siin.reduce(
        (acc, item) => {
          const amount = Math.round(Number(item.amount) * 100);
          const country = item.senderBankCountry;

          if (!acc[country]) {
            acc[country] = amount;
          } else {
            acc[country] += amount;
          }

          return acc;
        },
        {} as Record<string, number>,
      );

      const countryPercentages = Object.entries(countryAmounts).map(
        ([country, amount]) => ({
          name: country,
          amount: ((amount / totalAmount) * 100).toString(),
        }),
      );

      setCountryTableData(countryPercentages);

      console.log("Total Amount (in cents):", totalAmount);
      console.log("Country Percentages:", countryPercentages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-all-transactions-data", {
        method: "GET",
      });
      const { transactions }: { transactions: Transaction[] } =
        await response.json();

      console.log(transactions);

      const groupedData: { [date: string]: any } = {};
      const merchantData: {
        [merchant: string]: { successCount: number; failedCount: number };
      } = {};
      const barData: {
        [date: string]: { successCount: number; failedCount: number };
      } = {};

      transactions.forEach((transaction) => {
        const date = new Date(transaction.createdAt)
          .toISOString()
          .split("T")[0];

        // Group by date
        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            successAmount: 0,
            acceptedAmount: 0,
            totalAmount: 0,
            transactionCount: 0,
            successCount: 0,
            failedCount: 0,
          };
        }

        if (!barData[date]) {
          barData[date] = { successCount: 0, failedCount: 0 };
        }

        const amount = parseFloat(transaction.amount);
        groupedData[date].totalAmount += amount;
        groupedData[date].transactionCount += 1;

        if (transaction.status === "PAYMENT_SUCCESS") {
          groupedData[date].successAmount += amount;
          groupedData[date].successCount += 1;
          barData[date].successCount += 1;
        } else if (transaction.status === "PAYMENT_ACCEPTED") {
          groupedData[date].acceptedAmount += amount;
        } else if (transaction.status === "PAYMENT_FAILED") {
          groupedData[date].failedCount += 1;
          barData[date].failedCount += 1;
        }

        // Group by merchant
        const merchantName = transaction.merchant?.name || "Unknown Merchant";
        if (!merchantData[merchantName]) {
          merchantData[merchantName] = { successCount: 0, failedCount: 0 };
        }

        if (transaction.status === "PAYMENT_SUCCESS") {
          merchantData[merchantName].successCount += 1;
        } else if (transaction.status === "PAYMENT_FAILED") {
          merchantData[merchantName].failedCount += 1;
        }
      });

      let formattedData = Object.values(groupedData).map((item) => ({
        ...item,
        successAmount: item.successAmount.toFixed(2),
        acceptedAmount: item.acceptedAmount.toFixed(2),
      }));

      let formattedBarData = Object.entries(barData).map(([date, counts]) => ({
        date,
        successCount: counts.successCount,
        failedCount: counts.failedCount,
      }));

      formattedData = formattedData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      formattedBarData = formattedBarData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        formattedData = filterDataByDateRange(formattedData, selectedDateRange);
        formattedBarData = filterDataByDateRange(
          formattedBarData,
          selectedDateRange,
        );
      } else if (selectedInterval) {
        formattedData = filterDataByInterval(formattedData, selectedInterval);
        formattedBarData = filterDataByInterval(
          formattedBarData,
          selectedInterval,
        );
      } else {
        // Default: Use "this-year" if no interval or date range is selected
        formattedData = filterDataByInterval(formattedData, "this-year");
        formattedBarData = filterDataByInterval(formattedBarData, "this-year");
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

      const filterTransactions = (
        transactions: Transaction[],
        selectedDateRange: DateRange | undefined,
        selectedInterval: string
      ) => {
        let filteredTransactions = transactions;
      
        if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
          filteredTransactions = transactions.filter(
            (transaction) =>
              new Date(transaction.createdAt) >= selectedDateRange.from! &&
              new Date(transaction.createdAt) <= selectedDateRange.to!
          );
        } else if (selectedInterval) {
          const now = new Date();
          let startDate = new Date();
      
          switch (selectedInterval) {
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
              return transactions;
          }
      
          filteredTransactions = transactions.filter(
            (transaction) =>
              new Date(transaction.createdAt) >= startDate &&
              new Date(transaction.createdAt) <= now
          );
        }
      
        return filteredTransactions;
      };

      const filteredTransactions = filterTransactions(
        transactions,
        selectedDateRange,
        selectedInterval
      );
      
      const uniqueMerchants = Object.values(
        filteredTransactions.reduce(
          (acc, transaction) => {
            const { name } = transaction.merchant;
            const amount = Math.round(Number(transaction.amount) * 100);

            if (!acc[name]) {
              acc[name] = { name, amount };
            } else {
              acc[name].amount += amount;
            }

            return acc;
          },
          {} as Record<string, { name: string; amount: number }>,
        ),
      );

      const displayMerchants = uniqueMerchants.map((merchant) => ({
        name: merchant.name,
        amount: (merchant.amount / 100).toFixed(2),
      }));

      setMerchantsTableData(displayMerchants);

      setTotalTransactions(totalTransactions);
      setTotalAmount(totalAmount.toFixed(2));
      setChartData(formattedData);
      setBarChartData(formattedBarData);

      // Set merchant data for the vertical composed chart
      setMerchantChartData(
        Object.keys(merchantData).map((merchant) => ({
          merchant,
          ...merchantData[merchant],
        })),
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterDataByInterval = (
    data: {
      date: string;
      successCount: number;
      failedCount: number;
    }[],
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
    data: { date: string; successCount: number; failedCount: number }[],
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
    setSelectedDateRange(undefined);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-between text-sm">
          <select
            value={selectedInterval}
            onChange={handleIntervalChange}
            className="rounded-sm border border-divider bg-white px-2 py-[9px] text-start text-sm text-main"
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

        <DatePickerWithRange onDateChange={handleDateRangeChange} />

        {/* <DatePickerWithRange /> */}
      </div>
      <div className="flex flex-row gap-[40px]">
        <div className="flex w-full max-w-[1149px] flex-col gap-10">
          <ChartWrapper
            title={`Transaction Overview (${totalTransactions} Transactions)`}
            dataInterval={selectedInterval}
            shortOverview={[
              {
                title: `$${totalAmount}`,
                description: `${totalTransactions} Transactions`,
              },
            ]}
          >
            <LinearChart data={chartData} />
          </ChartWrapper>

          <ChartWrapper
            title={"Payments Rate"}
            dataInterval={selectedInterval}
            shortOverview={[
              {
                title: `$${totalAmount}`,
                description: `${totalAmount} success/decline`,
              },
            ]}
          >
            <SimpleBarChart data={barChartData} />
          </ChartWrapper>

          <ChartWrapper title={"Providers Success Rate"} dataInterval={""}>
            <VerticalComposedChart data={merchantChartData} />
          </ChartWrapper>
        </div>
        <div className="flex w-[370px] flex-col gap-[40px]">
          <DashSideTable
            title="Merchants"
            name="Name"
            amount="Volume"
            data={merchnatsTableData}
          />
          <DashSideTable
            title="Geo Data"
            name="Country"
            amount="%"
            data={countryTableData}
          />
        </div>
      </div>
    </div>
  );
};

export default MainDashPage;
