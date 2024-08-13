import React from "react";

interface IStatusBandge {
  name: string;
  type: "failed" |  "success" | "transferring" | "" | string;
}

const StatusBadge = ({ name, type }: IStatusBandge) => {
  const typeStyles: { [key: string]: string } = {
    failed: "bg-errorBg text-error",
    success: "bg-successBg text-success",
    transferring: "bg-warningBg text-warning",

    default: "bg-gray-200 text-gray-700",
  };

  const selectedStyle = typeStyles[type] || typeStyles["default"];

  return (
    <div
      className={`${selectedStyle} flex max-h-fit max-w-fit items-center rounded-sm px-2 py-1 text-[12px] font-medium capitalize tracking-[0.36px]`}
    >
      {" "}
      {name}
    </div>
  );
};

export default StatusBadge;
