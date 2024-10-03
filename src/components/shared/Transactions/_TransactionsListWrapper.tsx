"use client";

import React, { useEffect, useState } from "react";
import StatusFilteringBadge from "../StatusFilter/StatusFilteringBadge";
import { Header, Transaction } from "@/types";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import DataLimitsSeter from "../DataLimitsSeter";
import { LoadingSpiner } from "../LoadingUI/LoadingSpiner";
import { useSearchParams } from "next/navigation";
import { TransactionsTableHeader } from "@/utils/tableHeaders";

const TransactionsListWrapper = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilterBadge, setActiveFilterBage] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const [limit, setLimit] = useState<number>(10);

  const fetchTransactions = async (page: number) => {
    const response = await fetch(
      `/api/get-transactions?page=${page}&limit=${limit}&query=${searchQuery}`,
    );
    const data = await response.json();

    setTransactions(data.transactions);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, limit]);

  useEffect(() => {
    const queryParam = searchParams.get("query");
    setSearchQuery(queryParam || "");
  }, [searchParams]);

  const transformStatus = (status: string): string => {
    const parts = status.split("_");

    if (parts.length > 1) {
      parts.shift();
    }

    const transformed = parts.join("_").toLowerCase();

    return transformed.charAt(0) + transformed.slice(1);
  };

  const countTransactionsByStatus = (status: string) => {
    return transactions.filter(
      (transaction) => transformStatus(transaction.status) === status,
    ).length;
  };

  const uniqueStatuses = Array.from(
    new Set(
      transactions.map((transaction) => transformStatus(transaction.status)),
    ),
  );

  const activeFilterBageHandler = (name: string) => {
    setActiveFilterBage(name);
  };

  useEffect(() => {
    const filtered =
      activeFilterBadge === "all"
        ? transactions
        : transactions.filter(
            (transaction) =>
              transformStatus(transaction.status) === activeFilterBadge,
          );
    setFilteredTransactions(filtered);
  }, [activeFilterBadge, transactions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    setLimit(limit);
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4 flex flex-row gap-6">
        <StatusFilteringBadge
          name={"all"}
          counter={transactions.length.toString()}
          filterActive={activeFilterBadge}
          onClickHandler={activeFilterBageHandler}
        />
        {uniqueStatuses.slice(0, 10).map((status, index) => (
          <StatusFilteringBadge
            key={index}
            name={transformStatus(status)}
            counter={countTransactionsByStatus(
              transformStatus(status),
            ).toString()}
            filterActive={activeFilterBadge}
            onClickHandler={activeFilterBageHandler}
          />
        ))}
      </div>

      {/* <CustomTransactionTable data={filteredTransactions} columns={TransactionsTableHeader} /> */}

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

export default TransactionsListWrapper;