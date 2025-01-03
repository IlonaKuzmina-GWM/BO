import React, { useState } from "react";

interface ExportButtonProps {
  disabled?: boolean;
  onSelect: (exportType: "pdf" | "csv" | "excel") => void;
  additionalStyle?: string;
  isFullWidth?: boolean;
}

const ExportButton = ({
  disabled = false,
  onSelect,
  additionalStyle = "",
  isFullWidth = false,
}: ExportButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const buttonStyle = disabled
    ? "cursor-not-allowed bg-fill text-secondary"
    : "bg-blue500 text-white hover:bg-blue600 active:bg-blue700";

  const exportOptions = [
    { type: "pdf" as const, label: "Export as PDF" },
    { type: "csv" as const, label: "Export as CSV" },
    { type: "excel" as const, label: "Export as Excel" },
  ];

  return (
    <div
      className={`relative inline-block text-left ${isFullWidth ? "w-full" : ""}`}
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button
        disabled={disabled}
        className={`${buttonStyle} ${additionalStyle} text-md h-fit rounded-sm px-8 py-2 font-semibold capitalize leading-normal transition-all duration-300 ${isFullWidth ? "w-full" : ""}`}
      >
        Export
      </button>
      {isDropdownOpen && !disabled && (
        <div className="absolute right-0 z-10 pt-1">
          <div className="w-40 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {
                exportOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      onSelect(option.type);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
