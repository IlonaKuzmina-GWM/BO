import React from "react";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/UI/collapsible";
import { ChevronDown } from "lucide-react";
import { formatDateTime } from "@/utils/dateFormater";
import LogHistory from "../LogHistory";
import DashButton from "../DashButton";
import { STATUSES } from "@/constants/statuses";
import { ROLES } from "@/constants/roles";
import { getStatusColorClass } from "@/helpers/getColorByStatus";
import { Transaction } from "@/types/transaction";

interface ExpandedTransactionDetailsProps {
  transaction: Transaction;
  userRole: string | null;
  copiedOrderID: string | null;
  handleCopyToClipboard: (id: string) => void;
  handleSelectStatus: (type: string, value: string, txId: string) => void;
  expandedWebhooks: { [webhookId: number]: boolean };
  toggleWebhook: (webhookId: number) => void;
  getCurrency: (countryCode: string, provider: string) => string;
}

const ExpandedTransactionDetails: React.FC<ExpandedTransactionDetailsProps> = ({
  transaction,
  userRole,
  copiedOrderID,
  handleCopyToClipboard,
  handleSelectStatus,
  expandedWebhooks,
  toggleWebhook,
  getCurrency,
}) => (
  <div className="flex flex-col flex-wrap justify-between gap-6 md:flex-row">
    <div className="flex w-5/12 min-w-[250px] flex-col gap-1 text-main">
      <div className="relative mb-4 flex flex-row gap-2 py-1 text-[18px]">
        <div className="flex flex-col gap-3 xl:flex-row">
          <span className="me-2 inline-block font-medium">
            Transactions Details
          </span>
          <p className="inline-block">ID {transaction.txId}</p>
        </div>
        <div
          className="flex cursor-pointer items-center p-1 opacity-35 transition-opacity duration-300 hover:opacity-100"
          onClick={() => handleCopyToClipboard(transaction.txId.toString())}
        >
          <Image
            src="/icons/copy.svg"
            width={16}
            height={16}
            alt="Copy"
            className="h-auto w-full"
          />
        </div>
        {copiedOrderID === transaction.txId.toString() && (
          <span className="absolute left-auto right-5 top-2 w-fit bg-successBg p-1 text-[12px] font-medium text-success xl:left-0 xl:top-6">
            Copied
          </span>
        )}
      </div>

      <p>
        <span className="font-medium">Merchant ID:</span>{" "}
        {transaction.initialRequest.merchantId}
      </p>
      <p>
        <span className="font-medium">E-mail:</span>{" "}
        {transaction.initialRequest.email}
      </p>
      <p>
        <span className="font-medium">Order ID:</span> {transaction.id}
      </p>
      <p>
        <span className="font-medium">Status:</span>
        {[ROLES.ADMIN, ROLES.DEVELOPER].includes(userRole as ROLES) ? (
          <select
            className={`cursor-pointer bg-transparent text-${getStatusColorClass(transaction.status)}`}
            onChange={(e) => (
              handleSelectStatus('status', e.target.value, transaction.txId)
            )}
            value={transaction.status}
          >
            {Object.values(STATUSES).map((status) => (
              <option
                key={status}
                value={status}
                className={`text-${getStatusColorClass(status)}`}
              >
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span className={getStatusColorClass(transaction.status)}>
            {transaction.status}
          </span>
        )}
      </p>
      <p>
        <span className="font-medium">Amount:</span> {transaction.amount}
      </p>

      <p>
        <span className="font-medium">Currency:</span>{" "}
        {getCurrency(
          transaction?.initialRequest?.countryCode,
          transaction.provider?.name,
        )}
      </p>

      <p>
        <span className="font-medium">Country code:</span>{" "}
        {transaction.countryCode}
      </p>

      <p>
        <span className="font-medium">Webhook URL:</span>{" "}
        {transaction.webhookUrl}
      </p>

      <p>
        <span className="font-medium">Return URL:</span> {transaction.returnUrl}
      </p>

      <p>
        <span className="font-medium">Created:</span>{" "}
        <span>{formatDateTime(transaction.createdAt).date}</span>{" "}
        <span>{formatDateTime(transaction.createdAt).time}</span>
      </p>

      <p>
        <span className="font-medium">Updated:</span>{" "}
        <span>{formatDateTime(transaction.updatedAt).date}</span>{" "}
        <span>{formatDateTime(transaction.updatedAt).time}</span>
      </p>
    </div>

    <div className="w-3/12 min-w-[250px]">
      <h3 className="mb-4 py-1 text-[18px] font-medium">Webhook</h3>
      <div className="webhook_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
        {transaction.webhooks && transaction.webhooks.length > 0 ? (
          [...transaction.webhooks]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((webhook) => (
              <Collapsible
                key={webhook.id}
                open={expandedWebhooks[webhook.id] || false}
                onOpenChange={() => toggleWebhook(webhook.id)}
                className="w-full space-y-2"
              >
                <CollapsibleTrigger
                  asChild
                  className="relative cursor-pointer uppercase"
                >
                  <div className="">
                    <h4 className="text-sm font-semibold">{webhook.status}</h4>
                    <ChevronDown
                      className={`${
                        expandedWebhooks[webhook.id] ? "rotate-180" : ""
                      } absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2`}
                    />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-2">
                  <div>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      <span>{formatDateTime(webhook.createdAt).date}</span>{" "}
                      <span>{formatDateTime(webhook.createdAt).time}</span>
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
                      <span className="font-medium">Updated:</span>{" "}
                      <span>{formatDateTime(webhook.updatedAt).date}</span>{" "}
                      <span>{formatDateTime(webhook.updatedAt).time}</span>
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
                      <span className="font-medium">Code description:</span>{" "}
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
            ))
        ) : (
          <p>No webhooks available.</p>
        )}
      </div>
    </div>

    <div className="w-3/12 min-w-[150px]">
      <h3 className="mb-4 py-1 text-[18px] font-medium">Log</h3>
      <div className="log_wrapper flex h-[250px] flex-col gap-4 overflow-hidden overflow-y-auto pe-2">
        {transaction.webhooks && transaction.webhooks.length > 0 ? (
          [...transaction.webhooks]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((log) => (
              <div key={log.id}>
                <LogHistory
                  color={getStatusColorClass(log.status)}
                  status={log.status}
                  date={formatDateTime(log.createdAt).date}
                  time={formatDateTime(log.updatedAt).time}
                />
              </div>
            ))
        ) : (
          <p>No webhooks available.</p>
        )}
      </div>
    </div>

    <div className="mt-6 flex flex-row gap-4">
      {/* <DashButton name={"Verify Transaction Status"} type={"filled"} /> */}

      {transaction.status === STATUSES.PAYMENT_COMPLETE && (
        <DashButton
          name="Refund"
          type="empty"
          onClickHandler={() => handleSelectStatus('refunded', 'refund', transaction.txId)}
        />
      )}
    </div>
  </div>
);

export default ExpandedTransactionDetails;
