import React from "react";

const   LoadingDashSideTableSkeleton = () => {
  return (
    <div>
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="mb-[8px] flex justify-between p-[8px] animate-pulse"
      >
        <div className="h-[12px] w-[50%] bg-gray-200 rounded"></div>
        <div className="h-[12px] w-[20%] bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
  );
};

export default LoadingDashSideTableSkeleton;
