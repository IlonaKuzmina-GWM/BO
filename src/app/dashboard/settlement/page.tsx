"use client";

import DashPageTitle from "@/components/shared/DashPageTitle";
import CalculationControls from "@/components/shared/Settlement/CalculationControls";
import SettlementInfo from "@/components/shared/Settlement/SettlementInfo";
import Spinner from "@/components/UI/Spinner";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const SettlementPage = () => {
  const [showSettlementInfo, setShowSettlementInfo] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [transactionData, setTransactionData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const handleMerchantChange = (values: string[]) => {
    setSelectedValues(values);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleCalculate = (selectedValues: string[], dateRange?: DateRange) => {
    setIsLoading(true);
    console.log(selectedValues[0], dateRange);
    setShowSettlementInfo(true);
    setTransactionData({
      summary: [
        { label: "Non-settled transactions", value: "1" },
        { label: "Fee percent", value: "3%" },
        { label: "Fixed Fee", value: "0.80 EUR" },
        { label: "Settlement Fee", value: "1.50%" },
        { label: "Settlement Cost", value: "749.69 EUR" },
      ],
      totalAmounts: [
        { label: "Total Amount Before Fees", value: "51525.01 EUR" },
        { label: "Total Amount After Fees", value: "49979.25 EUR" },
      ],
      totalPayout: "49229.56 EUR",
    });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="Settlement"
        description="Generate and Manage Payouts with CSV Generator"
      />

      <div className="w-full">
        <CalculationControls
          selectedValues={selectedValues}
          dateRange={dateRange}
          onMerchantChange={handleMerchantChange}
          onDateChange={handleDateChange}
          onCalculate={() => handleCalculate(selectedValues, dateRange)}
        />
      </div>
      {showSettlementInfo && transactionData && (
        <SettlementInfo data={transactionData} />
      )}
      {isLoading && <Spinner />}
    </div>
  );
};

export default SettlementPage;
