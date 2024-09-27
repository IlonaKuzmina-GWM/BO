import React from "react";

const LoadingSiinTableSkeleton = () => {
  return (
    <React.Fragment>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className="relative h-[50px] animate-pulse border-b border-hoverBg last:border-none"
        >
          <td className="pl-3">
            <div className="h-4 w-4 rounded-sm bg-gray-200"></div>
          </td>
          <td className="pe-2 text-center">
            <div className="h-4 w-10 rounded bg-gray-200"></div>
          </td>
          <td className="pe-8">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-20 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-28 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2 font-semibold">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-28 rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-28 rounded bg-gray-200"></div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingSiinTableSkeleton;
