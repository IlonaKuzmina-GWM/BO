import React from "react";

interface IDashButton {
  name: string;
  type: "filled" | "empty";
  disabled?: boolean;
  additionalStyle?: string;
  onClickHandler?: () => void;
  isFullWidth?: boolean;
}

const DashButton = ({
  name,
  type,
  additionalStyle = "",
  disabled = false,
  onClickHandler,
  isFullWidth = false,
}: IDashButton) => {
  const typeStyles = {
    filled:
      "bg-blue500 text-white hover:bg-blue600 active:bg-blue700 disabled:bg-fill disabled:text-secondary",
    empty:
      "bg-blue50 text-blue500 hover:bg-blue100 active:bg-blue200 disabled:bg-fill",
  };

  const selectedStyle = typeStyles[type] || typeStyles.empty;

  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      className={`${selectedStyle} ${additionalStyle} ${disabled ? " cursor-not-allowed bg-fill text-secondary" : ""} ${isFullWidth ? "w-full" : ""} text-md rounded-sm px-8 py-2 font-semibold capitalize leading-normal transition-all duration-300 h-fit`}
    >
      {name}
    </button>
  );
};

export default DashButton;
