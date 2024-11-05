"use client";

import CustomTable from "@/components/shared/CustomTable/CustomTable";
import DashButton from "@/components/shared/DashButton";
import DashPageTitle from "@/components/shared/DashPageTitle";
import CSVRows from "@/components/shared/GenerateCSV/CSVRows";
import GenerationForm from "@/components/shared/GenerateCSV/GenerationForm";
import { CSV } from "@/types";
import { GenerateCSVTableHeader } from "@/utils/tableHeaders";
import { useState } from "react";
import { exportExcelPayout } from "../../../utils/export-utils";

const GenerateCSVPage = () => {
  const [loading, setLoading] = useState(true);
  const [cSVs, setCSVs] = useState<CSV[]>([]);

  const deleteEntry = (index: number): void => {
    const newRules = [...cSVs];
    newRules.splice(index, 1);
    setCSVs(newRules);
  };

  const renderRow = (cSV: CSV, index: number) => (
    <CSVRows key={cSV.id} cSV={cSV} index={index} deleteEntry={deleteEntry} />
  );

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
        <CustomTable
          columns={GenerateCSVTableHeader}
          dataName="CSV"
          data={cSVs}
          renderRow={renderRow}
        />
      </div>
    </div>
  );
};

export default GenerateCSVPage;
