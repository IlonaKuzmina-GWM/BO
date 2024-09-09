import React from "react";
import DashButton from "../DashButton";

interface SettlementInfoProps {
  data: {
    summary: { label: string; value: string }[];
    totalAmounts: { label: string; value: string }[];
    totalPayout: string;
  };
}

const SettlementInfo = ({ data }: SettlementInfoProps) => {
  return (
    <div className="max-w-[560px] rounded-[4px] bg-white p-[20px] pr-[197px]">
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
            onClickHandler={() => {}}
          />
          <DashButton name="Export" type="empty" onClickHandler={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default SettlementInfo;
