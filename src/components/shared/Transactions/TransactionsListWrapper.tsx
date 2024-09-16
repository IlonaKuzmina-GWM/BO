"use client";

import React, { useEffect, useState } from "react";
import StatusFilteringBadge from "../StatusFilteringBadge";
import { Header, Transaction } from "@/types";
import PaginationComponent from "../PaginationComponent ";
import CustomTransactionTable from "./CustomTransactionTable";
import DataLimitsSeter from "../DataLimitsSeter";

const TransactionsListWrapper = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilterBadge, setActiveFilterBage] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const [limit, setLimit] = useState<number>(10);

  console.log(limit)

  // const limit = 10;

  const columns: Header[] = [
    { key: "id", title: "ID", width: "7%", centered: true },
    { key: "status", title: "Status", width: "8%" },
    { key: "amount", title: "Amount", width: "10%" },
    { key: "name", title: "Name", width: "10%" },
    { key: "email", title: "Email", width: "17%" },
    { key: "merchant", title: "Merchant", width: "10%" },
    { key: "provider", title: "Provider", width: "10%" },
    { key: "createdAt", title: "Created", width: "8%", centered: true },
    { key: "updatedAt", title: "Updated", width: "8%", centered: true },
    { key: "setl", title: "Setl.", width: "5%", centered: true },
  ];

  const fetchTransactions = async (page: number) => {
    const response = await fetch(
      `/api/get-transactions?page=${page}&limit=${limit}`,
    );
    const data = await response.json();

    setTransactions(data.transactions);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage,limit]);

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

      <CustomTransactionTable data={filteredTransactions} columns={columns} />

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
