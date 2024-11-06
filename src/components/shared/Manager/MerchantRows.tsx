import React from "react";
import Switcher from "@/components/UI/Switcher";
import TableRowSelect from "@/components/UI/TableRowSelect";
import { Merchant } from "@/types/merchant";

interface IMerchantRowProps {
  merchant: Merchant;
  toggleStatus?: (id: string) => void;
  providers?: { value: string; label: string }[];
  updateProvider?: (id: string, provider: string) => void;
}

const MerchantRows = ({
  merchant,
  toggleStatus,
  providers,
  updateProvider,
}: IMerchantRowProps) => {
  const statusClass = merchant.disabled
    ? "text-success bg-successBg"
    : "text-error bg-errorBg";

  // const setSelectedValues = (selectedValue: string) => {
  //   updateProvider(merchant.id, selectedValue);
  // };

  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{merchant.id}</td>
      <td className="pr-2">{merchant.name}</td>
      <td className="pr-2">kaut kāds selects</td>
      <td className="pr-2">{merchant.label}</td>
      <td className="pr-2">
        <a href={merchant.host} target="_blanc">
          {merchant.host}
        </a>
      </td>
      <td className="border-x border-hoverBg text-center">
        {merchant.settlementedAmount}
      </td>
      <td className="flex border-x border-hoverBg p-2">
        {/* <TableRowSelect
          value={merchant.}
          label={"All Providers"}
          items={providers}
          searchInput
          onSelectHandler={setSelectedValues}
        /> */}
      </td>

      <td className="px-2">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${statusClass}`}
        >
          {merchant.disabled}
        </div>
      </td>
      <td className="pr-3 text-[--error] lg:pr-8">
        <Switcher
          id={`switcher-${merchant.id}`}
          checked={merchant.disabled}
          onChange={() => {}}
        />
      </td>
    </>
  );
};

export default MerchantRows;
