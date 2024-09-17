import React from "react";
import StatusBadge from "./StatusBadge";

interface ILogHistory {
  color: string;
  status: string;
  date: string;
  time: string;
}

const LogHistory = ({ color, status, date, time }: ILogHistory) => {
  return (
    <div className="flex flex-row gap-2">
      <div className="relative flex h-full w-[9px] flex-col items-center justify-center gap-[3px]">
        <div
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor:
              color !== "whiteBg"
                ? `var(--${color.slice(0, -2)})`
                : `var(--main)`,
          }}
        ></div>
        <div className="h-[66px] w-[2px] bg-hoverBg"></div>
      </div>

      <div className="flex flex-col justify-center gap-1">
        <StatusBadge name={status} type={status} />
        <p className="font-medium">
          <span className="">Last updated:</span> <span>{date}</span>{" "}
          <span>{time}</span>
        </p>
      </div>
    </div>
  );
};

export default LogHistory;
