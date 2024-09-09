import React from "react";
import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import DashButton from "../DashButton";

interface CalculationControlsProps {
  selectedValues: string[];
  dateRange: DateRange | undefined;
  onMerchantChange: (values: string[]) => void;
  onDateChange: (range: DateRange | undefined) => void;
  onCalculate: (selectedValues: string[], dateRange: DateRange | undefined) => void;
}

const CalculationControls = ({
  selectedValues,
  dateRange,
  onMerchantChange,
  onDateChange,
  onCalculate,
}: CalculationControlsProps) => {
  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ];

  return (
    <div className="flex flex-row gap-[16px] max-w-[560px]">
      <DashSelect
        value={"Select Merchant"}
        label={"All Merchants"}
        items={items}
        searchInput
        searchContext="merchant"
        isMulti={false}
        onSelectHandler={onMerchantChange}
      />
      <DatePickerWithRange initialDate={dateRange} onDateChange={onDateChange} width="max-w-[218px]"/>
      <div className="ml-[8px]">
        <DashButton
          name="Calculate"
          type="filled"
          disabled={selectedValues.length === 0}
          onClickHandler={() => onCalculate(selectedValues, dateRange)}
        />
      </div>
    </div>
  );
};

export default CalculationControls;