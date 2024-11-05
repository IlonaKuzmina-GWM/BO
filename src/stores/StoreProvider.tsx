
import React, { createContext, useContext, useEffect, useState } from 'react';
import RootStore from './RootStore';

let store: RootStore;

const StoreContext = createContext<RootStore | null>(null);

export const initializeStore = () => {
  const _store = store ?? new RootStore();

  if (typeof window === 'undefined') return _store;

  if (!store) store = _store;

  return _store;
};

// export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
//   const store = initializeStore();
//   return (
//     <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//   );
// };

// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) {
//     throw new Error('useStore must be used within a StoreProvider');
//   }
//   return context;
// };

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store, setStore] = useState(initializeStore);

  useEffect(() => {
    setStore(initializeStore());
  }, []);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};