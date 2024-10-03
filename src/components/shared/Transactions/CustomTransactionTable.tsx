"use client";

import { Header, Transaction } from "@/types";
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

interface ICustomTransactionTableProps {
  columns: Header[];
  paginatedTransactions: Transaction[];
}

const CustomTransactionTable = ({
  columns,
  paginatedTransactions,
}: ICustomTransactionTableProps) => {
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});
  const [checkedTransactions, setCheckedTransactions] = useState<{
    [key: number]: boolean;
  }>({});
  const [allChecked, setAllChecked] = useState(false);
  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [webhookExpanded, setWebhookExpanded] = useState<{
    [transactionId: string]: {
      [webhookIndex: string]: boolean;
    };
  }>({});

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

  const toggleRow = (transaction: Transaction) => {
    const { id, status } = transaction;

    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );

    if (!expandedRows.includes(id)) {
      setRowBgColors((prevBgColors) => ({
        ...prevBgColors,
        [id]: openAccordionBgColor(transformStatus(status)),
      }));
    }
  };

  const toggleWebhook = (transactionId: string, webhookIndex: number) => {
    setWebhookExpanded((prev) => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [webhookIndex]: !prev[transactionId]?.[webhookIndex],
      },
    }));
  };

  const transformStatus = (status: string): string => {
    // console.log(status);
    const parts = status.split("_");

    if (parts.length > 1) {
      parts.shift();
    }
    const transformed = parts.join("_").toLowerCase();

    return transformed.charAt(0) + transformed.slice(1);
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

  useEffect(() => {
    setAllChecked(
      paginatedTransactions.every(
        (transaction) => checkedTransactions[transaction.id],
      ),
    );
  }, [checkedTransactions, paginatedTransactions]);

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

        {loading ? (
          <LoadingTransactionTableSkeleton />
        ) : paginatedTransactions.length === 0 ? (
          <thead>
            {" "}
            <tr className="bg-white">
              <td
                colSpan={columns.length + 1}
                className="py-4 text-center font-medium text-main"
              >
                No transactions available.
              </td>
            </tr>
          </thead>
        ) : (
          <tbody>
            {paginatedTransactions &&
              paginatedTransactions.map((transaction) => {
                const isExpanded = expandedRows.includes(transaction.id);
                const dynamicColor = rowBgColors[transaction.id];
                const expandedWebhooks =
                  webhookExpanded[transaction.txId] || {};

                return (
                  <React.Fragment key={transaction.id}>
                    <tr
                      className={`relative h-[50px] cursor-pointer border-b-[1px] border-b-hoverBg transition-all duration-300 last:border-none ${!isExpanded ? "bg-whiteBg hover:bg-hoverBg" : `bg-${dynamicColor}`}`}
                      onClick={() => toggleRow(transaction)}
                    >
                      <td className="pl-3">
                        <CustomCheckbox
                          isChecked={
                            checkedTransactions[transaction.id] || false
                          }
                          handleCheckboxChange={(event) =>
                            handleCheckboxChange(transaction.id, event)
                          }
                        />
                      </td>
                      <td className="pe-2 text-center">{transaction.id}</td>
                      <td className="pe-2">
                        <StatusBadge
                          name={transformStatus(transaction.status)}
                          type={transformStatus(transaction.status)}
                        />
                      </td>
                      <td className="pe-8 font-semibold">
                        {transaction.amount}
                      </td>
                      <td className="pe-2">{`${transaction.initialRequest.firstName} ${transaction.initialRequest.lastName}`}</td>
                      <td className="pe-2">
                        {transaction.initialRequest.email}
                      </td>
                      <td className="pe-2">{transaction.merchant.name}</td>
                      <td className="pe-2">{transaction.provider.name}</td>
                      <td className="pe-2">
                        <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                          <span>
                            {formatDateTime(transaction.createdAt).date}
                          </span>{" "}
                          <span>
                            {formatDateTime(transaction.createdAt).time}
                          </span>
                        </span>
                      </td>
                      <td className="pe-2">
                        <span className="flex flex-wrap items-center justify-center gap-x-1 rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                          <span>
                            {formatDateTime(transaction.updatedAt).date}
                          </span>{" "}
                          <span>
                            {formatDateTime(transaction.updatedAt).time}
                          </span>
                        </span>
                      </td>
                      <td className="">
                        {" "}
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
                          <div className="flex flex-col flex-wrap justify-between gap-6 md:flex-row">
                            <div className="flex w-5/12 min-w-[250px] flex-col gap-1 text-main">
                              <div className="relative mb-4 flex flex-row gap-2 py-1 text-[18px]">
                                <div className="flex flex-col gap-3 xl:flex-row">
                                  {" "}
                                  <span className="me-2 inline-block font-medium">
                                    Transactions Details
                                  </span>{" "}
                                  <p className="inline-block">
                                    ID {transaction.txId}
                                  </p>
                                </div>

                                <div
                                  className="flex cursor-pointer items-center p-1 opacity-35 transition-opacity duration-300 hover:opacity-100"
                                  onClick={() => {
                                    handleCopyToClipboard(
                                      transaction.txId.toString(),
                                    );
                                  }}
                                >
                                  <Image
                                    src="/icons/copy.svg"
                                    width={16}
                                    height={16}
                                    alt="Copy"
                                    className={`h-4 w-4`}
                                  />
                                </div>

                                {copiedOrderID ===
                                  transaction.txId.toString() && (
                                  <span className="absolute left-auto right-5 top-2 w-fit bg-successBg p-1 text-[12px] font-medium text-success xl:left-0 xl:top-6">
                                    Copyed
                                  </span>
                                )}
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Created:</span>{" "}
                                  <span>
                                    {formatDateTime(transaction.createdAt).date}
                                  </span>{" "}
                                  <span>
                                    {formatDateTime(transaction.createdAt).time}
                                  </span>
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Updated:</span>{" "}
                                  <span>
                                    {formatDateTime(transaction.updatedAt).date}
                                  </span>{" "}
                                  <span>
                                    {formatDateTime(transaction.updatedAt).time}
                                  </span>
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Order ID:</span>{" "}
                                  {transaction.id}
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Amount:</span>{" "}
                                  {transaction.amount} €
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Status:</span>{" "}
                                  {transaction.status}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Result:</span>
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">
                                    Decline Reason:
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">
                                    Webhook URL:
                                  </span>{" "}
                                  {transaction.webhookUrl}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">
                                    Merchant ID:
                                  </span>{" "}
                                  {transaction.initialRequest.merchantId}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">
                                    Return URL:
                                  </span>{" "}
                                  {transaction.returnUrl}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">
                                    External Transaction ID:
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="w-3/12 min-w-[250px]">
                              <h3 className="mb-4 py-1 text-[18px] font-medium">
                                Webhook
                              </h3>
                              <div className="webhook_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
                                {[
                                  "PAYMENT_CREATED",
                                  "PAYMENT_DISPUTED",
                                  "PAYMENT_CANCELLED",
                                ].map((webhookName, index) => (
                                  <Collapsible
                                    key={index}
                                    open={expandedWebhooks[index] || false}
                                    onOpenChange={() =>
                                      toggleWebhook(transaction.txId, index)
                                    }
                                    className="w-full space-y-2"
                                  >
                                    <CollapsibleTrigger
                                      asChild
                                      className="relative cursor-pointer uppercase"
                                    >
                                      <div className="">
                                        {" "}
                                        <h4 className="text-sm font-semibold">
                                          {webhookName}
                                        </h4>
                                        <ChevronDown
                                          className={`${
                                            expandedWebhooks[index]
                                              ? "rotate-180"
                                              : ""
                                          } absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
                                        />
                                      </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="space-y-2">
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Created:
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Retries:
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Last updated:
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Status:
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Code description:
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Compound state::
                                          </span>{" "}
                                        </p>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                ))}
                              </div>
                            </div>

                            <div className="w-3/12 min-w-[150px]">
                              <h3 className="mb-4 py-1 text-[18px] font-medium">
                                Log
                              </h3>
                              <div className="log_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
                                <LogHistory
                                  color={dynamicColor}
                                  status={transformStatus(transaction.status)}
                                  date={
                                    formatDateTime(transaction.updatedAt).date
                                  }
                                  time={
                                    formatDateTime(transaction.updatedAt).time
                                  }
                                />

                                <LogHistory
                                  color={"errorBg"}
                                  status={"failed"}
                                  date={
                                    formatDateTime(transaction.updatedAt).date
                                  }
                                  time={
                                    formatDateTime(transaction.updatedAt).time
                                  }
                                />

                                <LogHistory
                                  color={"warningBg"}
                                  status={"warning"}
                                  date={
                                    formatDateTime(transaction.updatedAt).date
                                  }
                                  time={
                                    formatDateTime(transaction.updatedAt).time
                                  }
                                />

                                <LogHistory
                                  color={"successBg"}
                                  status={"success"}
                                  date={
                                    formatDateTime(transaction.updatedAt).date
                                  }
                                  time={
                                    formatDateTime(transaction.updatedAt).time
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-row gap-4">
                            <DashButton
                              name={"Verify Transaction Status"}
                              type={"filled"}
                            />
                            <DashButton name={"Refund"} type={"empty"} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default CustomTransactionTable;
