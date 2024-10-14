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
import DashIntervalSelect from "@/components/shared/DashIntervalSelect";

const MainDashPage = () => {
  const [countryTableData, setCountryTableData] = useState<DashTableData[]>([]);
  const [merchnatsTableData, setMerchantsTableData] = useState<DashTableData[]>(
    [],
  );
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  // need to fix all this things
  const [merchantChartData, setMerchantChartData] = useState<
    { merchant: string; successCount: number; failedCount: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
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
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const data = [
    { x: 1, y: 23, z: 122 },
    { x: 2, y: 3, z: 73 },
    { x: 3, y: 15, z: 32 },
    { x: 4, y: 35, z: 23 },
    { x: 5, y: 45, z: 20 },
    { x: 6, y: 25, z: 29 },
    { x: 7, y: 17, z: 61 },
    { x: 8, y: 32, z: 45 },
    { x: 9, y: 43, z: 93 },
];

  const fetchTransactionsData = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        params.append("from", selectedDateRange.from.toISOString());
        params.append("to", selectedDateRange.to.toISOString());
      } else if (selectedInterval) {
        params.append("interval", selectedInterval);
      }

      const response = await fetch(
        `/api/get-transactions-analytics?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error fetching transactions: ${errorMessage}`);
      }

      const { filteredTransactions }: { filteredTransactions: Transaction[] } =
        await response.json();

      if (!filteredTransactions || filteredTransactions.length === 0) {
        setIsLoading(false);
        console.warn("No transactions found for the given filters");
        return;
      }

      const uniqueMerchants = Object.values(
        filteredTransactions.reduce(
          (
            acc: Record<string, { name: string; amount: number }>,
            transaction: Transaction,
          ) => {
            const { name } = transaction.merchant;
            const amount = parseFloat(transaction.amount);

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
        amount: merchant.amount.toFixed(2),
      }));

      setMerchantsTableData(displayMerchants);
      // setTotalTransactions(totalTransactions);
      // setTotalAmount(totalAmount.toFixed(2));
      // setChartData(formattedData);
      // setBarChartData(formattedBarData);

      // Set merchant data for the vertical composed chart
      // setMerchantChartData(
      //   Object.keys(merchantData).map((merchant) => ({
      //     merchant,
      //     ...merchantData[merchant],
      //   })),
      // );

      // console.log("transactions in dashboard:", filteredTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCountriesData = async () => {
    setIsLoading(true);

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

      if (!siin || siin.length === 0) {
        setIsLoading(false);
        console.warn("No siin found for the given filters");
        return;
      }

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

          setIsLoading(false);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
    fetchCountriesData();
  }, [selectedInterval, selectedDateRange]);

  const fetchData = async () => {
    // try {
    //   const response = await fetch("/api/get-all-transactions-data", {
    //     method: "GET",
    //   });
    //   const { transactions }: { transactions: Transaction[] } =
    //     await response.json();
    //   console.log(transactions);
    //   const groupedData: { [date: string]: any } = {};
    //   const merchantData: {
    //     [merchant: string]: { successCount: number; failedCount: number };
    //   } = {};
    //   const barData: {
    //     [date: string]: { successCount: number; failedCount: number };
    //   } = {};
    //   transactions.forEach((transaction) => {
    //     const date = new Date(transaction.createdAt)
    //       .toISOString()
    //       .split("T")[0];
    //     // Group by date
    //     if (!groupedData[date]) {
    //       groupedData[date] = {
    //         date,
    //         successAmount: 0,
    //         acceptedAmount: 0,
    //         totalAmount: 0,
    //         transactionCount: 0,
    //         successCount: 0,
    //         failedCount: 0,
    //       };
    //     }
    //     if (!barData[date]) {
    //       barData[date] = { successCount: 0, failedCount: 0 };
    //     }
    //     const amount = parseFloat(transaction.amount);
    //     groupedData[date].totalAmount += amount;
    //     groupedData[date].transactionCount += 1;
    //     if (transaction.status === "PAYMENT_SUCCESS") {
    //       groupedData[date].successAmount += amount;
    //       groupedData[date].successCount += 1;
    //       barData[date].successCount += 1;
    //     } else if (transaction.status === "PAYMENT_ACCEPTED") {
    //       groupedData[date].acceptedAmount += amount;
    //     } else if (transaction.status === "PAYMENT_FAILED") {
    //       groupedData[date].failedCount += 1;
    //       barData[date].failedCount += 1;
    //     }
    //     // Group by merchant
    //     const merchantName = transaction.merchant?.name || "Unknown Merchant";
    //     if (!merchantData[merchantName]) {
    //       merchantData[merchantName] = { successCount: 0, failedCount: 0 };
    //     }
    //     if (transaction.status === "PAYMENT_SUCCESS") {
    //       merchantData[merchantName].successCount += 1;
    //     } else if (transaction.status === "PAYMENT_FAILED") {
    //       merchantData[merchantName].failedCount += 1;
    //     }
    //   });
    //   let formattedData = Object.values(groupedData).map((item) => ({
    //     ...item,
    //     successAmount: item.successAmount.toFixed(2),
    //     acceptedAmount: item.acceptedAmount.toFixed(2),
    //   }));
    //   let formattedBarData = Object.entries(barData).map(([date, counts]) => ({
    //     date,
    //     successCount: counts.successCount,
    //     failedCount: counts.failedCount,
    //   }));
    //   formattedData = formattedData.sort(
    //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    //   );
    //   formattedBarData = formattedBarData.sort(
    //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    //   );
    //   if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
    //     formattedData = filterDataByDateRange(formattedData, selectedDateRange);
    //     formattedBarData = filterDataByDateRange(
    //       formattedBarData,
    //       selectedDateRange,
    //     );
    //   } else if (selectedInterval) {
    //     formattedData = filterDataByInterval(formattedData, selectedInterval);
    //     formattedBarData = filterDataByInterval(
    //       formattedBarData,
    //       selectedInterval,
    //     );
    //   } else {
    //     // Default: Use "this-year" if no interval or date range is selected
    //     formattedData = filterDataByInterval(formattedData, "this-year");
    //     formattedBarData = filterDataByInterval(formattedBarData, "this-year");
    //   }
    //   // Calculate totals
    //   const totalTransactions = formattedData.reduce(
    //     (acc, item) => acc + item.transactionCount,
    //     0,
    //   );
    //   const totalAmount = formattedData.reduce(
    //     (acc, item) => acc + parseFloat(item.totalAmount),
    //     0,
    //   );
    //   const filterTransactions = (
    //     transactions: Transaction[],
    //     selectedDateRange: DateRange | undefined,
    //     selectedInterval: string
    //   ) => {
    //     let filteredTransactions = transactions;
    //     if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
    //       filteredTransactions = transactions.filter(
    //         (transaction) =>
    //           new Date(transaction.createdAt) >= selectedDateRange.from! &&
    //           new Date(transaction.createdAt) <= selectedDateRange.to!
    //       );
    //     } else if (selectedInterval) {
    //       const now = new Date();
    //       let startDate = new Date();
    //       switch (selectedInterval) {
    //         case "today":
    //           startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    //           break;
    //         case "yesterday":
    //           startDate = new Date(
    //             now.getFullYear(),
    //             now.getMonth(),
    //             now.getDate() - 1
    //           );
    //           break;
    //         case "last-3-days":
    //           startDate = new Date(
    //             now.getFullYear(),
    //             now.getMonth(),
    //             now.getDate() - 2
    //           );
    //           break;
    //         case "last-7-days":
    //           startDate = new Date(
    //             now.getFullYear(),
    //             now.getMonth(),
    //             now.getDate() - 6
    //           );
    //           break;
    //         case "last-14-days":
    //           startDate = new Date(
    //             now.getFullYear(),
    //             now.getMonth(),
    //             now.getDate() - 13
    //           );
    //           break;
    //         case "this-month":
    //           startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    //           break;
    //         case "this-year":
    //           startDate = new Date(now.getFullYear(), 0, 1);
    //           break;
    //         default:
    //           return transactions;
    //       }
    //       filteredTransactions = transactions.filter(
    //         (transaction) =>
    //           new Date(transaction.createdAt) >= startDate &&
    //           new Date(transaction.createdAt) <= now
    //       );
    //     }
    //     return filteredTransactions;
    //   };
    //   const filteredTransactions = filterTransactions(
    //     transactions,
    //     selectedDateRange,
    //     selectedInterval
    //   );
    //   const uniqueMerchants = Object.values(
    //     filteredTransactions.reduce(
    //       (acc, transaction) => {
    //         const { name } = transaction.merchant;
    //         const amount = Math.round(Number(transaction.amount) * 100);
    //         if (!acc[name]) {
    //           acc[name] = { name, amount };
    //         } else {
    //           acc[name].amount += amount;
    //         }
    //         return acc;
    //       },
    //       {} as Record<string, { name: string; amount: number }>,
    //     ),
    //   );
    //   const displayMerchants = uniqueMerchants.map((merchant) => ({
    //     name: merchant.name,
    //     amount: (merchant.amount / 100).toFixed(2),
    //   }));
    //   setMerchantsTableData(displayMerchants);
    //   setTotalTransactions(totalTransactions);
    //   setTotalAmount(totalAmount.toFixed(2));
    //   setChartData(formattedData);
    //   setBarChartData(formattedBarData);
    //   // Set merchant data for the vertical composed chart
    //   setMerchantChartData(
    //     Object.keys(merchantData).map((merchant) => ({
    //       merchant,
    //       ...merchantData[merchant],
    //     })),
    //   );
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    setSelectedDateRange(undefined);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  return (
    <div className="flex w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Overview"
        description="Explore total volumes, success rates, and country-specific statistics"
      />

      <div className="flex flex-col md:flex-row">
        <DashIntervalSelect
          value={"Select Interval"}
          label="No Interval"
          onIntervalChange={handleIntervalChange}
        />

        <DatePickerWithRange onDateChange={handleDateRangeChange} />
      </div>
      <div className="flex flex-row gap-4 xl:gap-10">
        <div className="flex w-full max-w-[1149px] flex-col gap-4 xl:gap-10">
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

        <div className="flex w-[370px] flex-col gap-4 xl:gap-10">
          <DashSideTable
            loading={isLoading}
            title="Merchants"
            name="Name"
            amount="Volume"
            data={merchnatsTableData}
          />
          <DashSideTable
            loading={isLoading}
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
