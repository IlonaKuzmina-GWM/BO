import React from "react";

interface SelectAccountProps {
  accountTypes: string[];
  selectedAccount: string;
  onAccountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
}

const SelectAccount: React.FC<SelectAccountProps> = ({
  accountTypes,
  selectedAccount,
  onAccountChange,
  isInvalid = false,
}) => {
  return (
    <>
      <div className="flex h-[32px] flex-row items-center gap-[20px] bg-hoverBg">
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
      {isInvalid && (
        <div className="text-[12px] text-error">This field is required</div>
      )}
    </>
  );
};

export default SelectAccount;
