"use client";

import ChartWrapper from "@/components/shared/MainDashboard/Charts/ChartWrapper";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import DashIntervalSelect from "@/components/shared/DashIntervalSelect";
import DatePickerWithRange from "@/components/shared/DatePickerWithRange";
import SimpleBarChart from "@/components/shared/MainDashboard/Charts/SimpleBarChart";
import VerticalComposedChart from "@/components/shared/MainDashboard/Charts/VerticalComposedChart";

import LinearChart from "@/components/shared/MainDashboard/Charts/LinearChart";
import GeoDashSideTable from "@/components/shared/Transactions/GeoDashSideTable";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { getDateRanges } from "@/hooks/getDateRanges";
import { useStore } from "@/stores/StoreProvider";
import {
  Geo,
  MerchantStat,
  ProviderStats,
  Rate,
  Volume,
} from "@/types/statistics";
import MerchantDashSideTable from "../Transactions/MerchantDashSideTable";

const MainDashboardWrapper = () => {
  const { alertStore } = useStore();
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: firstDayOfMonth, to: lastDayOfMonth };
  });
  const [isLoading, setLoading] = useState(false);

  const [grossVolumeChart, setGrossVolumeChart] = useState<Volume>();
  const [paymentsRateBarChart, setPaymentsRateBarChart] = useState<Rate>();
  const [providersSuccessRateChart, setProvidersSuccessRateChart] = useState<
    ProviderStats[]
  >([]);
  const [countryTableData, setCountryTableData] = useState<Geo>();
  const [merchantsTableData, setMerchantsTableData] = useState<MerchantStat[]>(
    [],
  );

  const fetchStatisticsData = async () => {
    setLoading(true);

    const { createdDateRange } = getDateRanges(selectedDateRange);

    try {
      const response = await fetch("/api/post-statistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdDateRange,
          merchantIds: [],
          providerIds: [],
        }),
      });

      if (response.ok) {
        const res = await response.json();

        setGrossVolumeChart(res.volume);
        setPaymentsRateBarChart(res.rate);
        setProvidersSuccessRateChart(res.provider);
        setCountryTableData(res.geo);
        setMerchantsTableData(res.merchantStats);

        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } else {
        alertStore.setAlert("warning", "Analytics data response failed.");
      }
    } catch (error) {
      alertStore.setAlert("error", `Oops! Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
  }, [selectedInterval, selectedDateRange]);

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      const dateRange: DateRange = { from: startDate, to: now };
      setSelectedDateRange(dateRange);
    } else {
      setSelectedDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex flex-col md:flex-row">
        <DashIntervalSelect
          value={"Select Interval"}
          label="No Interval"
          onIntervalChange={handleIntervalChange}
        />

        <DatePickerWithRange
          initialDate={selectedDateRange}
          onDateChange={handleDateRangeChange}
        />
      </div>
      <div className="flex flex-row gap-4 xl:gap-10">
        <div className="flex w-full max-w-[1149px] flex-col gap-4 xl:gap-10">
          {grossVolumeChart && (
            <ChartWrapper
              title={`Gross`}
              loading={isLoading}
              dataInterval={
                selectedDateRange
                  ? {
                      from: selectedDateRange.from?.toISOString() || "",
                      to: selectedDateRange.to?.toISOString() || "",
                    }
                  : { from: "", to: "" }
              }
              shortOverview={[
                {
                  title: `${grossVolumeChart.totalVol}`,
                  description: `${grossVolumeChart.totalTransactionCount} Transactions`,
                },
              ]}
            >
              <LinearChart data={grossVolumeChart.dailyStats} />
            </ChartWrapper>
          )}

          {paymentsRateBarChart && (
            <ChartWrapper
              title={"Payments Rate"}
              loading={isLoading}
              dataInterval={
                selectedDateRange
                  ? {
                      from: selectedDateRange.from?.toISOString() || "",
                      to: selectedDateRange.to?.toISOString() || "",
                    }
                  : { from: "", to: "" }
              }
              shortOverview={[
                {
                  title: `${paymentsRateBarChart.successPercentage}%`,
                  description: `${paymentsRateBarChart.totalSuccess}/${paymentsRateBarChart.totalDeclined} success/decline`,
                },
              ]}
            >
              <SimpleBarChart data={paymentsRateBarChart.dailyStats} />
            </ChartWrapper>
          )}

          {providersSuccessRateChart && (
            <ChartWrapper
              title={"Providers Success Rate"}
              loading={isLoading}
              dataInterval={
                selectedDateRange
                  ? {
                      from: selectedDateRange.from?.toISOString() || "",
                      to: selectedDateRange.to?.toISOString() || "",
                    }
                  : { from: "", to: "" }
              }
            >
              <VerticalComposedChart data={providersSuccessRateChart} />
            </ChartWrapper>
          )}
        </div>

        <div className="flex flex-col gap-4 xl:gap-10">
          {merchantsTableData && (
            <MerchantDashSideTable
              loading={isLoading}
              title="Merchants"
              name="Name"
              amount="Volume"
              data={merchantsTableData}
            />
          )}

          {countryTableData && (
            <GeoDashSideTable
              loading={isLoading}
              title="Geo Data"
              name="Country"
              amount="%"
              data={countryTableData.countryStats}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboardWrapper;
