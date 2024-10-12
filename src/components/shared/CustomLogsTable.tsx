"use client";

import { Header } from "@/types";
import { useEffect, useState } from "react";
import React from "react";
import { formatDateTime } from "@/helpers/dateFormater";
import LoadingLogsTableSkeleton from "./LoadingUI/LoadingLogsTableSkeleton";
import { Log } from "@/types/logs";

interface ICustomSiinsTransactionTableProps {
  columns: Header[];
  data: Log[];
}

const CustomLogsTable = ({
  columns,
  data,
}: ICustomSiinsTransactionTableProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="">
      <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
        <thead className="h-[50px] bg-hoverBg font-semibold">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={` ${index === 0 ? "pl-3" : ""} ${
                  col.centered ? "text-center" : ""
                } pr-2 `}
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        {loading ? (
          <LoadingLogsTableSkeleton />
        ) : data.length === 0 ? (
          <thead>
            {" "}
            <tr className="bg-white">
              <td
                colSpan={columns.length + 1}
                className="py-4 text-center font-medium text-main"
              >
                No logs available.
              </td>
            </tr>
          </thead>
        ) : (
          <tbody>
            {data.map((log) => {
              return (
                <React.Fragment key={log.createdAt}>
                  <tr
                    className={`relative h-[50px] border-b-[1px] border-b-hoverBg bg-whiteBg transition-all duration-300 last:border-none`}
                  >
                    <td className="pl-3">{log.person}</td>
                    <td className="pe-2">{log.action}</td>

                    <td className="pe-2">
                      <span className="flex flex-wrap items-center justify-center gap-[4px] rounded-sm bg-hoverBg px-2 py-1 text-center text-[12px] leading-4">
                        <span>{formatDateTime(log.createdAt).date}</span>{" "}
                        <span>{formatDateTime(log.createdAt).time}</span>
                      </span>
                    </td>
                    <td className="pe-2 text-center">{log.type}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default CustomLogsTable;
