"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import CalculationControls from "@/components/shared/Settlement/CalculationControls";
import SettlementInfo from "@/components/shared/Settlement/SettlementInfo";
import Spinner from "@/components/UI/Spinner";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { justMockedSettlementData } from "./justmockedDataWhichShouldBeRemovedLater";

const SettlementPage = () => {
  const [showSettlementInfo, setShowSettlementInfo] = useState(false);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [manager, setManager] = useState<string>("");
  const [settlements, setSettlements] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [interval, setInterval] = useState<string>("");

  const handleMerchantChange = (values: string[]) => {
    setSelectedMerchants(values);
  };

  const handleManagerChange = (values: string[]) => {
    setManager(values[0]);
  };

  const handleIntervalChange = (interval: string) => {
    setInterval(interval);
    setDateRange(undefined);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setInterval("");
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setShowSettlementInfo(true);

    setSettlements(justMockedSettlementData);
    setIsLoading(false);

    // const fetchSettlementData = async () => {
    //   try {
    //     const params = new URLSearchParams();

    //     params.append("manager", manager);

    //     params.append("merchant", selectedMerchants.join(","));

    //     if (dateRange && dateRange.from && dateRange.to) {
    //       params.append("from", dateRange.from.toISOString());
    //       params.append("to", dateRange.to.toISOString());
    //     } else if (interval) {
    //       params.append("interval", interval);
    //     }

    //     const response = await fetch(
    //       `/api/get-all-settlements?${params.toString()}`, // there is no such route yet
    //       {
    //         method: "POST",
    //       },
    //     );

    //     const {
    //       settlements,
    //     }: {
    //       settlements: any[];
    //     } = await response.json();
    //     setSettlements(settlements);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Settlement"
        description="Generate and Manage Payouts with CSV Generator"
      />

      <div className="w-full">
        <CalculationControls
          selectedValues={selectedMerchants}
          dateRange={dateRange}
          interval={interval}
          onMerchantChange={handleMerchantChange}
          onManagerChange={handleManagerChange}
          onDateChange={handleDateChange}
          onIntervalChange={handleIntervalChange}
          onCalculate={() => handleCalculate()}
          disabled={manager === "" || manager === null || manager === undefined}
        />
      </div>
      <div className="flex flex-wrap gap-[45px]">
        {showSettlementInfo &&
          settlements &&
          settlements.map((settlement: any, index: number) => (
            <SettlementInfo key={index} data={settlement} />
          ))}
      </div>
      {isLoading && <Spinner />}
    </div>
  );
};

export default SettlementPage;
