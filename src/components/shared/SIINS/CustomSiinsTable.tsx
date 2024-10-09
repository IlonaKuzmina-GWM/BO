"use client";
import { Header, Siin } from "@/types";
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

interface ICustomSiinsTransactionTableProps {
  columns: Header[];
  data: Siin[];
}

const CustomSiinsTable = ({
  columns,
  data,
}: ICustomSiinsTransactionTableProps) => {
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});
  const [checkedTransactions, setCheckedTransactions] = useState<{
    [key: number]: boolean;
  }>({});
  const [allChecked, setAllChecked] = useState(false);

  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [webhookExpanded, setWebhookExpanded] = useState<{
    [key: number]: boolean;
  }>({});

  // const openAccordionBgColor = (status: string) => {
  //   console.log(status);
  //   switch (status) {
  //     case "success":
  //       return "successBg";
  //     case "failed":
  //       return "errorBg";
  //     case "transferring":
  //       return "warningBg";
  //     default:
  //       return "white";
  //   }
  // };

  const toggleRow = (siinTransaction: Siin) => {
    const { id } = siinTransaction;

    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );
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
          <LoadingSiinTableSkeleton />
        ) : data.length === 0 ? (
          <thead>
            {" "}
            <tr className="bg-white">
              <td
                colSpan={columns.length + 1}
                className="py-4 text-center font-medium text-main"
              >
                No siins available.
              </td>
            </tr>
          </thead>
        ) : (
          <tbody>
            {data.map((siin) => {
              const transactionsTableHeader =
                Object.keys(siin.transaction).length > 0 ? true : false;
              const isExpanded =
                expandedRows.includes(siin.id) && transactionsTableHeader;

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
                      {
                        transactionsTableHeader ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="h-full w-full">
                                <span className="absolute right-2/3 top-1/2 h-1 w-1 rounded-full bg-slate-600" />
                                {siin.id}
                              </TooltipTrigger>
                              <TooltipContent className="ms-2">
                                <p> SIIN contain transaction</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          siin.id
                        )
                      }
                    </td>

                    <td className="pe-8">{siin.senderIban}</td>
                    <td className="pe-2">{`${siin.senderName}`}</td>
                    <td className="pe-2">{siin.senderBankCountry}</td>
                    <td className="pe-2">{siin.referenceCode}</td>
                    <td className="pe-2 font-semibold">€ {siin.amount}</td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4 gap-[4px]">
                        <span>{formatDateTime(siin.createdAt).date}</span>{" "}
                        <span>{formatDateTime(siin.createdAt).time}</span>
                      </span>
                    </td>
                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4 gap-[4px]">
                        <span>{formatDateTime(siin.updatedAt).date}</span>{" "}
                        <span>{formatDateTime(siin.updatedAt).time}</span>
                      </span>
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
                                <p>ID {siin.transaction.txId}</p>
                              </div>

                              <div
                                className="cursor-pointer p-1 opacity-35 transition-opacity duration-300 hover:opacity-100"
                                onClick={() => {
                                  handleCopyToClipboard(
                                    siin.transaction.txId.toString(),
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
                                  {
                                    formatDateTime(siin.transaction.createdAt)
                                      .date
                                  }
                                </span>{" "}
                                <span>
                                  {
                                    formatDateTime(siin.transaction.createdAt)
                                      .time
                                  }
                                </span>
                              </p>
                            </div>

                            <div>
                              <p>
                                <span className="font-medium">Updated:</span>{" "}
                                <span>
                                  {
                                    formatDateTime(siin.transaction.updatedAt)
                                      .date
                                  }
                                </span>{" "}
                                <span>
                                  {
                                    formatDateTime(siin.transaction.updatedAt)
                                      .time
                                  }
                                </span>
                              </p>
                            </div>

                            <div>
                              <p>
                                <span className="font-medium">Order ID:</span>{" "}
                                {siin.transaction.id}
                              </p>
                            </div>

                            <div>
                              <p>
                                <span className="font-medium">Amount:</span>{" "}
                                {siin.transaction.amount} €
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Status:</span>{" "}
                                {siin.transaction.status}
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
                                {siin.transaction.webhookUrl}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">
                                  Merchant ID:
                                </span>{" "}
                                {siin.transaction.initialRequest.merchantId}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">Return URL:</span>{" "}
                                {siin.transaction.returnUrl}
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
        )}
      </table>
    </div>
  );
};

export default CustomSiinsTable;
