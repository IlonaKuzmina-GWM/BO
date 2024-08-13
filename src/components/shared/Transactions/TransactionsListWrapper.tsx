"use client";

import React, { useEffect, useState } from "react";
import TransactionRow from "./TransactionRow";
import TransactionsListTitleRow from "./TransactionsListTitleRow";
import StatusFilteringBadge from "../StatusFilteringBadge";
import { Transaction } from "@/types";
import transactionsData from "@/utils/myjsonfile.json";

const TransactionsListWrapper = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Simulate data fetching
  useEffect(() => {
    // Mock fetch function
    const fetchTransactions = async () => {
      // Simulate a network request
      const data = transactionsData.transactions;
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <div className="flex flex-row gap-6 mt-4">
        <StatusFilteringBadge name={"All"} counter={"27"} filterActive />{" "}
        <StatusFilteringBadge
          name={"Success"}
          counter={"14"}
          filterActive={false}
        />
      </div>

      <div>
        <TransactionsListTitleRow />
        <div>
          {transactions.slice(0,10).map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsListWrapper;
