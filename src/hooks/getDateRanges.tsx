import { DateRange } from "react-day-picker";

export const getDateRanges = (
  selectedCreatedDateRange: DateRange | undefined,
  selectedUpdatedDateRange?: DateRange | undefined,
) => {
  let createdDateRange: [number, number] | boolean = false;

  if (selectedCreatedDateRange?.from && selectedCreatedDateRange.to) {
    const adjustedToDate = new Date(selectedCreatedDateRange.to);
    adjustedToDate.setHours(23, 59, 59, 999);
    createdDateRange = [
      selectedCreatedDateRange.from.getTime(),
      adjustedToDate.getTime(),
    ];
  }

  let updatedDateRange: [number, number] | boolean = false;

  if (selectedUpdatedDateRange?.from && selectedUpdatedDateRange.to) {
    const adjustedToDate = new Date(selectedUpdatedDateRange.to);
    adjustedToDate.setHours(23, 59, 59, 999);
    updatedDateRange = [
      selectedUpdatedDateRange.from.getTime(),
      adjustedToDate.getTime(),
    ];
  }

  return {
    createdDateRange,
    updatedDateRange,
  };
};
