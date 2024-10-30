"use client";

import React, { useEffect, useState } from "react";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashButton from "../DashButton";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { Transaction } from "@/types";
import { TransactionsTableHeader } from "@/utils/tableHeaders";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import DashIntervalSelect from "../DashIntervalSelect";
import { getStartDateForInterval } from "@/helpers/getStartDateForInterval";
import { useStore } from "@/stores/StoreProvider";
import ExportButton from "../ExportButton";
import { exportExcelTransactions } from "@/utils/export-utils";

const TransactionsWrapper = () => {
  const { authStore } = useStore();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const userId = authStore.user?.id;

  const [inputSearchQueryValue, setInputSearchQueryValue] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [activeStatusBadge, setActiveStatusBadge] = useState<string>("all");
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Transaction[]
  >([]);

  const [statusList, setStatusList] = useState<{}>({});
  const [merchantsList, setMerchantsList] = useState<string[]>([]);
  const [providersList, setProvidersList] = useState<string[]>([]);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const fetchTransactionsData = async () => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;

    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    const updatedDateRange: [number, number] | boolean = false;

    try {
      const response = await fetch("/api/post-filtered-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          searchInput: searchQuery || "",
          amountSort: false,
          createdSort: false,
          updatedSort: false,
          statusSort: [],
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
          merchIds: [],
          providerIds: [],
          currency: [],
          txList: [],
          paymentIds: [],
          countryCode: "",
        }),
      });

      if (response.ok) {
        const res = await response.json();

        setPaginatedTransactions(res.transactions);
        setTotalPages(res.totalPages);
        // console.log("transactions in trasnactions page", res.transactions);
      } else {
        console.log("Transactions response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendExportTransactionsData = async (
    exportType: "pdf" | "csv" | "excel",
  ) => {
    setLoading(true);

    let createdDateRange: [number, number] | boolean = false;

    if (selectedDateRange?.from && selectedDateRange.to) {
      const adjustedToDate = new Date(selectedDateRange.to);
      adjustedToDate.setHours(23, 59, 59, 999);
      createdDateRange = [
        selectedDateRange.from.getTime(),
        adjustedToDate.getTime(),
      ];
    }

    const updatedDateRange: [number, number] | boolean = false;

    try {
      const response = await fetch("/api/post-export-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          searchInput: searchQuery || "",
          amountSort: false,
          createdSort: false,
          updatedSort: false,
          statusSort: [],
          createdDateRange,
          updatedDateRange,
          paginationPage: currentPage,
          paginationPerPage: limit,
          merchIds: [],
          providerIds: [],
          currency: [],
          txList: [],
          paymentIds: [],
          countryCode: "",
        }),
      });

      if (response.ok) {
        const res = await response.json();

        const transactionData = res;

        if (exportType === "excel") {
          console.log("exporting excel", transactionData);
          exportExcelTransactions(transactionData);
        } else if (exportType === "csv") {
          // exportSiinCSV(siinsData);
        } else if (exportType === "pdf") {
          // exportSiinPDF(siinsData);
        }
      } else {
        console.log("Transactions response failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [
    selectedDateRange,
    limit,
    searchQuery,
    currentPage,
    selectedMerchants,
    selectedProviders,
    activeStatusBadge,
    selectedStatus,
  ]);

  const statusFilters = [
    {
      label: "User Confirm Required",
      value: "USER_CONFIRM_REQUIRED",
    },
    {
      label: "Processing",
      value: "PAYMENT_PROCESSING",
    },
    {
      label: "Accepted",
      value: "PAYMENT_ACCEPTED",
    },
    {
      label: "Failed",
      value: "PAYMENT_FAILED",
    },
    {
      label: "Timeout",
      value: "TIMEOUT",
    },
    {
      label: "Aml blocked",
      value: "AML_BLOCKED",
    },
    {
      label: "Transferring",
      value: "PAYMENT_TRANSFERRING",
    },
    {
      label: "Success",
      value: "PAYMENT_SUCCESS",
    },
    {
      label: "Cancelled",
      value: "PAYMENT_CANCELLED",
    },
  ];

  const activeFilterBageHandler = (name: string) => {
    setActiveStatusBadge(name);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputSearchQueryValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [inputSearchQueryValue]);

  const handleSearchChange = (value: string) => {
    setInputSearchQueryValue(value);
  };

  const handleIntervalChange = (interval: string) => {
    setCurrentPage(1);
    setSelectedInterval(interval);

    const startDate = getStartDateForInterval(interval);
    const now = new Date();

    if (startDate) {
      const dateRange: DateRange = { from: startDate, to: now };
      setSelectedDateRange(dateRange);
    } else {
      setSelectedDateRange(undefined);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("");
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  const handleMerchantSelect = (merchants: string[]) => {
    setSelectedMerchants(merchants);
  };

  const handleProviderSelect = (providers: string[]) => {
    setSelectedProviders(providers);
  };

  const handleStatusSelect = (status: string[]) => {
    setSelectedStatus(status);
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-row justify-between gap-6">
        <div className="flex flex-row flex-wrap gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px] min-w-[250px]"
            onSearch={handleSearchChange}
            searchValue={inputSearchQueryValue}
          />

          <div className="flex">
            <DashIntervalSelect
              value={selectedInterval ? selectedInterval : "Select Interval"}
              label="No Interval"
              onIntervalChange={handleIntervalChange}
            />
            <DatePickerWithRange
              initialDate={selectedDateRange}
              onDateChange={handleDateRangeChange}
            />
          </div>

          <DashSelect
            value={"Select Merchants"}
            label={"All Merchants"}
            items={merchantsList.map((merchant) => ({
              value: merchant,
              label: merchant,
            }))}
            searchInput
            searchContext="merchant"
            onSelectHandler={handleMerchantSelect}
          />
          <DashSelect
            value={"Select Providers"}
            label={"All Providers"}
            items={providersList.map((provider) => ({
              value: provider,
              label: provider,
            }))}
            searchInput
            searchContext="provider"
            onSelectHandler={handleProviderSelect}
          />
          <DashSelect
            value={"Select Status"}
            label={"All Status Fields"}
            items={statusFilters.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            searchInput
            searchContext="status"
            onSelectHandler={handleStatusSelect}
          />
        </div>

        <ExportButton
          onSelect={(exportType: "pdf" | "csv" | "excel") => {
            sendExportTransactionsData(exportType);
          }}
          disabled={loading}
        />
      </div>

      {/* <StatusFilteringBadgeWrapper
        statusList={statusList}
        statusFilters={statusFilters}
        counter={transactions.length.toString()}
        activeStatusBadge={activeStatusBadge}
        onClickHandler={activeFilterBageHandler}
      /> */}

      <CustomTransactionTable
        paginatedTransactions={paginatedTransactions}
        columns={TransactionsTableHeader}
      />

      <div className="relative">
        <DataLimitsSeter onChange={handleLimitChange} />
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TransactionsWrapper;
