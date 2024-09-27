const INTERVALS = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_3_DAYS: "last-3-days",
  LAST_7_DAYS: "last-7-days",
  LAST_14_DAYS: "last-14-days",
  THIS_MONTH: "this-month",
  THIS_YEAR: "this-year",
};

// Helper function to calculate start date based on interval
export const getStartDateForInterval = (interval: string): Date | null => {
  const now = new Date();
  let startDate = null;

  switch (interval) {
    case INTERVALS.TODAY:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case INTERVALS.YESTERDAY:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
      );
      break;
    case INTERVALS.LAST_3_DAYS:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 2,
      );
      break;
    case INTERVALS.LAST_7_DAYS:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 6,
      );
      break;
    case INTERVALS.LAST_14_DAYS:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 13,
      );
      break;
    case INTERVALS.THIS_MONTH:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case INTERVALS.THIS_YEAR:
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      break;
  }

  return startDate;
};
