import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import DashButton from "../DashButton";
import DashIntervalSelect from "../DashIntervalSelect";
import DatePickerWithRange from "../DatePickerWithRange";

interface CalculationControlsProps {
  selectedValues: string[];
  dateRange: DateRange | undefined;
  interval: string;
  onMerchantChange: (values: string[]) => void;
  onManagerChange: (values: string[]) => void;
  onDateChange: (range: DateRange | undefined) => void;
  onIntervalChange: (interval: string) => void;
  onCalculate: () => void;
  disabled: boolean;
}

const CalculationControls = ({
  selectedValues,
  dateRange,
  interval,
  onMerchantChange,
  onManagerChange,
  onDateChange,
  onIntervalChange,
  onCalculate,
  disabled,
}: CalculationControlsProps) => {
  const [merchantsList, setMerchantsList] = useState<string[]>([]);

  const getMerchants = async () => {
    try {
      const response = await fetch("/api/get-all-transactions?", {
        method: "GET",
      });

      const { merchantsList }: { merchantsList: string[] } =
        await response.json();
      setMerchantsList(merchantsList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMerchants();
  }, []);

  const managers = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  return (
    <div className="flex flex-row gap-[16px]">
      {/* <DashSelect
        value={"Select Manager"}
        label={"All Managers"}
        items={managers}
        searchInput
        searchContext="manager"
        isMulti={false}
        onSelectHandler={onManagerChange}
      /> */}
      {/* <DashSelect
        value={"Select Merchant"}
        label={"All Merchants"}
        items={merchantsList.map((merchant) => ({
          value: merchant,
          label: merchant,
        }))}
        searchInput
        searchContext="merchant"
        isMulti={true}
        onSelectHandler={onMerchantChange}
        disabled={disabled}
      /> */}
      <div className="flex">
        <DashIntervalSelect
          value={interval ? interval : "Select Interval"}
          label="No Interval"
          onIntervalChange={onIntervalChange}
        />
        <DatePickerWithRange
          initialDate={dateRange}
          onDateChange={onDateChange}
        />
      </div>
      <div className="ml-[8px]">
        <DashButton
          name="Calculate"
          type="filled"
          disabled={
            selectedValues.length === 0 ||
            (dateRange === undefined && interval === "")
          }
          onClickHandler={() => onCalculate()}
        />
      </div>
    </div>
  );
};

export default CalculationControls;
