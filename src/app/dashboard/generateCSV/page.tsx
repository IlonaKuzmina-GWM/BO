"use client";

import DashButton from "@/components/shared/DashButton";
import DashPageTitle from "@/components/shared/DashPageTitle";
import CSVRows from "@/components/shared/GenerateCSV/CSVRows";
import GenerationForm from "@/components/shared/GenerateCSV/GenerationForm";
import { CSV } from "@/types";
import { GenerateCSVTableHeader } from "@/constants/tableHeaders";
import { useState } from "react";
import { exportExcelPayout } from "../../../utils/export-utils";

const GenerateCSVPage = () => {
  const [cSVs, setCSVs] = useState<CSV[]>([]);

  const deleteEntry = (index: number): void => {
    const newRules = [...cSVs];
    newRules.splice(index, 1);
    setCSVs(newRules);
  };

  const handleFormSubmit = (data: CSV) => {
    setCSVs([data, ...cSVs]);
  };

  const downloadExcel = () => {
    exportExcelPayout(cSVs);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 xl:gap-6">
      <DashPageTitle
        title="CSV payout generator"
        description="Generate and Manage Payouts with CSV Generator"
      />
      <div className="flex flex-row justify-between">
        <GenerationForm onSubmit={handleFormSubmit} />
        <div className="max-width-[40px] self-end">
          <DashButton
            name="Generate"
            type={"filled"}
            disabled={!cSVs.length}
            onClickHandler={downloadExcel}
          />
        </div>
      </div>
      <div className="w-full bg-white">
        <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
          <thead className="h-[50px] bg-hoverBg font-semibold">
            <tr>
              {GenerateCSVTableHeader.map((col, index) => (
                <th
                  key={col.key}
                  className={`${
                    index === 0 ? "pl-3 lg:pl-8" : ""
                  } ${index === GenerateCSVTableHeader.length - 1 ? "pr-3 lg:pr-8" : ""} ${
                    col.centered ? "text-center" : ""
                  } pr-2`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cSVs.length > 0 ? (
              cSVs.map((cSV, index) => (
                <tr
                  className="h-[50px] border-b border-hoverBg last:border-none"
                  key={index}
                >
                  <CSVRows
                    key={cSV.id}
                    cSV={cSV}
                    index={index}
                    deleteEntry={deleteEntry}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={GenerateCSVTableHeader.length}
                  className="py-4 text-center"
                >
                  No CSV available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerateCSVPage;
