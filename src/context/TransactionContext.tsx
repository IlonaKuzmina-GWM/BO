"use client";

import React, { createContext, useContext, useState } from 'react';

type TransactionContextType = {
  checkedTransactions: string[];
  toggleTransaction: (transactionId: string) => void;
  toggleAllTransactions: (transactionIds: string[]) => void;
  resetCheckBoxTransactions: () => void;
  allChecked: boolean;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkedTransactions, setCheckedTransactions] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState(false);

  const toggleTransaction = (transactionId: string) => {
    setCheckedTransactions((currentState) =>
      currentState.includes(transactionId)
        ? currentState.filter((id) => id !== transactionId)
        : [...currentState, transactionId]
    );
  };

  const toggleAllTransactions = (transactionIds: string[]) => {
    setAllChecked(!allChecked);
    setCheckedTransactions(allChecked ? [] : transactionIds);
  };

  const resetCheckBoxTransactions = () => {
    setCheckedTransactions([]);
    setAllChecked(false);
  };

  return (
    <TransactionContext.Provider
      value={{
        checkedTransactions,
        toggleTransaction,
        toggleAllTransactions,
        resetCheckBoxTransactions,
        allChecked,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};
