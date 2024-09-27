"use client";

import React, { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";
import TransactionsFilterBar from "./_TransactionsFilterBar";
import TransactionsListWrapper from "./_TransactionsListWrapper";
import loading from "@/app/loading";
import Search from "../Search";
import { DateRange } from "react-day-picker";
import DashButton from "../DashButton";
import DashSelect from "../DashSelect";
import DatePickerWithRange from "../DatePickerWithRange";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { Transaction } from "@/types";
import StatusFilteringBadge from "../StatusFilteringBadge";
import { TransactionsTableHeader } from "@/utils/tableHeaders";
import DataLimitsSeter from "../DataLimitsSeter";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import { IntervalSelect } from "@/components/UI/IntervalSelect";

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

  const [merchantsList, setMerchantsList] = useState<string[]>([]);
  const [providersList, setProvidersList] = useState<string[]>([]);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

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
      }: {
        paginatedTransactions: Transaction[];
        totalPages: number;
        providersList: string[];
        merchantsList: string[];
      } = await response.json();
      setPaginatedTransactions(paginatedTransactions);
      setTotalPages(totalPages);
      setLoading(false);
      setMerchantsList(merchantsList);
      setProvidersList(providersList);

      console.log(merchantsList);
      console.log("paginatedTransactions", paginatedTransactions);
      // console.log("totalTransactions", totalTransactions);
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
  ]);

  // const transformStatus = (status: string): string => {
  //   const parts = status.split("_");

  //   if (parts.length > 1) {
  //     parts.shift();
  //   }

  //   const transformed = parts.join("_").toLowerCase();

  //   return transformed.charAt(0) + transformed.slice(1);
  // };

  const transformStatus = (
    status: string,
  ): { originalStatus: string; transformedStatus: string } => {
    const parts = status.split("_");

    if (parts.length > 1) {
      parts.shift();
    }

    const transformed = parts.join("_").toLowerCase();

    return {
      originalStatus: status,
      transformedStatus: transformed.charAt(0) + transformed.slice(1),
    };
  };

  const countTransactionsByStatus = (status: string) => {
    return paginatedTransactions.filter(
      (transaction) =>
        transformStatus(transaction.status).transformedStatus === status,
    ).length;
  };

  const uniqueStatuses = Array.from(
    new Set(
      paginatedTransactions.map((transaction) =>
        transformStatus(transaction.status),
      ),
    ),
  );

  const activeFilterBageHandler = (name: string) => {
    setActiveStatusBadge(name);
  };

  // useEffect(() => {
  //   const filtered =
  //     activeFilterBadge === "all"
  //       ? paginatedTransactions
  //       : paginatedTransactions.filter(
  //           (transaction) =>
  //             transformStatus(transaction.status) === activeFilterBadge,
  //         );
  //   setPaginatedTransactions(filtered);
  // }, [activeFilterBadge, paginatedTransactions]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  const handleIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInterval(event.target.value);
    setSelectedDateRange(undefined);
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

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-5">
          <Search
            placeholder="Enter name, email, provider"
            aditionalClass="max-w-[302px]"
            onSearch={handleSearch}
          />

          <div className="flex">
            <IntervalSelect
              onIntervalChange={handleIntervalChange}
              selectedInterval={selectedInterval}
            />
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
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
            searchInput={false}
            searchContext="provider"
            onSelectHandler={handleProviderSelect}
          />
        </div>

        <DashButton name={"export"} type={"filled"} />
      </div>
      <div className="mt-4 flex flex-row gap-6">
        <StatusFilteringBadge
          name={"all"}
          counter={transactions.length.toString()}
          filterActive={activeStatusBadge}
          onClickHandler={activeFilterBageHandler}
        />
        {/* {uniqueStatuses.slice(0, 10).map((status, index) => (
          <StatusFilteringBadge
            key={index}
            name={transformStatus(status)}
            counter={countTransactionsByStatus(
              transformStatus(status),
            ).toString()}
            filterActive={activeFilterBadge}
            onClickHandler={activeFilterBageHandler}
          />
        ))} */}
      </div>

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
