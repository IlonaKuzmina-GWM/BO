import React from 'react';

const LoadingAPIKeySkeleton = () => {
  return (
    <tr className="relative h-[50px] animate-pulse cursor-pointer border-b-[1px] border-b-hoverBg bg-whiteBg transition-all last:border-none hover:bg-hoverBg">
      <td className="pl-3 pr-2 lg:pl-8">
        <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
      </td>
      <td className="pr-2">
        <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
      </td>
      <td className="pr-2">
        <div className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
      </td>
      <td className=" pr-2 flex gap-4 items-center h-[50px]">
        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
      </td>
    </tr>
  );
};

export default LoadingAPIKeySkeleton;
