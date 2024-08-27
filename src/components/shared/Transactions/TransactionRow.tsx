"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/Accordion";

import React, { useState } from "react";
import Image from "next/image";
import { Transaction } from "@/types";
import StatusBadge from "../StatusBadge";
import Checkbox from "../Checkbox";

interface ITransactionRow {
  transaction: Transaction;
}

const TransactionRow = ({ transaction }: ITransactionRow) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const transformStatus = (status: string): string => {
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

  const openAccordionBgColor = (status: string) => {
    switch (status) {
      case "success":
        return "successBg";
      case "failed":
        return "errorBg";
      case "transferring":
        return "warningBg";
      default:
        return "hoverBg";
    }
  };

  const status = transformStatus(transaction.status);

  return (
    <div className="flex flex-row">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value={`item-${transaction.id}`}
          className="relative border-none bg-white"
        >
          <div className="absolute top-[22px] z-10 flex max-w-10 items-center justify-center px-4">
            <Checkbox
              className="h-4 w-4 rounded-sm border-divider bg-white"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
          <AccordionTrigger
            onClick={() => {
              console.log(
                `Status: ${status}, Background Color: ${openAccordionBgColor(status)}`,
              );
            }}
            className={`relative flex w-full flex-row gap-4 py-[10px] text-start text-sm text-main [&[data-state=open]]:bg-${openAccordionBgColor(status)}`}
          >
            <div className="w-1/12"></div>
            <div className="w-1/12">{transaction.id}</div>
            <div className="w-1/12">
              <StatusBadge
                name={status}
                type={status}
              />
            </div>
            <div className="w-1/12 font-semibold">{transaction.amount}</div>
            <div className="w-1/12">
              {transaction.initialRequest.firstName}{" "}
              {transaction.initialRequest.lastName}
            </div>
            <div className="w-2/12">{transaction.initialRequest.email}</div>
            <div className="w-1/12">{transaction.merchant.name}</div>
            <div className="w-1/12">{transaction.provider.name}</div>
            <div className="flex w-1/12 flex-wrap items-center justify-center text-center">
              <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center">
                <span>{formatDateTime(transaction.createdAt).date}</span>{" "}
                <span>{formatDateTime(transaction.createdAt).time}</span>
              </span>
            </div>
            <div className="flex w-1/12 items-center justify-center text-center">
              <span className="flex flex-wrap items-center justify-center rounded-sm bg-hoverBg px-2 py-1 text-center">
                <span>{formatDateTime(transaction.updatedAt).date}</span>{" "}
                <span>{formatDateTime(transaction.updatedAt).time}</span>
              </span>
            </div>

            <div className="w-1/12"></div>
          </AccordionTrigger>
          <div className="absolute right-0 top-5 flex items-center justify-center">
            <Image
              src={"/icons/setl.svg"}
              alt={"Setl icon"}
              height={16}
              width={60}
            />
          </div>
          <AccordionContent className="bg-white p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Transaction Details</h3>
                <ul className="space-y-1">
                  <li>Status: {transaction.status}</li>
                  <li>Amount: {transaction.amount}€</li>
                  <li>Provider: {transaction.provider.name}</li>
                  <li>Merchant: {transaction.merchant.name}</li>
                  <li>Email: {transaction.initialRequest.email}</li>
                  <li>
                    Created: {new Date(transaction.createdAt).toLocaleString()}
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
                    Webhook URL: {transaction.webhookUrl ?? "Not provided"}
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
                  <li>Merchant ID: {transaction.initialRequest.merchantId}</li>
                  <li>Return URL: {transaction.returnUrl ?? "Not provided"}</li>
                  <li>Payment State: {transaction.rawStatus}</li>
                  <li>Payment Status: {transaction.status}</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TransactionRow;
