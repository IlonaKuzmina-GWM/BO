import React from "react";

interface IChartWrapper {
  title: string;
  dataInterval: string;
  shortOverview: [{ title: string; description: string }];
}

const ChartWrapper = ({
  title,
  dataInterval,
  shortOverview,
}: IChartWrapper) => {
  return (
    <div className="bg-white p-[20px]">
      <div className="flex flex-col justify-between md:flex-row">
        <div>
          <h2 className="text-[30px] font-semibold leading-none text-main">
            {title}
          </h2>
          <p className="text-base text-secondary">{dataInterval}</p>
        </div>
        {shortOverview && shortOverview.length > 0 && (
          <div className="flex items-center gap-4">
            {shortOverview.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div>
                  {" "}
                  <h2 className="text-[30px] font-semibold leading-none text-main">
                    {item.title}
                  </h2>
                  <p className="text-sm text-secondary">{item.description}</p>
                </div>
                <div className="rounded-sm bg-secondary px-2 py-[3px]"> </div>
              </div>
            ))}
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
};

export default ChartWrapper;
