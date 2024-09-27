import React from "react";

const LoadingTransactionTableSkeleton = () => {
  return (
    <React.Fragment>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className="relative h-[50px] animate-pulse cursor-pointer border-b-[1px] border-b-hoverBg bg-whiteBg transition-all last:border-none hover:bg-hoverBg"
        >
          <td className="pl-3">
            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          </td>
          <td className="pe-2 text-center">
            <div className="h-4 w-10 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-20 rounded bg-gray-300"></div>
          </td>
          <td className="pe-8 font-semibold">
            <div className="h-4 w-16 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-24 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-36 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-20 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-4 w-20 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-6 w-32 rounded bg-gray-300"></div>
          </td>
          <td className="pe-2">
            <div className="h-6 w-32 rounded bg-gray-300"></div>
          </td>
          <td className="">
            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingTransactionTableSkeleton;
