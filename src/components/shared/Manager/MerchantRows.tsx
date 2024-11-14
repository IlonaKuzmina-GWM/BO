import React from "react";
import Switcher from "@/components/UI/Switcher";
import TableRowSelect from "@/components/UI/TableRowSelect";
import { Merchant } from "@/types/merchant";

interface MerchantList {
  merchant_id: number;
  merchant_name: string;
}

interface ProviderList {
  provider_id: number;
  provider_name: string;
}

interface IMerchantRowProps {
  merchant: Merchant;
  toggleStatus: (id: number) => void;
  providersList: ProviderList[];
  merchantsList: MerchantList[];
  updateProvider: (id: number, provider: number) => void;
  updateStore: (id: number, provider: number) => void;
  merchantConfigurationBarToggler: (id: number) => void;
}

const MerchantRows = ({
  merchant,
  toggleStatus,
  providersList,
  merchantsList,
  updateProvider,
  updateStore,
  merchantConfigurationBarToggler,
}: IMerchantRowProps) => {
  const statusClass = merchant.disabled
    ? "text-success bg-successBg"
    : "text-error bg-errorBg";

  const setSelectedProviderValues = (selectedValue: number) => {
    updateProvider && updateProvider(merchant.id, selectedValue);
  };

  const setSelectedStoreValues = (selectedValue: number) => {
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
        className="cursor-pointer border-e border-hoverBg px-2"
        onClick={openMerchantCongigBar}
      >
        {merchant.name}
      </td>
      <td className="border-e border-hoverBg p-2">
        <TableRowSelect
          value={0}
          label={"All Stores"}
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
          value={0}
          label={"All Providers"}
          items={providersList.map((provider) => ({
            value: provider.provider_id,
            label: provider.provider_name,
          }))}
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
