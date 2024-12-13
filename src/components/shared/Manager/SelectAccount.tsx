"use client";

import { useStore } from "@/stores/StoreProvider";
import { ROLES } from "@/constants/roles";
import React, { useEffect } from "react";

interface SelectAccountProps {
  selectedAccount: string;
  onAccountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setInitialAccount: (account: string) => void;
}

const SelectAccount: React.FC<SelectAccountProps> = ({
  selectedAccount,
  onAccountChange,
  setInitialAccount,
}) => {
  const { authStore } = useStore();
  const userRole = Object.values(ROLES).includes(authStore.role as ROLES)
    ? (authStore.role as ROLES)
    : null;
  const accountTypes = ["merchant", "support", "manager", "user", "agent"];

  const allowedRolesForAccounts = {
    merchant: [ROLES.ADMIN, ROLES.OWNER, ROLES.DEVELOPER, ROLES.MANAGER],
    support: [ROLES.ADMIN, ROLES.OWNER, ROLES.DEVELOPER, ROLES.MANAGER],
    manager: [ROLES.ADMIN, ROLES.OWNER, ROLES.DEVELOPER, ROLES.MANAGER],
    user: [ROLES.ADMIN, ROLES.OWNER, ROLES.DEVELOPER, ROLES.MANAGER],
    agent: [ROLES.ADMIN, ROLES.OWNER, ROLES.DEVELOPER],
  };

  // Filter account types based on user role
  const filteredAccountTypes = accountTypes.filter((type) => {
    const allowedRoles =
      allowedRolesForAccounts[type as keyof typeof allowedRolesForAccounts];
    return allowedRoles ? allowedRoles.includes(userRole as ROLES) : false;
  });

  useEffect(() => {
    if (!selectedAccount && filteredAccountTypes.length > 0) {
      setInitialAccount(filteredAccountTypes[0]); // Set the first valid account type
    }
  }, [selectedAccount, filteredAccountTypes, setInitialAccount]);

  return (
    <>
      <div className="flex h-[32px] flex-row items-center gap-[20px] bg-hoverBg">
        <p className="ml-[4px]">Select Account: </p>
        <div className="flex flex-row gap-[20px]">
          {filteredAccountTypes.map((account) => (
            <div key={account} className="flex flex-row gap-[8px]">
              <input
                type="radio"
                id={account}
                name="selectedAccount"
                value={account}
                checked={selectedAccount === account}
                onChange={onAccountChange}
              />
              <label htmlFor={account}>
                {account.charAt(0).toUpperCase() + account.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectAccount;
