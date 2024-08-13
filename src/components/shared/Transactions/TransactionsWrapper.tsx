import React from "react";
import TransactionRow from "./TransactionRow";
import TransactionsFilterBar from "./TransactionsFilterBar";
import TransactionsListWrapper from "./TransactionsListWrapper";

const TransactionsWrapper = () => {
  return (
    <div>
      <TransactionsFilterBar />
      <TransactionsListWrapper/>
    </div>
  );
};

export default TransactionsWrapper;
