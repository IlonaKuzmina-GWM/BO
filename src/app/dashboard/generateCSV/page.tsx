"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import CustomTable from "@/components/shared/CustomTable/CustomTable";
import DashPageTitle from "@/components/shared/DashPageTitle";
import CSVRows from "@/components/shared/GenerateCSV/CSVRows";
import GenerationFilters from "@/components/shared/GenerateCSV/GenerationFilters";
import GenerationForm from "@/components/shared/GenerateCSV/GenerationForm";
import PaginationComponent from "@/components/shared/PaginationComponent ";
import { CSV, Header } from "@/types";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

const GenerateCSVPage = () => {
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
    {
      id: "6",
      name: "Kate",
      surname: "Davis",
      iban: "DE123456559",
      amount: "5000",
      details: "Payment for services",
      created: "2024-09-13 18:00:00",
    },
  ]);
  const [filteredCSVs, setFilteredCSVs] = useState<CSV[]>(cSVs);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const header: Header[] = [
    { title: "ID", key: "id", width: "8%" },
    { title: "Name", key: "name", width: "19%" },
    { title: "Surname", key: "surname", width: "19%" },
    { title: "IBAN", key: "iban", width: "19%" },
    { title: "Amount", key: "amount", width: "8%" },
    {
      title: "Created",
      key: "created",
      width: "12%",
    },
    { title: "Action", key: "role", width: "8%" },
    { title: "", key: "delete", width: "7%" },
  ];

  const deleteEntry = (index: number): void => {
    const newRules = [...cSVs];
    newRules.splice(index, 1);
    setCSVs(newRules);
  };

  const renderRow = (cSV: CSV, index: number) => (
    <CSVRows
      key={cSV.id}
      cSV={cSV}
      index={index}
      deleteEntry={deleteEntry}
      downloadPDF={() => console.log(index)}
    />
  );

  const totalPages = Math.ceil(filteredCSVs.length / 10);

  const handleFormSubmit = (data: CSV) => {
    setCSVs([data, ...cSVs]);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const isDateRangeDefined = (
    range: DateRange | undefined,
  ): range is { from: Date; to: Date } => {
    return range?.from !== undefined && range?.to !== undefined;
  };

  useEffect(() => {
    if (isDateRangeDefined(dateRange)) {
      const filtered = cSVs.filter((csv) => {
        const createdDate = new Date(csv.created);
        return createdDate >= dateRange.from && createdDate <= dateRange.to;
      });
      setFilteredCSVs(filtered);
    } else {
      setFilteredCSVs(cSVs);
    }
  }, [dateRange, cSVs]);

  return (
    <div className="flex min-h-screen w-full flex-col gap-6">
      <DashPageTitle
        title="CSV payout generator"
        description="Generate and Manage Payouts with CSV Generator"
      />
      <GenerationForm onSubmit={handleFormSubmit} />
      <GenerationFilters onDateRangeChange={handleDateRangeChange} />
      <div>
        <div className="w-full bg-white">
          <CustomTable
            columns={header}
            data={filteredCSVs}
            renderRow={renderRow}
          />
        </div>

        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default GenerateCSVPage;