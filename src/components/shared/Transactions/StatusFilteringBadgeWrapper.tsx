import { STATUS_LABELS, STATUSES } from "@/constants/statuses";

interface IStatusFilteringBadgeWrapper {
  statusList: { [key: string]: number };
  activeStatusBadge: string;
  totalTransactionsCount: number;
  onClickHandler: (label: string) => void;
}

const StatusFilteringBadgeWrapper = ({
  statusList,
  activeStatusBadge,
  totalTransactionsCount,
  onClickHandler,
}: IStatusFilteringBadgeWrapper) => {
  return (
    <div className="mt-4 flex flex-row flex-wrap gap-6">
      <button
        onClick={() => onClickHandler("all")}
        className={`${
          activeStatusBadge === "all"
            ? "font-bold text-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 after:content-['']"
            : "font-medium text-main"
        } relative flex flex-row items-center gap-[6px] rounded pb-[8px] text-sm capitalize`}
      >
        All
        <span
          className={`${
            activeStatusBadge === "all" ? "bg-blue-100" : "bg-divider"
          } inline-block rounded-[13px] px-[6px] text-[10px] leading-4`}
        >
          {totalTransactionsCount}
        </span>
      </button>

      {Object.entries(statusList).map(([key, value]) => {
  const label = STATUS_LABELS[key] || key;

        return (
          <button
            key={key}
            onClick={() => onClickHandler(key)}
            className={`${
              activeStatusBadge === key
                ? "font-bold text-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 after:content-['']"
                : "font-medium text-main"
            } relative flex flex-row items-center gap-[6px] rounded pb-[8px] text-sm capitalize`}
          >
            {label}
            <span
              className={`${
                activeStatusBadge === key ? "bg-blue-100" : "bg-divider"
              } inline-block rounded-[13px] px-[6px] text-[10px] leading-4`}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilteringBadgeWrapper;
