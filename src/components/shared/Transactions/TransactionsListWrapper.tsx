"use client";

import React, { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";
import TransactionsListTitleRow from "./TransactionsListTitleRow";
import StatusFilteringBadge from "../StatusFilteringBadge";
import { Transaction } from "@/types";
import transactionsData from "@/utils/myjsonfile.json";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/UI/pagination";

const TransactionsListWrapper = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilterBadge, setActiveFilterBage] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const limit = 10;

  // Simulate data fetching
  // useEffect(() => {
  //   // Mock fetch function
  //   const fetchTransactions = async () => {
  //     // Simulate a network request
  //     const data = transactionsData;
  //     setTransactions(data.transactions);
  //     setTotalPages(data.totalPages);
  //   };

  //   fetchTransactions();
  // }, []);

  const fetchTransactions = async (page: number) => {
    // Mock API call, replace with your actual backend API call
    const response = await fetch(
      `/api/get-transactions?page=${page}&limit=${limit}`,
    );
    const data = await response.json();

    setTransactions(data.transactions); // Set transactions state with fetched data
    setTotalPages(data.totalPages); 
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

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

      <div>
        <TransactionsListTitleRow />
        <div>
          {filteredTransactions.slice(0, limit).map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 3 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TransactionsListWrapper;
