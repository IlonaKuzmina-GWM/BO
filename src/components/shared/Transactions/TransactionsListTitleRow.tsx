
import React from "react";

const TransactionsListTitleRow = () => {
  return (
    <div className="flex flex-row justify-between gap-4 border-b-divider bg-hoverBg py-[10px] text-sm font-semibold text-main">
      <div className="flex max-w-10 px-4 items-center justify-center">
        {/* <Checkbox className="h-4 w-4 rounded-sm border-divider bg-white" /> */}
      </div>
      <div className="w-1/12 text-center">ID</div>
      <div className="w-1/12">Status</div>
      <div className="w-1/12">Amount</div>
      <div className="w-1/12">Client</div>
      <div className="w-1/12">Email</div>
      <div className="w-2/12">Merchant</div>
      <div className="w-1/12">Provider</div>
      <div className="w-1/12 text-center">Created</div>
      <div className="w-1/12 text-center">Updated</div>
      <div className="flex max-w-10 items-center justify-center pe-2 w-[60px]">Setl.</div>
    </div>
  );
};

export default TransactionsListTitleRow;
