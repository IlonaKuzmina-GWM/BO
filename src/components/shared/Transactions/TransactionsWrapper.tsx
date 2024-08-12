import React from "react";
import TransactionRow from "./TransactionRow";
import TransactionsFilterBar from "./TransactionsFilterBar";

const TransactionsWrapper = () => {
  return (
    <div>
      <TransactionsFilterBar />
      <TransactionRow />
    </div>
  );
};

export default TransactionsWrapper;
