import { DateRange } from "react-day-picker";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { useEffect, useState } from "react";

interface IGenerationFiltersProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const GenerationFilters = ({ onDateRangeChange }: IGenerationFiltersProps) => {
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: oneMonthAgo,
    to: now,
  });

  useEffect(() => {
    onDateRangeChange(dateRange);
  }, [dateRange]);

  const items = [
    { value: "0", label: "Today" },
    { value: "3", label: "Last 3 days" },
    { value: "7", label: "Last 7 days" },
    { value: "month", label: "1 month" },
  ];

  const onDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const onDaysAmountChange = (selectedValues: string[]) => {
    const selectedValue = selectedValues[0];
    const today = new Date();
    let fromDate = new Date();

    switch (selectedValue) {
      case "0":
        fromDate = today;
        break;
      case "3":
        fromDate.setDate(today.getDate() - 3);
        break;
      case "7":
        fromDate.setDate(today.getDate() - 7);
        break;
      case "month":
        fromDate.setMonth(today.getMonth() - 1);
        break;
      default:
        break;
    }

    setDateRange({ from: fromDate, to: today });
    onDateChange({ from: fromDate, to: today });
  };

  return (
    <div className="flex flex-row">
      {/* <IntervalSelect onIntervalChange={handleIntervalChange} selectedInterval={selectedInterval}/> */}
      <DashSelect
        value={"1 month"}
        label={"Ranges"}
        items={items}
        searchInput={false}
        searchContext=""
        isMulti={false}
        onSelectHandler={onDaysAmountChange}
      />
      <div className="w-[218px]">
        <DatePickerWithRange
          initialDate={dateRange}
          onDateChange={onDateChange}
          width="max-w-[218px]"
        />
      </div>
    </div>
  );
};

export default GenerationFilters;
