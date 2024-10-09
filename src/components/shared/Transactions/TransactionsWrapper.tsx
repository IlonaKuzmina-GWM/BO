"use client";

import React, { useEffect, useState } from "react";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashButton from "../DashButton";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { Transaction } from "@/types";
import StatusFilteringBadge from "../StatusFilter/StatusFilteringBadge";
import { TransactionsTableHeader } from "@/utils/tableHeaders";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import DashIntervalSelect from "../DashIntervalSelect";
import StatusFilteringBadgeWrapper from "../StatusFilter/StatusFilteringBadgeWrapper";

const TransactionsWrapper = () => {
  const [activeStatusBadge, setActiveStatusBadge] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInterval, setSelectedInterval] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Transaction[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);

  const [statusList, setStatusList] = useState<{}>({});
  const [merchantsList, setMerchantsList] = useState<string[]>([]);
  const [providersList, setProvidersList] = useState<string[]>([]);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const fetchTransactionsData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      params.append("page", currentPage.toString());

      if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
        params.append("from", selectedDateRange.from.toISOString());
        params.append("to", selectedDateRange.to.toISOString());
      } else if (selectedInterval) {
        params.append("interval", selectedInterval);
      }

      if (searchQuery) {
        params.append("query", searchQuery);
      }

      if (activeStatusBadge) {
        params.append("status", activeStatusBadge);
      }

      if (selectedMerchants.length > 0) {
        params.append("merchant", selectedMerchants.join(","));
      }

      if (selectedProviders.length > 0) {
        params.append("provider", selectedProviders.join(","));
      }

      if (selectedStatus.length > 0) {
        params.append("statusSelect", selectedStatus.join(", "));
      }

      const response = await fetch(
        `/api/get-all-transactions?${params.toString()}`,
        {
          method: "GET",
        },
      );

      const {
        paginatedTransactions,
        totalPages,
        providersList,
        merchantsList,
        statusList,
      }: {
        paginatedTransactions: Transaction[];
        totalPages: number;
        providersList: string[];
        merchantsList: string[];
        statusList: string[];
      } = await response.json();
      setPaginatedTransactions(paginatedTransactions);
      setTotalPages(totalPages);
      setLoading(false);
      setMerchantsList(merchantsList);
      setProvidersList(providersList);
      setStatusList(statusList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, [
    selectedInterval,
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

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    setSelectedDateRange(undefined);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    setSelectedInterval("Select Interval");
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
        <div className="flex flex-row gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
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

        <DashButton name={"export"} type={"filled"} />
      </div>

      <StatusFilteringBadgeWrapper
        statusList={statusList}
        statusFilters={statusFilters}
        counter={transactions.length.toString()}
        activeStatusBadge={activeStatusBadge}
        onClickHandler={activeFilterBageHandler}
      />

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
