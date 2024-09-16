import { DashTableData } from "@/types";

interface IDashSideTableProps {
  title: string;
  name: string;
  amount: string;
  data: DashTableData[];
}
const DashSideTable = ({ title, name, amount, data }: IDashSideTableProps) => {
  return (
    <div className="rounded-4px bg-white p-[20px]">
      <h3 className="p-[8px] pb-[16px] text-[20px] font-medium text-main">
        {title}
      </h3>
      {data.length !== 0 ? (
        <>
          <div className="mb-[8px] flex justify-between border-b border-divider p-[8px] text-[12px] text-secondary">
            <span>{name}</span>
            <span>{amount}</span>
          </div>
          <div>
            {data.map((item, index) => (
              <div
                key={index}
                className="flex justify-between p-[8px] text-main"
              >
                <div>{item.name}</div>
                <div className="ml-[10px]">
                  {item.amount}
                  {amount === "%" ? "%" : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          No Data For Selected Period
        </div>
      )}
    </div>
  );
};

export default DashSideTable;
