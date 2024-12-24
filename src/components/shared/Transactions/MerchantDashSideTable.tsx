
import LoadingDashSideTableSkeleton from "../LoadingUISkeletons/LoadingDashSideTableSkeleton";
import {  MerchantStat } from "@/types/statistics";

type IDashSideTableProps = {
  title: string;
  name: string;
  amount: string;
  data: MerchantStat[];
  loading: boolean;
}

const MerchantDashSideTable = ({
  title,
  name,
  amount,
  data,
  loading,
}: IDashSideTableProps) => {
  return (
    <div className="rounded-[4px] h-fit min-w-[300px] bg-white p-[20px]">
      <h3 className="p-[8px] pb-[16px] text-[20px] font-medium text-main">
        {title}
      </h3>
      {loading ? (
        <LoadingDashSideTableSkeleton />
      ) : data.length !== 0 ? (
        <>
          <div className="mb-[8px] flex justify-between border-b border-divider p-[8px] text-[12px] text-secondary">
            <span>{name}</span>
            <span>{amount}</span>
          </div>
          <div className="max-h-[350px] overflow-y-auto dash_select-options">
            {data.sort((a,b) => b.totalAmount - a.totalAmount).map((item) => (
              <div
                key={item.merchantName}
                className="flex justify-between p-[8px] text-main"
              >
                <div>{item.merchantName}</div>
                <div className="ml-[10px]">{item.totalAmount.toFixed(2)}</div>
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

export default MerchantDashSideTable;
