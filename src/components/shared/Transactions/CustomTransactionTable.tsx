"use client";
import { Header, Transaction } from "@/types";
import { useEffect, useState } from "react";
import StatusBadge from "../StatusBadge";
import Image from "next/image";
import React from "react";
import { Button } from "react-day-picker";
import DashButton from "../DashButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/collapsible";
import { ChevronDown } from "lucide-react";

interface ICustomTransactionTableProps {
  columns: Header[];
  data: Transaction[];
}

const CustomTransactionTable = ({
  columns,
  data,
}: ICustomTransactionTableProps) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});
  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [webhookExpanded, setWebhookExpanded] = useState<{
    [key: number]: boolean;
  }>({});

  const openAccordionBgColor = (status: string) => {
    console.log(status);
    switch (status) {
      case "success":
        return "successBg";
      case "failed":
        return "errorBg";
      case "transferring":
        return "warningBg";
      default:
        return "white";
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

  const toggleWebhook = (index: number) => {
    setWebhookExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const transformStatus = (status: string): string => {
    console.log(status);
    const parts = status.split("_");

    if (parts.length > 1) {
      parts.shift();
    }
    const transformed = parts.join("_").toLowerCase();

    return transformed.charAt(0) + transformed.slice(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

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
          {data.map((transaction) => {
            const isExpanded = expandedRows.includes(transaction.id);
            return (
              <React.Fragment key={transaction.id}>
                <tr
                  className={`relative border-none ${!isExpanded && "bg-white"} bg-${
                    isExpanded ? rowBgColors[transaction.id] : ""
                  } h-[50px] cursor-pointer border-b border-hoverBg transition-all duration-300 last:border-none hover:bg-hoverBg`}
                  onClick={() => toggleRow(transaction)}
                >
                  <td className="pe-2 text-center">{transaction.id}</td>
                  <td className="pe-2">
                    <StatusBadge
                      name={transformStatus(transaction.status)}
                      type={transformStatus(transaction.status)}
                    />
                  </td>
                  <td className="pe-8 font-semibold">{transaction.amount}</td>
                  <td className="pe-2">{`${transaction.initialRequest.firstName} ${transaction.initialRequest.lastName}`}</td>
                  <td className="pe-2">{transaction.initialRequest.email}</td>
                  <td className="pe-2">{transaction.merchant.name}</td>
                  <td className="pe-2">{transaction.provider.name}</td>
                  <td className="pe-2">
                    <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                      <span>{formatDateTime(transaction.createdAt).date}</span>{" "}
                      <span>{formatDateTime(transaction.createdAt).time}</span>
                    </span>
                  </td>
                  <td className="pe-2">
                    <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                      <span>{formatDateTime(transaction.updatedAt).date}</span>{" "}
                      <span>{formatDateTime(transaction.updatedAt).time}</span>
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
                      className={`border-b-[3px] border-b-${rowBgColors} p-6`}
                    >
                      <div className="flex flex-row gap-10">
                        <div className="flex w-6/12 flex-col gap-1 text-main">
                          <div className="relative mb-4 flex flex-row gap-2 py-1 text-[18px]">
                            <div className="flex flex-row">
                              {" "}
                              <span className="me-2 font-medium">
                                Transactions Details
                              </span>{" "}
                              <p>ID {transaction.txId}</p>
                            </div>

                            <div
                              className="cursor-pointer p-1 opacity-35 transition-opacity duration-300 hover:opacity-100"
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

                            {copiedOrderID && (
                              <span className="absolute right-[-70px] top-0 bg-successBg p-1 text-[12px] font-medium text-success">
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
                              <span className="font-medium">Webhook URL:</span>{" "}
                              {transaction.webhookUrl}
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">Merchant ID:</span>{" "}
                              {transaction.initialRequest.merchantId}
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">Return URL:</span>{" "}
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

                        <div className="w-3/12">
                          <h3 className="mb-4 py-1 text-[18px] font-medium">
                            Webhook
                          </h3>
                          <div className="webhook_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
                            <Collapsible
                              open={webhookExpanded[1] || false}
                              onOpenChange={() => {
                                toggleWebhook(1);
                              }}
                              className="w-full space-y-2"
                            >
                              <CollapsibleTrigger
                                asChild
                                className="relative cursor-pointer uppercase"
                              >
                                <div className="">
                                  {" "}
                                  <h4 className="text-sm font-semibold">
                                    PAYMENT_CREATED
                                  </h4>
                                  <ChevronDown
                                    className={`${webhookExpanded[1] ? "rotate-180" : ""} absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
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
                                    <span className="font-medium">Status:</span>{" "}
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
                            <Collapsible
                              open={webhookExpanded[2] || false}
                              onOpenChange={() => {
                                toggleWebhook(2);
                              }}
                              className="w-full space-y-2"
                            >
                              <CollapsibleTrigger
                                asChild
                                className="relative cursor-pointer"
                              >
                                <div className="">
                                  {" "}
                                  <h4 className="text-sm font-semibold uppercase">
                                    payment_disputed
                                  </h4>
                                  <ChevronDown
                                    className={`${webhookExpanded[2] ? "rotate-180" : ""} absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
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
                                    <span className="font-medium">Status:</span>{" "}
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
                            <Collapsible
                              open={webhookExpanded[3] || false}
                              onOpenChange={() => {
                                toggleWebhook(3);
                              }}
                              className="w-full space-y-2"
                            >
                              <CollapsibleTrigger
                                asChild
                                className="relative cursor-pointer"
                              >
                                <div className="">
                                  {" "}
                                  <h4 className="text-sm font-semibold uppercase">
                                    payment_cancelled
                                  </h4>
                                  <ChevronDown
                                    className={`${webhookExpanded[3] ? "rotate-180" : ""} absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
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
                                    <span className="font-medium">Status:</span>{" "}
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
                            <Collapsible
                              open={webhookExpanded[4] || false}
                              onOpenChange={() => {
                                toggleWebhook(4);
                              }}
                              className="w-full space-y-2"
                            >
                              <CollapsibleTrigger
                                asChild
                                className="relative cursor-pointer"
                              >
                                <div className="">
                                  {" "}
                                  <h4 className="text-sm font-semibold uppercase">
                                    Payment_PROCESSING
                                  </h4>
                                  <ChevronDown
                                    className={`${webhookExpanded[4] ? "rotate-180" : ""} absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
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
                                    <span className="font-medium">Status:</span>{" "}
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
                          </div>
                        </div>

                        <div className="w-3/12">
                          <h3>Log</h3>
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
      </table>
    </div>
  );
};

export default CustomTransactionTable;
