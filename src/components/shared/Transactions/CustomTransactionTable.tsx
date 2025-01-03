"use client";

import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { useTransactionContext } from "@/context/TransactionContext";
import {
  getFailedColor,
  getProcessColor,
  getSuccessColor,
} from "@/helpers/getColorByStatus";
import { useStore } from "@/stores/StoreProvider";
import { Header } from "@/types";
import { Transaction } from "@/types/transaction";
import { formatDateTime } from "@/utils/dateFormater";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoadingTransactionTableSkeleton from "../LoadingUISkeletons/LoadingTransactionTableSkeleton";
import StatusBadge from "../StatusBadge";
import ExpandedTransactionDetails from "./ExpandedTransactionDetails";

interface ICustomTransactionTableProps {
  columns: Header[];
  paginatedTransactions: Transaction[];
  handleStatusChange: (status: string, txId: string) => void;
  isLoading?: boolean;
}

const CustomTransactionTable = ({
  columns,
  paginatedTransactions,
  isLoading,
  handleStatusChange,
}: ICustomTransactionTableProps) => {
  const { authStore, alertStore } = useStore();
  const { checkedTransactions, toggleTransaction, toggleAllTransactions, resetCheckBoxTransactions } =
    useTransactionContext();
  const userRole = authStore.role;
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});
  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [expandedWebhooks, setExpandedWebhooks] = useState<{
    [key: number]: boolean;
  }>({});

  const changeStatus = async (type: string, status: string, txId: string) => {
    let body: object;
    let route: string;

    if (type === 'refund') {
      route = '/api/post-refund';
      body = {
        txId,
        isRefunded: true,
      }
    } else {
      route = '/api/post-transactions-status';
      body = {
        txId,
        status
      }
    }

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        handleStatusChange(status, txId);

        alertStore.setAlert("success", "Status changed successfully!");
      } else {
        alertStore.setAlert(
          "warning",
          "Status update failed for this transaction.",
        );
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        `Something went wrong with the updating process. ${error}`,
      );
    }
  }

  const openAccordionBgColor = (status: string) => {
    switch (status) {
      case "success":
        return "successBg";
      case "failed":
        return "errorBg";
      case "transferring":
        return "warningBg";
      default:
        return "whiteBg";
    }
  };

  const bgColorMap = {
    failed: "bg-errorBg",
    success: "bg-successBg",
    processing: "bg-warningBg",
    default: "bg-gray-200",
  };

  const transformStatus = (status: string) => {
    if (getFailedColor(status)) return "failed";
    if (getSuccessColor(status)) return "success";
    if (getProcessColor(status)) return "processing";
    return "default";
  };

  const toggleRow = (transaction: Transaction) => {
    const { id, status } = transaction;

    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );

    if (!expandedRows.includes(id)) {
      const colorType = transformStatus(status);
      const bgColor = bgColorMap[colorType];

      setRowBgColors((prevBgColors) => ({
        ...prevBgColors,
        [id]: openAccordionBgColor(transformStatus(status)),
      }));
    }
  };

  const toggleWebhook = (webhookId: number) => {
    setExpandedWebhooks((prev) => ({
      ...prev,
      [webhookId]: !prev[webhookId],
    }));
  };

  const handleAllCheckboxChange = () => {
    const transactionIds = paginatedTransactions.map((t) => t.txId);
    toggleAllTransactions(transactionIds);
  };

  const handleCheckboxChange = (transactionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleTransaction(transactionId);
  };

  useEffect(() => {
    return () => {
      resetCheckBoxTransactions()
    }
  }, []);

  const handleCopyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedOrderID(id);
      setTimeout(() => {
        setCopiedOrderID(null);
      }, 1500);
      alertStore.setAlert("success", `Transaction ID copied successfully!`);
    } catch (err) {
      console.error("Error copying to clipboard: ", err);
    }
  };

  const getCurrency = (countryCode: string, provider: string) => {
    if (!countryCode) return "EUR";
    if (countryCode.toLowerCase() === "gb" && provider === "Boodil") {
      return "GBP";
    } else {
      return "EUR";
    }
  };

  return (
    <div className="">
      <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
        <thead className="h-[50px] bg-hoverBg font-semibold">
          <tr>
            <th className="w-[3%] min-w-[35px] pl-3 lg:pl-3">
              <CustomCheckbox handleCheckboxChange={handleAllCheckboxChange} />
            </th>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={` ${index === columns.length - 1 ? "p-2" : ""} ${
                  col.centered ? "text-center" : ""
                } pr-2`}
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <LoadingTransactionTableSkeleton />
          ) : paginatedTransactions?.length === 0 ? (
            <tr className="bg-white">
              <td
                colSpan={columns.length + 1}
                className="py-4 text-center font-medium text-main"
              >
                No transactions available.
              </td>
            </tr>
          ) : (
            paginatedTransactions.map((transaction) => {
              const isExpanded = expandedRows.includes(transaction.id);
              const dynamicColor = rowBgColors[transaction.id];

              return (
                <React.Fragment key={transaction.id}>
                  <tr
                    className={`relative h-[50px] cursor-pointer border-b-[1px] border-b-hoverBg transition-all duration-300 last:border-none ${!isExpanded ? "bg-whiteBg hover:bg-hoverBg" : `bg-${dynamicColor}`}`}
                    onClick={() => toggleRow(transaction)}
                  >
                    <td className="pl-3">
                      <CustomCheckbox
                        isChecked={checkedTransactions.includes(transaction.txId)}
                        handleCheckboxChange={(event) =>
                          handleCheckboxChange(transaction.txId, event)
                        }
                      />
                    </td>
                    <td className="pe-2 text-center">{transaction.id}</td>
                    <td className="pe-2">
                      <StatusBadge name={transaction.status} />
                    </td>
                    <td className="pe-8 font-semibold">{transaction.amount}</td>
                    <td className="pe-2">
                      {getCurrency(
                        transaction?.initialRequest?.countryCode,
                        transaction.provider.name,
                      )}
                    </td>
                    <td className="pe-2">{`${transaction.initialRequest.firstName} ${transaction.initialRequest.lastName}`}</td>
                    <td className="pe-2">{transaction.initialRequest.email}</td>
                    <td className="pe-2">{transaction.merchant.name}</td>
                    <td className="pe-2">{transaction.provider.name}</td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                        <span>
                          {formatDateTime(transaction.createdAt).date}
                        </span>
                        <span>
                          {formatDateTime(transaction.createdAt).time}
                        </span>
                      </span>
                    </td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                        <span>
                          {formatDateTime(transaction.updatedAt).date}
                        </span>
                        <span>
                          {formatDateTime(transaction.updatedAt).time}
                        </span>
                      </span>
                    </td>
                    <td className="">
                      <Image
                        src={"/icons/status-yes.svg"}
                        alt={"Setl icon"}
                        height={16}
                        width={16}
                        className={`mx-auto h-4 w-4 ${!transaction.isSettled && "opacity-30"}`}
                      />
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className={`border-b-[3px] p-6`}
                        style={{
                          borderBottomColor: `var(--${dynamicColor.slice(0, -2)})`,
                        }}
                      >
                        <ExpandedTransactionDetails
                          transaction={transaction}
                          userRole={userRole}
                          copiedOrderID={copiedOrderID}
                          handleCopyToClipboard={handleCopyToClipboard}
                          handleSelectStatus={changeStatus}
                          expandedWebhooks={expandedWebhooks}
                          toggleWebhook={toggleWebhook}
                          getCurrency={getCurrency}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTransactionTable;
