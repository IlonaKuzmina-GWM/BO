import React from "react";

interface IntervalSelectProps {
  onIntervalChange: (interval: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedInterval: string;
}

export const IntervalSelect = ({
  onIntervalChange,
  selectedInterval,
}: IntervalSelectProps) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <select
        value={selectedInterval}
        onChange={onIntervalChange}
        className="rounded-sm border border-divider bg-white px-2 py-[10px] text-start text-sm text-main"
      >
        <option value="today" className="font-semibold cursor-pointer">Select interval</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last-3-days">Last 3 Days</option>
        <option value="last-7-days">Last 7 Days</option>
        <option value="last-14-days">Last 14 Days</option>
        <option value="this-month">This Month</option>
        <option value="this-year">This Year</option>
      </select>
    </div>
  );
};
