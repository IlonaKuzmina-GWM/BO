import React from "react";
import Switcher from "@/components/UI/Switcher";
import TableRowSelect from "@/components/UI/TableRowSelect";
import { Merchant } from "@/types/merchant";

interface IMerchantRowProps {
  merchant: Merchant;
  toggleStatus: (id: number) => void;
  providers?: { value: string; label: string }[];
  updateProvider: (id: number, provider: string) => void;
  updateStore: (id: number, provider: string) => void;
  merchantConfigurationBarToggler: (id: number) => void;
}

const MerchantRows = ({
  merchant,
  toggleStatus,
  providers,
  updateProvider,
  updateStore,
  merchantConfigurationBarToggler,
}: IMerchantRowProps) => {
  const statusClass = merchant.disabled
    ? "text-success bg-successBg"
    : "text-error bg-errorBg";

  const setSelectedProviderValues = (selectedValue: string) => {
    updateProvider && updateProvider(merchant.id, selectedValue);
  };

  const setSelectedStoreValues = (selectedValue: string) => {
    updateStore && updateStore(merchant.store.id, selectedValue);
  };

  const openMerchantCongigBar = () => {
    merchantConfigurationBarToggler &&
      merchantConfigurationBarToggler(merchant.id);
  };

  return (
    <>
      <td className="border-e border-hoverBg pl-3 pr-2 lg:pl-8">
        {merchant.id}
      </td>
      <td
        className="border-e border-hoverBg px-2 cursor-pointer"
        onClick={openMerchantCongigBar}
      >
        {merchant.name}
      </td>
      <td className="border-e border-hoverBg p-2">
        <TableRowSelect
          value={""}
          label={"All Merchants"}
          items={[]}
          searchInput
          onSelectHandler={setSelectedStoreValues}
        />
      </td>
      <td className="border-e border-hoverBg px-2">{merchant.label}</td>
      <td className="border-e border-hoverBg px-2">
        <a
          href={`https://${merchant.host}`}
          target="_blank"
          className="text-blue500"
        >
          @{merchant.host}
        </a>
      </td>
      <td className="border-e border-hoverBg px-2 text-center">
        {merchant.settlementedAmount}
      </td>
      <td className="flex border-e border-hoverBg p-2">
        <TableRowSelect
          value={""}
          label={"All Providers"}
          items={[]}
          searchInput
          onSelectHandler={setSelectedProviderValues}
        />
      </td>

      <td className="px-2">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${statusClass}`}
        >
          {merchant.disabled ? "Enable" : "Disable"}
        </div>
      </td>
      <td className="px-2 text-[--error] lg:pr-8">
        <Switcher
          id={`switcher-${merchant.id}`}
          checked={merchant.disabled}
          onChange={() => toggleStatus(merchant.id)}
        />
      </td>
    </>
  );
};

export default MerchantRows;
