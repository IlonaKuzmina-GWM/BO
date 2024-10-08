import React from "react";
import DashButton from "../DashButton";
import { Transaction } from "@/types/transaction";
import { exportExcelTransactions } from "@/utils/export-utils";

interface SettlementInfoProps {
  data: {
    summary: { label: string; value: string }[];
    totalAmounts: { label: string; value: string }[];
    totalPayout: string;
    transactions: Transaction[];
  };
}

const updateSettlementStatus = async (transactions: Transaction[]) => {
  try {
    for (const transaction of transactions) {
      const response = await fetch("/api/some-kind-of-route", {
        method: "POST",
        body: JSON.stringify({ transactionId: transaction.id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success) {
        transaction.isSettled = true;
      } else {
        console.error("Failed to update settlement status:", data.message);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const SettlementInfo = ({ data }: SettlementInfoProps) => {
  return (
    <div className="w-[420px] rounded-[4px] bg-white p-[20px]">
      <div className="flex flex-col gap-[24px] pb-[32px]">
        <div className="flex flex-col gap-[16px]">
          <h3 className="font-medium text-main">
            Transaction and Fees Summary
          </h3>
          <div className="flex flex-row justify-between text-[14px] text-main">
            <div className="flex flex-col gap-[8px]">
              {data.summary.map((item, index) => (
                <p key={index}>{item.label}</p>
              ))}
            </div>
            <div className="flex flex-col gap-[8px] text-end font-medium">
              {data.summary.map((item, index) => (
                <p key={index}>{item.value}</p>
              ))}
            </div>
          </div>
          <h3 className="font-medium text-main">Total Amounts</h3>
          <div className="flex flex-row justify-between text-[14px] text-main">
            <div className="flex flex-col gap-[8px]">
              {data.totalAmounts.map((item, index) => (
                <p key={index}>{item.label}</p>
              ))}
            </div>
            <div className="flex flex-col gap-[8px] text-end font-medium">
              {data.totalAmounts.map((item, index) => (
                <p key={index}>{item.value}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between text-[18px] font-medium text-main">
          <h3>Total Amount to Payout</h3>
          <p>{data.totalPayout}</p>
        </div>
        <div className="flex flex-row justify-between">
          <DashButton
            name="Set Settlement"
            type="filled"
            onClickHandler={() => updateSettlementStatus(data.transactions)}
          />
          <DashButton name="Export" type="empty" onClickHandler={() => exportExcelTransactions(data.transactions)} />
        </div>
      </div>
    </div>
  );
};

export default SettlementInfo;
