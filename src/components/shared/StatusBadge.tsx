import {
  getFailedColor,
  getProcessColor,
  getSuccessColor,
} from "@/helpers/getColorByStatus";
import { transformStatus } from "@/helpers/transformStatus ";
import React from "react";

interface IStatusBadge {
  name: string;
  color?: string;
}

const StatusBadge = ({ name, color }: IStatusBadge) => {
  let type: "failed" | "success" | "transferring" | "" = "";

  if (getFailedColor(name)) {
    type = "failed";
  } else if (getSuccessColor(name)) {
    type = "success";
  } else if (getProcessColor(name)) {
    type = "transferring";
  }

  const typeStyles: { [key: string]: string } = {
    failed: "bg-errorBg text-error",
    success: "bg-successBg text-success",
    transferring: "bg-warningBg text-warning",
    default: "bg-gray-200 text-gray-700",
  };

  const selectedStyle = color
    ? `bg-${color} text-defaultTextColor`
    : typeStyles[type] || typeStyles["default"];

  return (
    <div
      className={`${selectedStyle} flex max-h-fit max-w-fit items-center rounded-sm px-2 py-1 text-[12px] font-medium capitalize tracking-[0.36px]`}
    >
      {transformStatus(name)}
    </div>
  );
};

export default StatusBadge;
