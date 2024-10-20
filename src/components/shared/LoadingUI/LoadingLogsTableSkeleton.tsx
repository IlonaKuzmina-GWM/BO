import React from "react";

const LoadingLogsTableSkeleton = () => {
  return (
    <React.Fragment>
      {[...Array(10)].map((_, index) => (
        <tr
          key={index}
          className="relative h-[50px] animate-pulse cursor-pointer border-b-[1px] border-b-hoverBg bg-whiteBg transition-all last:border-none hover:bg-hoverBg"
        >
          <td className="pl-3">
            <div className="h-4 w-24 rounded-sm bg-gray-200"></div>
          </td>
          <td className="pe-2 text-center">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          <td className="pe-8">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingLogsTableSkeleton;
