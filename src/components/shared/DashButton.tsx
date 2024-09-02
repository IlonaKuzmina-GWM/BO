import React from "react";

interface IDashButton {
  name: string;
  type: "filled" | "empty";
  disabled?: boolean;
  aditionlStyle?: string;
  onClickHandler?: () => void;
}

const DashButton = ({
  name,
  type,
  aditionlStyle = "",
  disabled = false,
  onClickHandler,
}: IDashButton) => {
  const typeStyles = {
    filled:
      "bg-blue500 text-white hover:bg-blue600 active:bg-blue700 disabled:bg-fill",
    empty:
      "bg-blue50 text-blue500 hover:bg-blue100 active:bg-blue200 disabled:bg-fill",
  };

  const selectedStyle = typeStyles[type] || typeStyles.empty;

  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      className={`${selectedStyle} ${aditionlStyle} ${disabled ? "cursor-not-allowed bg-fill text-secondary" : ""} text-md rounded-sm px-8 py-2 font-semibold capitalize leading-normal transition-all duration-300`}
    >
      {name}
    </button>
  );
};

export default DashButton;
