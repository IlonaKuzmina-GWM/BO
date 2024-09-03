import React from "react";
import Switcher from "@/components/UI/Switcher";
import { Merchant } from "@/types";
import TableRowSelect from "@/components/UI/TableRowSelect";

interface IMerchantRowProps {
  merchant: Merchant;
  toggleStatus: (id: string) => void;
  providers: { value: string; label: string }[];
  updateProvider: (id: string, provider: string) => void;
}

const MerchantRows = ({
  merchant,
  toggleStatus,
  providers,
  updateProvider,
}: IMerchantRowProps) => {
  const statusClass =
    merchant.status === "Enabled"
      ? "text-success bg-successBg"
      : "text-error bg-errorBg";

  const setSelectedValues = (selectedValue: string) => {
    updateProvider(merchant.id, selectedValue);
  };

  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{merchant.id}</td>
      <td className="pr-2">{merchant.name}</td>
      <td className="pr-2">{merchant.host}</td>
      <td className="pr-2">{merchant.label}</td>
      <td className="border-x border-hoverBg text-center">{merchant.store}</td>
      <td className="border-x border-hoverBg text-center">{merchant.feePercent}</td>
      <td className="border-x border-hoverBg text-center">{merchant.feeEur}</td>
      <td className="border-x border-hoverBg text-center">{merchant.setl}</td>
      <td className="border-x border-hoverBg text-center">{merchant.amount}</td>
      <td className="p-2 flex border-x border-hoverBg">
        <TableRowSelect
          value={merchant.providers}
          label={"All Providers"}
          items={providers}
          searchInput
          onSelectHandler={setSelectedValues}
        />
      </td>
      <td className="px-2">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${statusClass}`}
        >
          {merchant.status}
        </div>
      </td>
      <td className="pr-3 text-[--error] lg:pr-8">
        <Switcher
          id={`switcher-${merchant.id}`}
          onChange={() => toggleStatus(merchant.id)}
          checked={merchant.status === "Enabled"}
        />
      </td>
    </>
  );
};

export default MerchantRows;
