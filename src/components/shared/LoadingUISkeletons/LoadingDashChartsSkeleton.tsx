import React from "react";

const LoadingDashChartsSkeleton = () => {
  return (
    <div className="h-full animate-pulse rounded-sm bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <div className="mb-2 h-6 w-48 rounded-md bg-gray-200"></div>
          <div className="mb-5 h-4 w-24 rounded-md bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-16 rounded-md bg-gray-200"></div>
          <div className="h-4 w-20 rounded-md bg-gray-200"></div>
        </div>
      </div>
      <div className="h-[410px] w-full animate-pulse rounded-md bg-gray-200"></div>
    </div>
  );
};

export default LoadingDashChartsSkeleton;
