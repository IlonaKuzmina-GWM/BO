"use client";

import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { TooltipContent, TooltipTrigger } from "@/components/UI/tooltip";
import {
  getFailedColor,
  getProcessColor,
  getSuccessColor,
} from "@/helpers/getColorByStatus";
import { useStore } from "@/stores/StoreProvider";
import { Header } from "@/types";
import { formatDateTime } from "@/utils/dateFormater";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import LoadingSiinTableSkeleton from "../LoadingUISkeletons/LoadingSiinTableSkeleton";

import { useSiinsContext } from "@/context/SiinsContext";
import { Siin } from "@/types/siin";
import ExpandedTransactionDetails from "../Transactions/ExpandedTransactionDetails";

interface ICustomSiinsTransactionTableProps {
  columns: Header[];
  data: Siin[];
  isLoading?: boolean;
  handleStatusChange: (status: string, txId: string) => void;
}

const CustomSiinsTable = ({
  columns,
  data,
  isLoading,
  handleStatusChange,
}: ICustomSiinsTransactionTableProps) => {
  const { authStore, alertStore } = useStore();
  const userRole = authStore.role;
  const {
    toggleAllSiins,
    toggleSiin,
    resetCheckBoxSiins,
    checkedSiins,
    allSiinsChecked,
  } = useSiinsContext();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [rowBgColors, setRowBgColors] = useState<{ [key: number]: string }>({});

  const [copiedOrderID, setCopiedOrderID] = useState<string | null>(null);
  const [expandedWebhooks, setExpandedWebhooks] = useState<{
    [key: number]: boolean;
  }>({});

  const changeStatus = async (type: string, status: string, txId: string) => {
    let body: object;
    let route: string;

    if (type === "refund") {
      route = "/api/post-refund";
      body = {
        txId,
        isRefunded: true,
      };
    } else {
      route = "/api/post-transactions-status";
      body = {
        txId,
        status,
      };
    }

    try {
      const response = await fetch(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        handleStatusChange(status, txId);

        alertStore.setAlert("success", "Status changed successfully!");
      } else {
        alertStore.setAlert(
          "warning",
          "Status update failed for this transaction.",
        );
      }
    } catch (error) {
      alertStore.setAlert(
        "error",
        `Something went wrong with the updating process. ${error}`,
      );
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
    const ids = data.map((record) => record.id);
    toggleAllSiins(ids);
  };

  const handleCheckboxChange = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSiin(id);
  };

  useEffect(() => {
    return () => {
      resetCheckBoxSiins();
    };
  }, []);

  const handleCopyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedOrderID(id);
      setTimeout(() => {
        setCopiedOrderID(null);
      }, 1500);
      alertStore.setAlert("success", `Transaction ID copied successfully!`);
    } catch (err) {
      alertStore.setAlert("error", `Error copying to clipboard: ${err}`);
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
                isChecked={allSiinsChecked}
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
          {isLoading ? (
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

              return (
                <React.Fragment key={siin.id}>
                  <tr
                    className={`relative h-[50px] border-b-[1px] border-b-hoverBg bg-whiteBg transition-all duration-300 last:border-none ${transactionsTableHeader ? "cursor-pointer hover:bg-hoverBg" : ""}`}
                    onClick={() => toggleRow(siin)}
                  >
                    <td className="pl-3">
                      <CustomCheckbox
                        isChecked={checkedSiins.includes(siin.id) || false}
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
                          handleSelectStatus={changeStatus}
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
