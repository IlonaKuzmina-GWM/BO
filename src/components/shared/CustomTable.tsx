import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { Header } from "@/types";
import { ReactNode } from "react";

interface ICustomTableProps<T> {
  columns: Header[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  dataName: string;
  onCheckboxChange?: () => void;
  checkAll?: boolean;

  loading?: boolean;
  loadingSkeleton?: ReactNode;
}

const CustomTable = <T,>({
  columns,
  data,
  renderRow,
  dataName = "data",
  onCheckboxChange,
  checkAll = false,
  loading,
  loadingSkeleton,
}: ICustomTableProps<T>) => {
  return (
    <div className="">
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
                {col.key === "checkbox" && onCheckboxChange ? (
                  <CustomCheckbox
                    isChecked={checkAll}
                    handleCheckboxChange={onCheckboxChange}
                  />
                ) : (
                  col.title
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            loadingSkeleton
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr
                className="h-[50px] border-b border-hoverBg last:border-none"
                key={index}
              >
                {renderRow(item, index)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-4 text-center">
                No {dataName} available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
