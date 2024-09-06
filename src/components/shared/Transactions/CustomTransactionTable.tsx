import { Header, Transaction } from "@/types";
import { useState } from "react";
import StatusBadge from "../StatusBadge";
import Checkbox from "../Checkbox";
import Image from "next/image";
import React from "react";

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
        <thead className="h-[50px] bg-hoverBg font-semibold">
          <tr>
            <th className="w-[5%] pl-3 lg:pl-3">
              {" "}
              <Checkbox checked={false} onChange={() => {}} />
            </th>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`${
                  index === 1 ? "pl-3 lg:pl-8" : ""
                } ${index === columns.length - 1 ? "pr-3 lg:pr-8" : ""} ${
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
                  } h-[50px] cursor-pointer border-b border-hoverBg last:border-none`}
                  onClick={() => toggleRow(transaction)}
                >
                  <td className="pl-3">
                    <Checkbox checked={false} onChange={() => {}} />
                  </td>
                  <td className="">{transaction.id}</td>
                  <td>
                    <StatusBadge
                      name={transformStatus(transaction.status)}
                      type={transformStatus(transaction.status)}
                    />
                  </td>
                  <td>{transaction.amount}</td>
                  <td>{`${transaction.initialRequest.firstName} ${transaction.initialRequest.lastName}`}</td>
                  <td>{transaction.initialRequest.email}</td>
                  <td>{transaction.merchant.name}</td>
                  <td>{transaction.provider.name}</td>
                  <td>
                    <span>{formatDateTime(transaction.createdAt).date}</span>{" "}
                    <span>{formatDateTime(transaction.createdAt).time}</span>
                  </td>
                  <td>
                    <span>{formatDateTime(transaction.updatedAt).date}</span>{" "}
                    <span>{formatDateTime(transaction.updatedAt).time}</span>
                  </td>
                  <td>
                    {" "}
                    <Image
                      src={"/icons/setl.svg"}
                      alt={"Setl icon"}
                      height={16}
                      width={60}
                    />
                  </td>
                </tr>

                {isExpanded && (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className={`border-b-[3px] border-b-${rowBgColors} p-6`}
                    >
                      <div className="felx-col flex justify-between gap-4">
                        <div className="">
                          <div className="flex flex-row">
                            <h3>Transactions Details</h3>{" "}
                            <p>ID {transaction.id}</p>
                          </div>
                          <div>
                            <p>
                              <span>Created:</span>{" "}
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
                              <span>Updated:</span>{" "}
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
                              <span>Amount:</span> {transaction.amount}€
                            </p>
                          </div>

                          <div>
                            <p>
                              <span>Order ID::</span> {transaction.txId}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3>Webhook</h3>
                        </div>
                        <div>
                          <h3>Log</h3>
                        </div>

                        {/* <div>
                          <h3 className="font-semibold">Transaction Details</h3>
                          <ul className="space-y-1">
                            <li>Status: {transaction.status}</li>
                            <li>Amount: {transaction.amount}€</li>
                            <li>Provider: {transaction.provider.name}</li>
                            <li>Merchant: {transaction.merchant.name}</li>
                            <li>Email: {transaction.initialRequest.email}</li>
                            <li>
                              Created:{" "}
                              {new Date(transaction.createdAt).toLocaleString()}
                            </li>
                            <li>
                              Last Updated:{" "}
                              {new Date(transaction.updatedAt).toLocaleString()}
                            </li>
                            <li>Order ID: {transaction.txReferenceId}</li>
                            <li>External Transaction ID: {transaction.txId}</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold">Webhook Details</h3>
                          <ul className="space-y-1">
                            <li>Action: SALE</li>
                            <li>Status: Payment_pending</li>
                            <li>Result: Success</li>
                            <li>
                              Webhook URL:{" "}
                              {transaction.webhookUrl ?? "Not provided"}
                            </li>
                            <li>Retries: {transaction.statusChecks}</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold">Error Details</h3>
                          <ul className="space-y-1">
                            <li>Status: ERROR</li>
                            <li>Code Description: [Error description here]</li>
                            <li>Decline Reason: Just Declined</li>
                            <li>Compound State: payment_in_review</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold">Additional Details</h3>
                          <ul className="space-y-1">
                            <li>
                              Merchant ID:{" "}
                              {transaction.initialRequest.merchantId}
                            </li>
                            <li>
                              Return URL:{" "}
                              {transaction.returnUrl ?? "Not provided"}
                            </li>
                            <li>Payment State: {transaction.rawStatus}</li>
                            <li>Payment Status: {transaction.status}</li>
                          </ul>
                        </div> */}
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
