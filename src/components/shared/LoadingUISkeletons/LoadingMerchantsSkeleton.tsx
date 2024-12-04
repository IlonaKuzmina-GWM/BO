import React from "react";

const LoadingMerchantsSkeleton = () => {
  const skeletonClass = "h-4 bg-gray-200 rounded animate-pulse";

  return (
    <React.Fragment>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className="relative h-[50px] animate-pulse cursor-pointer border-b-[1px] border-b-hoverBg bg-whiteBg transition-all last:border-none hover:bg-hoverBg"
        >
          <td className="border-e border-hoverBg pl-3 pr-2 lg:pl-8">
            <div className={`${skeletonClass} w-8`}></div>
          </td>
          <td className="border-e border-hoverBg px-2">
            <div className={`${skeletonClass} w-24`}></div>
          </td>
          <td className="border-e border-hoverBg p-2">
            <div className={`${skeletonClass} w-32`}></div>
          </td>
          <td className="border-e border-hoverBg px-2">
            <div className={`${skeletonClass} w-16`}></div>
          </td>
          <td className="border-e border-hoverBg px-2">
            <div className={`${skeletonClass} w-20`}></div>
          </td>
          <td className="border-e border-hoverBg px-2 text-center">
            <div className={`${skeletonClass} w-12`}></div>
          </td>
          <td className="border-e border-hoverBg p-2">
            <div className={`${skeletonClass} w-32`}></div>
          </td>
          <td className="px-2">
            <div className={`${skeletonClass} w-16`}></div>
          </td>
          <td className="px-2 lg:pr-8">
            <div className={`${skeletonClass} w-12`}></div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingMerchantsSkeleton;
