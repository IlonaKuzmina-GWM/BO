"use client";

import ChartWrapper from "@/components/shared/Charts/ChartWrapper";
import DashPageTitle from "@/components/shared/DashPageTitle";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

// import LinearChart from "@/components/shared/Charts/LinearChart";
import SimpleBarChart from "@/components/shared/Charts/SimpleBarChart";
import VerticalComposedChart from "@/components/shared/Charts/VerticalComposedChart";
import DatePickerWithRange from "@/components/shared/DatePickerWithRange";
import DashSideTable from "@/components/shared/Transactions/DashSideTable";
import { DashTableData } from "@/types";
import DashIntervalSelect from "@/components/shared/DashIntervalSelect";

import { useRouter } from "next/navigation";
import Alert from "@/components/UI/Alert";
import { transaction } from "mobx";
import { useStore } from "@/stores/StoreProvider";

import dynamic from "next/dynamic";

const LinearChart = dynamic(
  () => import("@/components/shared/Charts/LinearChart"),
  {
    ssr: false,
  },
);

const BiaxialLineChartData = [
  {
    date: "2024-11-01T00:00:00.000Z",
    vol: 23,
    transaction: 122,
  },
  {
    date: "2024-11-02T00:00:00.000Z",
    vol: 3,
    transaction: 73,
  },
  {
    date: "2024-11-03T00:00:00.000Z",
    vol: 15,
    transaction: 32,
  },
  {
    date: "2024-11-04T00:00:00.000Z",
    vol: 35,
    transaction: 23,
  },
  {
    date: "2024-11-05T00:00:00.000Z",
    vol: 43,
    transaction: 142,
  },
  {
    date: "2024-11-06T00:00:00.000Z",
    vol: 43,
    transaction: 53,
  },
  {
    date: "2024-11-07T00:00:00.000Z",
    vol: 68,
    transaction: 83,
  },
  {
    date: "2024-11-08T00:00:00.000Z",
    vol: 90,
    transaction: 46,
  },
  {
    date: "2024-11-09T00:00:00.000Z",
    vol: 62,
    transaction: 167,
  },
  {
    date: "2024-11-10T00:00:00.000Z",
    vol: 35,
    transaction: 55,
  },
  {
    date: "2024-11-11T00:00:00.000Z",
    vol: 89,
    transaction: 15,
  },
  {
    date: "2024-11-12T00:00:00.000Z",
    vol: 30,
    transaction: 33,
  },
  {
    date: "2024-11-13T00:00:00.000Z",
    vol: 99,
    transaction: 18,
  },
  {
    date: "2024-11-14T00:00:00.000Z",
    vol: 15,
    transaction: 49,
  },
  {
    date: "2024-11-15T00:00:00.000Z",
    vol: 74,
    transaction: 153,
  },
  {
    date: "2024-11-16T00:00:00.000Z",
    vol: 24,
    transaction: 114,
  },
  {
    date: "2024-11-17T00:00:00.000Z",
    vol: 57,
    transaction: 12,
  },
  {
    date: "2024-11-18T00:00:00.000Z",
    vol: 84,
    transaction: 24,
  },
  {
    date: "2024-11-19T00:00:00.000Z",
    vol: 70,
    transaction: 157,
  },
  {
    date: "2024-11-20T00:00:00.000Z",
    vol: 14,
    transaction: 170,
  },
  {
    date: "2024-11-21T00:00:00.000Z",
    vol: 78,
    transaction: 143,
  },
  {
    date: "2024-11-22T00:00:00.000Z",
    vol: 46,
    transaction: 86,
  },
  {
    date: "2024-11-23T00:00:00.000Z",
    vol: 12,
    transaction: 83,
  },
  {
    date: "2024-11-24T00:00:00.000Z",
    vol: 91,
    transaction: 130,
  },
  {
    date: "2024-11-25T00:00:00.000Z",
    vol: 24,
    transaction: 125,
  },
  {
    date: "2024-11-26T00:00:00.000Z",
    vol: 35,
    transaction: 147,
  },
  {
    date: "2024-11-27T00:00:00.000Z",
    vol: 8,
    transaction: 33,
  },
  {
    date: "2024-11-28T00:00:00.000Z",
    vol: 91,
    transaction: 27,
  },
  {
    date: "2024-11-29T00:00:00.000Z",
    vol: 64,
    transaction: 117,
  },
  {
    date: "2024-11-30T00:00:00.000Z",
    vol: 6,
    transaction: 55,
  },
  {
    date: "2024-12-01T00:00:00.000Z",
    vol: 30,
    transaction: 78,
  },
  {
    date: "2024-12-02T00:00:00.000Z",
    vol: 34,
    transaction: 72,
  },
  {
    date: "2024-12-03T00:00:00.000Z",
    vol: 53,
    transaction: 144,
  },
  {
    date: "2024-12-04T00:00:00.000Z",
    vol: 73,
    transaction: 157,
  },
  {
    date: "2024-12-05T00:00:00.000Z",
    vol: 43,
    transaction: 115,
  },
  {
    date: "2024-12-06T00:00:00.000Z",
    vol: 41,
    transaction: 194,
  },
  {
    date: "2024-12-07T00:00:00.000Z",
    vol: 86,
    transaction: 174,
  },
  {
    date: "2024-12-08T00:00:00.000Z",
    vol: 71,
    transaction: 160,
  },
  {
    date: "2024-12-09T00:00:00.000Z",
    vol: 70,
    transaction: 137,
  },
  {
    date: "2024-12-10T00:00:00.000Z",
    vol: 84,
    transaction: 41,
  },
  {
    date: "2024-12-11T00:00:00.000Z",
    vol: 17,
    transaction: 51,
  },
  {
    date: "2024-12-12T00:00:00.000Z",
    vol: 79,
    transaction: 138,
  },
  {
    date: "2024-12-13T00:00:00.000Z",
    vol: 69,
    transaction: 181,
  },
  {
    date: "2024-12-14T00:00:00.000Z",
    vol: 43,
    transaction: 155,
  },
  {
    date: "2024-12-15T00:00:00.000Z",
    vol: 2,
    transaction: 74,
  },
  {
    date: "2024-12-16T00:00:00.000Z",
    vol: 86,
    transaction: 80,
  },
  {
    date: "2024-12-17T00:00:00.000Z",
    vol: 21,
    transaction: 161,
  },
  {
    date: "2024-12-18T00:00:00.000Z",
    vol: 67,
    transaction: 93,
  },
  {
    date: "2024-12-19T00:00:00.000Z",
    vol: 14,
    transaction: 196,
  },
  {
    date: "2024-12-20T00:00:00.000Z",
    vol: 83,
    transaction: 168,
  },
  {
    date: "2024-12-21T00:00:00.000Z",
    vol: 75,
    transaction: 82,
  },
  {
    date: "2024-12-22T00:00:00.000Z",
    vol: 79,
    transaction: 163,
  },
  {
    date: "2024-12-23T00:00:00.000Z",
    vol: 45,
    transaction: 191,
  },
  {
    date: "2024-12-24T00:00:00.000Z",
    vol: 97,
    transaction: 181,
  },
];

