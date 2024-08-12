import React from "react";

interface IStatusBandge {
  name: string;
  type: "error" | "success" | "warning";
}

const StatusBadge = ({ name, type }: IStatusBandge) => {
  const typeStyles = {
    error:
      "bg-errorBg text-error",
    success:
      "bg-successBg text-success",
    warning:
      "bg-warningBg text-warning",
  };

  const selectedStyle = typeStyles[type];

  return (
    <div
      className={`${selectedStyle} flex items-center max-w-fit max-h-fit text-[12px] font-medium rounded-sm px-2 py-1 tracking-[0.36px] capitalize `}
    > {name}
    </div>
  );
};

export default StatusBadge;
