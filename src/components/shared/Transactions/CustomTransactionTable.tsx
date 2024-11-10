"use client";

import { Header } from "@/types";
import { useEffect, useState } from "react";
import StatusBadge from "../StatusBadge";
import Image from "next/image";
import React from "react";
import CustomCheckbox from "@/components/UI/CustomCheckbox";
import DashButton from "../DashButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/collapsible";
import { ChevronDown } from "lucide-react";
import LogHistory from "../LogHistory";
import { formatDateTime } from "@/helpers/dateFormater";
import LoadingTransactionTableSkeleton from "../LoadingUI/LoadingTransactionTableSkeleton";
import { STATUSES } from "@/constants/statuses";
import { useStore } from "@/stores/StoreProvider";
import { ROLES } from "@/constants/roles";
import { transformStatus } from "@/helpers/transformStatus ";
import {
  getFailedColor,
  getProcessColor,
  getStatusColorClass,
  getSuccessColor,
} from "@/helpers/getColorByStatus";
import ExpandedTransactionDetails from "./ExpandedTransactionDetails";
import { Transaction } from "@/types/transaction";

interface ICustomTransactionTableProps {
  columns: Header[];
  paginatedTransactions: Transaction[];
}

const CustomTransactionTable = ({
  columns,
  paginatedTransactions,
}: ICustomTransactionTableProps) => {
  const { authStore, alertStore } = useStore();

  const userRole = authStore.role;
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});
  const [checkedTransactions, setCheckedTransactions] = useState<{
    [key: number]: boolean;
  }>({});
  const [allChecked, setAllChecked] = useState(false);
  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [webhookExpanded, setWebhookExpanded] = useState<{
    [transactionId: number]: {
      [webhookIndex: string]: boolean;
    };
  }>({});
  const [, setExpandedDropdowns] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const refundTransaction = async (txId: string) => {
    try {
      const response = await fetch("/api/post-refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txId: txId, isRefunded: false }),
      });
      if (response.ok) {
        const res = await response.json();

        alertStore.setAlert("success", "Transaction refunded successfully!");
      } else {
        alertStore.setAlert(
          "warning",
          "Status update failed for this transaction.",
        );
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        `Something went wrong with the refund process. ${error}`,
      );
    }
  };

  const handleSelectStatus = async (value: string, txId: String) => {
    console.log(value, txId);

    try {
      const response = await fetch("/api/post-transactions-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txId: txId,
          status: value,
        }),
      });
      if (response.ok) {
        const res = await response.json();

        alertStore.setAlert("success", `Successfuly!`);
      } else {
        alertStore.setAlert(
          "warning",
          "New status not found for this transaction in the Bank.",
        );
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        "Something went wrong with the refund process.",
      );
    }

    // await api('/transactions/status', { method: 'POST', body: {txId: transactionData.value.txId, status: selectedStatus} })
    //     .then((res: any) => {
    //         if (res.success) {
    //             transactionData.value.status = selectedStatus;
    //             transactionData.value.webhooks.push(res.newWebhook);
    //             filterWebhooksByDate();
    //             message.success(`Successfuly!`)
    //         }
    //     })
  };

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

  const toggleWebhook = (transactionId: number, webhookIndex: number) => {
    setWebhookExpanded((prev) => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [webhookIndex]: !prev[transactionId]?.[webhookIndex],
      },
    }));
  };

  const handleAllCheckboxChange = () => {
    setAllChecked(!allChecked);
    const newCheckedState = paginatedTransactions.reduce(
      (acc, transaction) => {
        acc[transaction.id] = !allChecked;
        return acc;
      },
      {} as { [key: number]: boolean },
    );
    setCheckedTransactions(newCheckedState);
  };

  const handleCheckboxChange = (
    transactionId: number,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();

    setCheckedTransactions((prevState) => ({
      ...prevState,
      [transactionId]: !prevState[transactionId],
    }));
  };

  // useEffect(() => {
  //   setAllChecked(
  //     paginatedTransactions.every(
  //       (transaction) => checkedTransactions[transaction.id],
  //     ),
  //   );
  // }, [checkedTransactions, paginatedTransactions]);

  useEffect(() => {}, [paginatedTransactions]);

  const handleCopyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedOrderID(id);
      setTimeout(() => {
        setCopiedOrderID(null);
      }, 1500);
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
          {loading ? (
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
              const expandedWebhooks = webhookExpanded[transaction.id] || {};
              // console.log(transaction);

              return (
                <React.Fragment key={transaction.id}>
                  <tr
                    className={`relative h-[50px] cursor-pointer border-b-[1px] border-b-hoverBg transition-all duration-300 last:border-none ${!isExpanded ? "bg-whiteBg hover:bg-hoverBg" : `bg-${dynamicColor}`}`}
                    onClick={() => toggleRow(transaction)}
                  >
                    <td className="pl-3">
                      <CustomCheckbox
                        isChecked={checkedTransactions[transaction.id] || false}
                        handleCheckboxChange={(event) =>
                          handleCheckboxChange(transaction.id, event)
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
                          handleSelectStatus={handleSelectStatus}
                          refundTransaction={refundTransaction}
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