const BarChartData = [
  {
    date: "2024-11-01T00:00:00.000Z",
    success: 29,
    declined: 108,
  },
  {
    date: "2024-11-02T00:00:00.000Z",
    success: 25,
    declined: 122,
  },
  {
    date: "2024-11-03T00:00:00.000Z",
    success: 33,
    declined: 123,
  },
  {
    date: "2024-11-04T00:00:00.000Z",
    success: 80,
    declined: 102,
  },
  {
    date: "2024-11-05T00:00:00.000Z",
    success: 27,
    declined: 111,
  },
  {
    date: "2024-11-06T00:00:00.000Z",
    success: 53,
    declined: 73,
  },
  {
    date: "2024-11-07T00:00:00.000Z",
    success: 88,
    declined: 109,
  },
  {
    date: "2024-11-08T00:00:00.000Z",
    success: 48,
    declined: 148,
  },
  {
    date: "2024-11-09T00:00:00.000Z",
    success: 57,
    declined: 110,
  },
  {
    date: "2024-11-10T00:00:00.000Z",
    success: 16,
    declined: 156,
  },
  {
    date: "2024-11-11T00:00:00.000Z",
    success: 22,
    declined: 106,
  },
  {
    date: "2024-11-12T00:00:00.000Z",
    success: 81,
    declined: 72,
  },
  {
    date: "2024-11-13T00:00:00.000Z",
    success: 41,
    declined: 54,
  },
  {
    date: "2024-11-14T00:00:00.000Z",
    success: 51,
    declined: 90,
  },
  {
    date: "2024-11-15T00:00:00.000Z",
    success: 90,
    declined: 105,
  },
  {
    date: "2024-11-16T00:00:00.000Z",
    success: 42,
    declined: 102,
  },
  {
    date: "2024-11-17T00:00:00.000Z",
    success: 93,
    declined: 138,
  },
  {
    date: "2024-11-18T00:00:00.000Z",
    success: 77,
    declined: 133,
  },
  {
    date: "2024-11-19T00:00:00.000Z",
    success: 48,
    declined: 72,
  },
  {
    date: "2024-11-20T00:00:00.000Z",
    success: 36,
    declined: 69,
  },
  {
    date: "2024-11-21T00:00:00.000Z",
    success: 83,
    declined: 83,
  },
  {
    date: "2024-11-22T00:00:00.000Z",
    success: 89,
    declined: 172,
  },
  {
    date: "2024-11-23T00:00:00.000Z",
    success: 73,
    declined: 164,
  },
  {
    date: "2024-11-24T00:00:00.000Z",
    success: 89,
    declined: 58,
  },
  {
    date: "2024-11-25T00:00:00.000Z",
    success: 96,
    declined: 142,
  },
  {
    date: "2024-11-26T00:00:00.000Z",
    success: 95,
    declined: 64,
  },
  {
    date: "2024-11-27T00:00:00.000Z",
    success: 71,
    declined: 148,
  },
  {
    date: "2024-11-28T00:00:00.000Z",
    success: 63,
    declined: 166,
  },
  {
    date: "2024-11-29T00:00:00.000Z",
    success: 70,
    declined: 65,
  },
  {
    date: "2024-11-30T00:00:00.000Z",
    success: 72,
    declined: 69,
  },
  {
    date: "2024-12-01T00:00:00.000Z",
    success: 12,
    declined: 166,
  },
  {
    date: "2024-12-02T00:00:00.000Z",
    success: 93,
    declined: 163,
  },
  {
    date: "2024-12-03T00:00:00.000Z",
    success: 95,
    declined: 50,
  },
  {
    date: "2024-12-04T00:00:00.000Z",
    success: 46,
    declined: 121,
  },
  {
    date: "2024-12-05T00:00:00.000Z",
    success: 72,
    declined: 185,
  },
  {
    date: "2024-12-06T00:00:00.000Z",
    success: 41,
    declined: 160,
  },
  {
    date: "2024-12-07T00:00:00.000Z",
    success: 41,
    declined: 145,
  },
  {
    date: "2024-12-08T00:00:00.000Z",
    success: 32,
    declined: 105,
  },
  {
    date: "2024-12-09T00:00:00.000Z",
    success: 30,
    declined: 152,
  },
  {
    date: "2024-12-10T00:00:00.000Z",
    success: 59,
    declined: 152,
  },
  {
    date: "2024-12-11T00:00:00.000Z",
    success: 79,
    declined: 153,
  },
  {
    date: "2024-12-12T00:00:00.000Z",
    success: 86,
    declined: 184,
  },
  {
    date: "2024-12-13T00:00:00.000Z",
    success: 91,
    declined: 60,
  },
  {
    date: "2024-12-14T00:00:00.000Z",
    success: 16,
    declined: 86,
  },
  {
    date: "2024-12-15T00:00:00.000Z",
    success: 92,
    declined: 101,
  },
  {
    date: "2024-12-16T00:00:00.000Z",
    success: 75,
    declined: 107,
  },
  {
    date: "2024-12-17T00:00:00.000Z",
    success: 40,
    declined: 113,
  },
  {
    date: "2024-12-18T00:00:00.000Z",
    success: 48,
    declined: 87,
  },
  {
    date: "2024-12-19T00:00:00.000Z",
    success: 87,
    declined: 122,
  },
  {
    date: "2024-12-20T00:00:00.000Z",
    success: 51,
    declined: 94,
  },
];

