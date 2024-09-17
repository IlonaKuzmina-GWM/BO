import { Header } from "@/types";
import { ReactNode } from "react";

interface ICustomTableProps<T> {
  columns: Header[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
}

const CustomTable = <T,>({
  columns,
  data,
  renderRow,
}: ICustomTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-y border-hoverBg text-left text-sm leading-[18px] text-main">
        <thead className="h-[50px] bg-hoverBg font-semibold">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key}
                className={`${
                  index === 0 ? "pl-3 lg:pl-8" : ""
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
          {data.map((item, index) => (
            <tr
              className="h-[50px] border-b border-hoverBg last:border-none"
              key={index}
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
