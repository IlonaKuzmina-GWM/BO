"use client";

import CustomTable from "@/components/shared/CustomTable/CustomTable";
import DashPageTitle from "@/components/shared/DashPageTitle";
import CSVRows from "@/components/shared/GenerateCSV/CSVRows";
import GenerationForm from "@/components/shared/GenerateCSV/GenerationForm";
import PaginationComponent from "@/components/shared/PaginationComponent ";
import { CSV, Header } from "@/types";
import { useState } from "react";

const GenerateCSVPage = () => {
  const [areAllChecked, setAreAllChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cSVs, setCSVs] = useState<CSV[]>([
    {
      id: "1",
      name: "John",
      surname: "Doe",
      iban: "DE123456789",
      amount: "1000",
      details: "Payment for services",
      created: "2015-05-16 05:50:06",
    },
    {
      id: "2",
      name: "Jane",
      surname: "Smith",
      iban: "DE987654321",
      amount: "2000",
      details: "Payment for goods",
      created: "2016-07-20 11:30:00",
    },
    {
      id: "3",
      name: "Alice",
      surname: "Johnson",
      iban: "DE123456789",
      amount: "3000",
      details: "Payment for services",
      created: "2017-09-10 09:15:30",
    },
    {
      id: "4",
      name: "Bob",
      surname: "Brown",
      iban: "DE987654321",
      amount: "4000",
      details: "Payment for goods",
      created: "2018-11-25 14:45:00",
    },
    {
      id: "5",
      name: "Charlie",
      surname: "Davis",
      iban: "DE123456789",
      amount: "5000",
      details: "Payment for services",
      created: "2019-12-30 18:00:00",
    },
  ]);

  const header: Header[] = [
    { title: "", key: "checkbox", width: "7%" },
    { title: "ID", key: "id", width: "7%" },
    { title: "Name", key: "name", width: "11%" },
    { title: "Surname", key: "surname", width: "11%" },
    { title: "IBAN", key: "iban", width: "17%" },
    { title: "Amount", key: "amount", width: "10%" },
    {
      title: "Created",
      key: "created",
      width: "15%",
    },
    { title: "Action", key: "role", width: "8%" },
    { title: "", key: "delete", width: "12%" },
  ];

  const renderRow = (cSV: CSV, index: number) => (
    <CSVRows key={cSV.id} cSV={cSV} checkAll={areAllChecked} />
  );

  const totalPages = Math.ceil(cSVs.length / 10);

  const handleAllChecked = () => {
    setAreAllChecked(!areAllChecked);
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
      <DashPageTitle
        title="CSV payout generator"
        description="Generate and Manage Payouts with CSV Generator"
      />
      <GenerationForm />
      <div className="w-full">
        <CustomTable
          columns={header}
          data={cSVs}
          renderRow={renderRow}
          onCheckboxChange={handleAllChecked}
          checkAll={areAllChecked}
        />
      </div>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
export default GenerateCSVPage;
