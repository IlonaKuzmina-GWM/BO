import React from "react";
import LoadingDashChartsSkeleton from "../../LoadingUISkeletons/LoadingDashChartsSkeleton";

interface IChartWrapper {
  title: string;
  loading?: boolean;
  dataInterval: { from: string; to: string };
  shortOverview?: { title: string; description: string }[];
  children: React.ReactNode;
}

const ChartWrapper = ({
  title,
  loading,
  dataInterval,
  shortOverview,
  children,
}: IChartWrapper) => {
  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
    }).format(parsedDate);
  };

  const formattedInterval = `${formatDate(dataInterval.from)} - ${formatDate(dataInterval.to)}`;

  if (loading) {
    return <LoadingDashChartsSkeleton />;
  }

  return (
    <div className="h-full rounded-sm bg-white px-5 pt-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 ps-[63px] md:flex-row">
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
