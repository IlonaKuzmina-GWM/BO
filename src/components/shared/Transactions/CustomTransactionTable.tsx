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
import { STATUSES } from "@/constants/statuses";
import { useStore } from "@/stores/StoreProvider";
import { ROLES } from "@/constants/roles";

interface ICustomTransactionTableProps {
  columns: Header[];
  paginatedTransactions: Transaction[];
}

const CustomTransactionTable = ({
  columns,
  paginatedTransactions,
}: ICustomTransactionTableProps) => {
  const { authStore } = useStore();
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
    [transactionId: string]: {
      [webhookIndex: string]: boolean;
    };
  }>({});
  const [expandedDropdowns, setExpandedDropdowns] = useState(false);

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

        // console.log("Successfuly Updated Tx Status!", res.newStatus);
      } else {
        // console.log("New status not found for this transaction in the Bank");
      }
    } catch (error) {
      console.error(`Oops! Something went wrong: ${error}`);
    }
  };

  // const statuses = [
  //   {
  //     label: "PAYMENT_CREATED",
  //     key: 1,
  //   },
  //   {
  //     label: "PAYMENT_PROCESSING",
  //     key: 2,
  //   },
  //   {
  //     label: "PAYMENT_ACCEPTED",
  //     key: 3,
  //   },
  //   {
  //     label: "PAYMENT_SUCCESS",
  //     key: 4,
  //   },
  //   {
  //     label: "PAYMENT_TRANSFERRING",
  //     key: 5,
  //   },
  //   {
  //     label: "PAYMENT_DECLINED",
  //     key: 6,
  //   },
  //   {
  //     label: "PAYMENT_CANCELLED",
  //     key: 7,
  //   },
  //   {
  //     label: "PAYMENT_FAILED",
  //     key: 8,
  //   },
  //   {
  //     label: "TIMEOUT",
  //     key: 9,
  //   },
  //   {
  //     label: "AML_BLOCKED",
  //     key: 10,
  //   },
  //   {
  //     label: "PAYMENT_COMPLETE",
  //     key: 11,
  //   },
  // ];

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

        console.log("Successfuly!", res);
      } else {
        console.log("New status not found for this transaction in the Bank");
      }
    } catch (error) {
      console.error(`Oops! Something went wrong: ${error}`);
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

  // useEffect(() => {
  //   setAllChecked(
  //     paginatedTransactions.every(
  //       (transaction) => checkedTransactions[transaction.id],
  //     ),
  //   );
  // }, [checkedTransactions, paginatedTransactions]);

  useEffect(() => {}, [paginatedTransactions]);

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

        {loading ? (
          <LoadingTransactionTableSkeleton />
        ) : paginatedTransactions?.length === 0 ? (
          <thead>
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
                // console.log(transaction);

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
                      <td className="pe-2">
                        {getCurrency(
                          transaction?.initialRequest?.countryCode,
                          transaction.provider.name,
                        )}
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
                          <div className="flex flex-col flex-wrap justify-between gap-6 md:flex-row">
                            <div className="flex w-5/12 min-w-[250px] flex-col gap-1 text-main">
                              <div className="relative mb-4 flex flex-row gap-2 py-1 text-[18px]">
                                <div className="flex flex-col gap-3 xl:flex-row">
                                  <span className="me-2 inline-block font-medium">
                                    Transactions Details
                                  </span>
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
                                  <div className="h-4 w-4">
                                    <Image
                                      src="/icons/copy.svg"
                                      width={16}
                                      height={16}
                                      alt="Copy"
                                      className={`h-auto w-full`}
                                    />
                                  </div>
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
                                  <span className="font-medium">
                                    Merchant ID:
                                  </span>
                                  {transaction.initialRequest.merchantId}
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">E-mail:</span>
                                  {transaction.initialRequest.email}
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Order ID:</span>
                                  {transaction.id}
                                </p>
                              </div>

                              <div>
                                <span className="font-medium">Status:</span>
                                {userRole === ROLES.ADMIN ||
                                userRole === ROLES.DEVELOPER ? (
                                  <p
                                    className="relative inline-block"
                                    onClick={() => setExpandedDropdowns(true)}
                                  >
                                    <select
                                      className="cursor-pointer bg-transparent"
                                      onChange={(e) =>
                                        handleSelectStatus(
                                          e.target.value,
                                          transaction.txId,
                                        )
                                      }
                                      value={transaction.status}
                                    >
                                      <option
                                        value={transaction.status}
                                        className="cursor-pointer"
                                      >
                                        {transaction.status}
                                      </option>

                                      {Object.values(STATUSES)
                                        .filter(
                                          (status) =>
                                            status !== transaction.status,
                                        )
                                        .map((status) => (
                                          <option
                                            key={status}
                                            value={status}
                                            className="cursor-pointer"
                                          >
                                            {status}
                                          </option>
                                        ))}
                                    </select>
                                  </p>
                                ) : (
                                  <p>{transaction.status}</p>
                                )}
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Amount:</span>{" "}
                                  {transaction.amount}
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">Currency:</span>{" "}
                                  {getCurrency(
                                    transaction?.initialRequest?.countryCode,
                                    transaction.provider.name,
                                  )}
                                </p>
                              </div>

                              <div>
                                <p>
                                  <span className="font-medium">
                                    Country code:
                                  </span>{" "}
                                  {transaction.countryCode}
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
                                    Return URL:
                                  </span>{" "}
                                  {transaction.returnUrl}
                                </p>
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
                            </div>

                            <div className="w-3/12 min-w-[250px]">
                              <h3 className="mb-4 py-1 text-[18px] font-medium">
                                Webhook
                              </h3>
                              <div className="webhook_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
                                {transaction.webhooks.map((webhook) => (
                                  <Collapsible
                                    key={webhook.id}
                                    open={expandedWebhooks[webhook.id] || false}
                                    onOpenChange={() =>
                                      toggleWebhook(
                                        transaction.txId,
                                        webhook.id,
                                      )
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
                                          {webhook.status}
                                        </h4>
                                        <ChevronDown
                                          className={`${
                                            expandedWebhooks[webhook.id]
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
                                          <span>
                                            {
                                              formatDateTime(webhook.createdAt)
                                                .date
                                            }
                                          </span>{" "}
                                          <span>
                                            {
                                              formatDateTime(webhook.createdAt)
                                                .time
                                            }
                                          </span>
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Retries: {webhook.retries}
                                          </span>{" "}
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Updated:
                                          </span>{" "}
                                          <span>
                                            {
                                              formatDateTime(webhook.updatedAt)
                                                .date
                                            }
                                          </span>{" "}
                                          <span>
                                            {
                                              formatDateTime(webhook.updatedAt)
                                                .time
                                            }
                                          </span>
                                        </p>
                                      </div>
                                      <div>
                                        <p>
                                          <span className="font-medium">
                                            Status: {webhook.status}
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
                                            Compound state: {webhook.state}
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
                                {transaction.webhooks.map((log) => (
                                  <div key={log.id}>
                                    <LogHistory
                                      color={openAccordionBgColor(
                                        transformStatus(log.status),
                                      )}
                                      status={log.status}
                                      date={formatDateTime(log.createdAt).date}
                                      time={formatDateTime(log.updatedAt).time}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-row gap-4">
                            {/* <DashButton
                              name={"Verify Transaction Status"}
                              type={"filled"}
                            /> */}

                            {transaction.status ===
                              STATUSES.PAYMENT_COMPLETE && (
                              <DashButton
                                name={"Refund"}
                                type={"empty"}
                                onClickHandler={() =>
                                  refundTransaction(transaction.txId)
                                }
                              />
                            )}
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