const VerticalBarChartData = [
  {
    merchant: "Merchant G",
    success: 25,
    declined: 122,
  },
  {
    merchant: "Merchant M",
    success: 33,
    declined: 123,
  },
  {
    merchant: "Merchant T",
    success: 80,
    declined: 102,
  },
  {
    merchant: "Merchant N",
    success: 27,
    declined: 111,
  },
  {
    merchant: "Merchant L",
    success: 53,
    declined: 73,
  },
  {
    merchant: "Merchant E",
    success: 88,
    declined: 109,
  },
  {
    merchant: "Merchant O",
    success: 48,
    declined: 148,
  },
  {
    merchant: "Merchant J",
    success: 16,
    declined: 156,
  },
];

const MainDashPage = () => {
  const { alertStore } = useStore();
  const [countryTableData, setCountryTableData] = useState<DashTableData[]>([]);
  const [merchnatsTableData, setMerchantsTableData] = useState<DashTableData[]>(
    [],
  );
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);

  const [grossVolumeChart, setGrossVolumeChart] =
    useState(BiaxialLineChartData);
  const [paymentsRateBarChart, setPaymentsRateBarChart] =
    useState(BarChartData);
  const [providersSuccessRateChart, setProvidersSuccessRateChart] =
    useState(VerticalBarChartData);

  // const fetchAnalyticsData = async () => {
  //   setLoading(true);

  //   let createdDateRange: [number, number] | boolean = false;

  //   if (selectedDateRange?.from && selectedDateRange.to) {
  //     const adjustedToDate = new Date(selectedDateRange.to);
  //     adjustedToDate.setHours(23, 59, 59, 999);
  //     createdDateRange = [
  //       selectedDateRange.from.getTime(),
  //       adjustedToDate.getTime(),
  //     ];
  //   }

  //   const updatedDateRange: [number, number] | boolean = false;

  //   try {
  //     const response = await fetch("/api/post-filtered-transactions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         createdDateRange,
  //         updatedDateRange,
  //       }),
  //     });

  //     if (response.ok) {
  //       const res = await response.json();

  //       setGrossVolumeChart(res.transactions);
  //       setPaymentsRateBarChart(res.totalPages);

  //       console.log("transaction data", res);
  //     } else {
  //       alertStore.setAlert("warning", "Analitycs data response failed.");
  //     }
  //   } catch (error) {
  //     alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
  //   }
  // };

  // useEffect(() => {
  //   fetchAnalyticsData();
  // }, [selectedInterval, selectedDateRange]);

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
            title={`Transaction Overview (${""} Transactions)`}
            dataInterval={selectedInterval}
            shortOverview={[
              {
                title: `$${""}`,
                description: `${""} Transactions`,
              },
            ]}
          >
            <LinearChart data={grossVolumeChart} />
          </ChartWrapper>

          <ChartWrapper
            title={"Payments Rate"}
            dataInterval={selectedInterval}
            shortOverview={[
              {
                title: `$${""}`,
                description: `${""} success/decline`,
              },
            ]}
          >
            <SimpleBarChart data={paymentsRateBarChart} />
          </ChartWrapper>

          <ChartWrapper title={"Providers Success Rate"} dataInterval={""}>
            <VerticalComposedChart data={providersSuccessRateChart} />
          </ChartWrapper>
        </div>

        {/* <div className="flex flex-row gap-4 xl:gap-10">
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
        </div> */}
      </div>
    </div>
  );
};

export default MainDashPage;
