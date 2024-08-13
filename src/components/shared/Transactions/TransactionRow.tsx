"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/Accordion";

import React, { useState } from "react";
import Image from "next/image";
import Checkbox from "@/components/UI/Checkbox";
import { Transaction } from "@/types";
import StatusBadge from "../StatusBadge";

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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`item-${transaction.id}`} className="border-none">
        <AccordionTrigger className="flex w-full flex-row gap-4 bg-white py-[10px] text-start text-sm text-main [&[data-state=open]]:bg-errorBg">
          <div className="flex max-w-10 items-center justify-center px-4">
            <Checkbox
              className="h-4 w-4 rounded-sm border-divider bg-white"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="w-1/12 text-center">
            {transaction.txId.slice(0, 4)}
          </div>
          <div className="w-1/12">
            <StatusBadge
              name={transformStatus(transaction.status)}
              type={transformStatus(transaction.status)}
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
          <div className="flex w-1/12 items-center justify-center text-center">
            <span className="rounded-sm bg-hoverBg px-2 py-1">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="w-1/12 text-center">
            <span className="rounded-sm bg-hoverBg px-2 py-1">
              {new Date(transaction.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="relative flex h-[16px] w-[60px] items-center justify-center">
            <Image src={"/icons/setl.svg"} alt={"Setl icon"} fill />
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-white">
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
                <li>Webhook URL: {transaction.webhookUrl ?? "Not provided"}</li>
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
  );
};

export default TransactionRow;
