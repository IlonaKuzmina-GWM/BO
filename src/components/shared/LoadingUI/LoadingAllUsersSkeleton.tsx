import React from "react";

const LoadingAllUsersSkeleton = () => {
  const skeletonClass = "h-4 bg-gray-200 rounded animate-pulse";

  return (
    <React.Fragment>
      {[...Array(10)].map((_, index) => (
        <tr key={index}  className="relative h-[50px] animate-pulse cursor-pointer border-b-[1px] border-b-hoverBg bg-whiteBg transition-all last:border-none hover:bg-hoverBg">
          <td className="pl-3 pr-2 lg:pl-8">
            <div className={`${skeletonClass} w-16`}></div>
          </td>
          <td className="pr-2">
            <div className={`${skeletonClass} w-20`}></div>
          </td>
          <td className="pr-2">
            <div className={`${skeletonClass} w-20`}></div>
          </td>
          <td className="pr-2">
            <div className={`${skeletonClass} w-40`}></div>
          </td>
          <td className="pr-2">
            <div className="flex justify-center rounded-[4px] px-[4px] py-[8px]">
              <div className={`${skeletonClass} w-24`}></div>
            </div>
          </td>
          <td className="flex border-x border-hoverBg p-2 text-center">
            <div className={`${skeletonClass} w-24`}></div>
          </td>
          <td className="border-x border-hoverBg text-center">
            <div className={`${skeletonClass} w-20`}></div>
          </td>
          <td className="border-x border-hoverBg text-center">
            <div className={`${skeletonClass} w-20`}></div>
          </td>
          <td className="pl-2 pr-3 lg:pr-8">
            <div className="flex justify-center rounded-[4px] px-[4px] py-[8px]">
              <div className={`${skeletonClass} w-24`}></div>
            </div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingAllUsersSkeleton;
