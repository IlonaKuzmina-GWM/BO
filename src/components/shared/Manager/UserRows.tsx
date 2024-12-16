"use client";

import TableRowSelect from "@/components/shared/TableRowSelect";
import { formatDateTime } from "@/utils/dateFormater";
import { Merchant } from "@/types/merchant";
import { User } from "@/types/user";
import { useState } from "react";

interface IUserRowProps {
  user: User;
  merchantsList: Merchant[];
  updateMerchant: (id: number, merchantLabel: string) => void;
}

const UserRows = ({ user, merchantsList, updateMerchant }: IUserRowProps) => {
  const [selectedMerchant, setSelectedMerchant] = useState<string>(
    user.merchant?.label,
  );

  const getSuccessAndErrorClass = (is: boolean) => {
    return is === false ? "text-success bg-successBg" : "text-error bg-errorBg";
  };

  const setSelectedValues = (selectedLabel: string) => {
    updateMerchant(user.id, selectedLabel);
  };

  return (
    <>
      <td className="pl-3 pr-2 lg:pl-8">{user.id}</td>
      <td className="pr-2">{user.firstName}</td>
      <td className="pr-2">{user.lastName}</td>
      <td className="pr-2">{user.email}</td>
      <td className="p-2">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${getSuccessAndErrorClass(!user.emailVerified)}`}
        >
          {user.emailVerified ? "Verified" : "Not verified"}
        </div>
      </td>
      <td className="flex border-x border-hoverBg p-2 text-center">
        <TableRowSelect
          value={selectedMerchant}
          label={"All Merchants"}
          items={merchantsList.map((merchant) => ({
            value: merchant.id,
            label: merchant.label,
            name: merchant.name,
          }))}
          searchInput
          onSelectStringHandler={setSelectedValues}
        />
      </td>
      <td className="border-x border-hoverBg p-2 text-center lowercase">
        {user.role}
      </td>
      <td className="border-x border-hoverBg p-2 text-center">
        <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
          <span>{formatDateTime(user.createdAt).date}</span>
          <span>{formatDateTime(user.createdAt).time}</span>
        </span>
      </td>
      <td className="pl-2 pr-3 lg:pr-8">
        <div
          className={`flex justify-center rounded-[4px] px-[4px] py-[8px] ${getSuccessAndErrorClass(user.disabled)}`}
        >
          {user.disabled ? "Disabled" : "Enabled"}
        </div>
      </td>
    </>
  );
};

export default UserRows;
