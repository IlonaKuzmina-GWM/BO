import { formatDateTime } from "@/helpers/dateFormater";
import React from "react";

interface IChartWrapper {
  title: string;
  dataInterval: { from: string; to: string };
  shortOverview?: { title: string; description: string }[];
  children: React.ReactNode;
}

const ChartWrapper = ({
  title,
  dataInterval,
  shortOverview,
  children,
}: IChartWrapper) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  const formattedInterval = `${formatDate(dataInterval.from)} - ${formatDate(
    dataInterval.to,
  )}`;

  // console.log("dataInterval", dataInterval);
  return (
    <div className="h-full rounded-sm bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row ps-[63px]">
        <div>
          <h2 className="text-2xl font-semibold text-main">{title}</h2>

          <p className="text-base text-secondary">{formattedInterval}</p>
        </div>
        {shortOverview && shortOverview.length > 0 && (
          <div className="flex items-center gap-4">
            {shortOverview.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div>
                  <h2 className="text-2xl font-semibold text-main">
                    {item.title}
                  </h2>
                  <p className="text-sm text-secondary">{item.description}</p>
                </div>
                {/* <div className="rounded-sm bg-secondary px-2 py-[3px]"></div> */}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export default ChartWrapper;
