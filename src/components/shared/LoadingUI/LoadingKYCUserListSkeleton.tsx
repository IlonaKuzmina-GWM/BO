import React from "react";

const LoadingKYCUserListSkeleton = () => {
  return (
    <React.Fragment>
      {[...Array(3)].map((_, index) => (
        <tr key={index}>
          <td className="pl-3 lg:pl-8">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </td>
          <td className="pr-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </td>
          <td className="pr-2">
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200"></div>
          </td>
          <td className="pr-2 text-center">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
          </td>
          <td className="pr-2 text-center">
            <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
          </td>
          <td className="pe-2">
            <div className="flex animate-pulse flex-wrap items-center justify-center gap-x-1 rounded-sm bg-gray-200 px-2 py-1">
              <div className="h-4 w-12 rounded bg-gray-300"></div>
              <div className="h-4 w-12 rounded bg-gray-300"></div>
            </div>
          </td>
          <td className="pe-2">
            <div className="flex animate-pulse flex-wrap items-center justify-center gap-x-1 rounded-sm bg-gray-200 px-2 py-1">
              <div className="h-4 w-12 rounded bg-gray-300"></div>
              <div className="h-4 w-12 rounded bg-gray-300"></div>
            </div>
          </td>
        </tr>
      ))}
    </React.Fragment>
  );
};

export default LoadingKYCUserListSkeleton;
