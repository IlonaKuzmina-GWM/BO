"use client";

import React, { createContext, useContext, useState } from 'react';

type SiinsContextType = {
  checkedSiins: number[];
  toggleSiin: (siinsId: number) => void;
  toggleAllSiins: (siinsIds: number[]) => void;
  resetCheckBoxSiins: () => void;
  allSiinsChecked: boolean;
};

const SiinsContext = createContext<SiinsContextType | undefined>(undefined);

export const SiinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkedSiins, setCheckedSiins] = useState<number[]>([]);
  const [allSiinsChecked, setAllSiins] = useState(false);

  const toggleSiin = (siinsId: number) => {
    setCheckedSiins((currentState) =>
      currentState.includes(siinsId)
        ? currentState.filter((id) => id !== siinsId)
        : [...currentState, siinsId]
    );
  };

  const toggleAllSiins = (siinsIds: number[]) => {
    setAllSiins(!allSiinsChecked);
    setCheckedSiins(allSiinsChecked ? [] : siinsIds);
  };

  const resetCheckBoxSiins = () => {
    setCheckedSiins([]);
    setAllSiins(false);
  };

  return (
    <SiinsContext.Provider
      value={{
        checkedSiins,
        toggleSiin,
        toggleAllSiins,
        resetCheckBoxSiins,
        allSiinsChecked,
      }}
    >
      {children}
    </SiinsContext.Provider>
  );
};

export const useSiinsContext = () => {
  const context = useContext(SiinsContext);
  if (!context) {
    throw new Error('useSiinsContext must be used within a SiinsProvider');
  }
  return context;
};
