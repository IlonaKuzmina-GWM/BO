import React from "react";

interface IChartWrapper {
  title: string;
  dataInterval: string;
  shortOverview: { title: string; description: string }[]; // Adjusted to an array of objects
  children: React.ReactNode;
}

const ChartWrapper = ({
  title,
  dataInterval,
  shortOverview,
  children,
}: IChartWrapper) => {
  return (
    <div className="h-full bg-white p-5 rounded-md shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-2xl font-semibold text-main">{title}</h2>
          <p className="text-base text-secondary">{dataInterval}</p>
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
                <div className="rounded-sm bg-secondary px-2 py-[3px]"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default ChartWrapper;
