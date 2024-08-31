import React from "react";

interface SelectAccountProps {
  accountTypes: string[];
  selectedAccount: string;
  onAccountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectAccount: React.FC<SelectAccountProps> = ({
  accountTypes,
  selectedAccount,
  onAccountChange,
}) => {
  return (
    <div className="flex flex-row gap-[20px] bg-hoverBg h-[32px] items-center">
      <p className="ml-[4px]">Select Account: </p>
      <div className="flex flex-row gap-[20px]">
        {accountTypes.map((account) => (
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
  );
};

export default SelectAccount;