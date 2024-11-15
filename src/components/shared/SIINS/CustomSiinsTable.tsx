"use client";
import { Header } from "@/types";
import { useEffect, useState } from "react";
import StatusBadge from "../StatusBadge";
import Checkbox from "../Checkbox";
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
import { formatDateTime } from "@/helpers/dateFormater";
import LoadingSiinTableSkeleton from "../LoadingUI/LoadingSiinTableSkeleton";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/components/UI/tooltip";
import {
  getFailedColor,
  getProcessColor,
  getStatusColorClass,
  getSuccessColor,
} from "@/helpers/getColorByStatus";
import { useStore } from "@/stores/StoreProvider";
import { ROLES } from "@/constants/roles";
import { STATUSES } from "@/constants/statuses";
import LogHistory from "../LogHistory";
import { Siin } from "@/types/siin";
import ExpandedTransactionDetails from "../Transactions/ExpandedTransactionDetails";

interface ICustomSiinsTransactionTableProps {
  columns: Header[];
  data: Siin[];
  handleStatusChangeToFetchActualeTRansaction: (value: string) => void;
}

const CustomSiinsTable = ({
  columns,
  data,
  handleStatusChangeToFetchActualeTRansaction,
}: ICustomSiinsTransactionTableProps) => {
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
  const [expandedWebhooks, setExpandedWebhooks] = useState<{ [key: number]: boolean }>({});
  const [, setExpandedDropdowns] = useState(false);

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
    // console.log(value, txId);

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

        console.log("Successfuly!", res);
      } else {
        console.log("New status not found for this transaction in the");
      }
    } catch (error) {
      console.error(`Oops! Something went wrong: ${error}`);
    }
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

  const toggleRow = (siin: Siin) => {
    const { id } = siin;

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
    setAllChecked(!allChecked);
    const newCheckedState = data.reduce(
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

  useEffect(() => {
    setAllChecked(
      data.every((transaction) => checkedTransactions[transaction.id]),
    );
  }, [checkedTransactions, data]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

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
              {" "}
              <CustomCheckbox
                isChecked={allChecked}
                handleCheckboxChange={handleAllCheckboxChange}
              />
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
            <LoadingSiinTableSkeleton />
          ) : data.length === 0 ? (
            <tr className="bg-white">
              <td
                colSpan={columns.length + 1}
                className="py-4 text-center font-medium text-main"
              >
                No siins available.
              </td>
            </tr>
          ) : (
            data.map((siin) => {
              const transactionsTableHeader =
                siin.transaction && typeof siin.transaction === "object";
              const isExpanded =
                expandedRows.includes(siin.id) && transactionsTableHeader;
              const dynamicColor = rowBgColors[siin.id];
              // const expandedWebhooks = webhookExpanded[siin.id] || {};

              return (
                <React.Fragment key={siin.id}>
                  <tr
                    className={`relative h-[50px] border-b-[1px] border-b-hoverBg bg-whiteBg transition-all duration-300 last:border-none ${transactionsTableHeader ? "cursor-pointer hover:bg-hoverBg" : ""}`}
                    onClick={() => toggleRow(siin)}
                  >
                    <td className="pl-3">
                      <CustomCheckbox
                        isChecked={checkedTransactions[siin.id] || false}
                        handleCheckboxChange={(event) =>
                          handleCheckboxChange(siin.id, event)
                        }
                      />
                    </td>
                    <td className="relative text-center">
                      {transactionsTableHeader ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="h-full w-full">
                              <span className="absolute right-[90%] top-1/2 h-1 w-1 rounded-full bg-slate-600" />
                              {siin.id}
                            </TooltipTrigger>
                            <TooltipContent className="ms-2">
                              <p> SIIN contain transaction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        siin.id
                      )}
                    </td>

                    <td className="pe-8">{siin.senderIban}</td>
                    <td className="pe-2">{`${siin.senderName}`}</td>
                    <td className="pe-2">{siin.senderBankCountry}</td>
                    <td className="pe-2">{siin.referenceCode}</td>
                    <td className="pe-2 font-semibold">€ {siin.amount}</td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center gap-[4px] rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                        <span>{formatDateTime(siin.createdAt).date}</span>{" "}
                        <span>{formatDateTime(siin.createdAt).time}</span>
                      </span>
                    </td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center gap-[4px] rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                        <span>{formatDateTime(siin.updatedAt).date}</span>{" "}
                        <span>{formatDateTime(siin.updatedAt).time}</span>
                      </span>
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
                          transaction={siin.transaction}
                          userRole={userRole}
                          copiedOrderID={copiedOrderID}
                          handleCopyToClipboard={handleCopyToClipboard}
                          handleSelectStatus={handleSelectStatus}
                          handleStatusChangeToFetchActualeTRansaction={handleStatusChangeToFetchActualeTRansaction}
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

export default CustomSiinsTable;
