import React from "react";

interface IStatusFilteringBadge {
  name: string;
  counter: string;
  filterActive: string;
  onClickHandler: (name: string) => void;
}

const StatusFilteringBadge = ({
  name,
  counter,
  filterActive,
  onClickHandler,
}: IStatusFilteringBadge) => {

  return (
    <button
      onClick={() => onClickHandler(name)}
      className={`${
        filterActive === name
          ? "font-bold text-blue-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-500 after:content-['']"
          : "font-medium text-main"
      } relative flex flex-row items-center gap-[6px] rounded pb-[8px] text-sm capitalize`}
    >
      {name}{" "}
      <span
        className={`${
          filterActive === name ? "bg-blue-100" : "bg-divider"
        } inline-block rounded-[13px] px-[6px] text-[10px] leading-4`}
      >
        {counter}
      </span>
    </button>
  );
};

export default StatusFilteringBadge;
