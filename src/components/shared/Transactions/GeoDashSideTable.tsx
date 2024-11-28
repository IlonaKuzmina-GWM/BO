import { DashTableData } from "@/types";
import LoadingDashSideTableSkeleton from "../LoadingUISkeletons/LoadingDashSideTableSkeleton";
import { GeoCountryStat, MerchantStat } from "@/types/statistics";

type IDashSideTableProps = {
  title: string;
  name: string;
  amount: string;
  data: GeoCountryStat[];
  loading: boolean;
};

const GeoDashSideTable = ({
  title,
  name,
  amount,
  data,
  loading,
}: IDashSideTableProps) => {
  return (
    <div className="rounded-4px h-fit min-w-[300px] bg-white p-[20px]">
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
          <div className="dash_select-options max-h-[500px] overflow-y-auto">
            {data
              .sort((a, b) => b.percentage - a.percentage)
              .map((item) => (
                <div
                  key={item.countryCode}
                  className="flex justify-between p-[8px] text-main"
                >
                  <div>{item.countryCode}</div>
                  <div className="ml-[10px]">{item.percentage}%</div>
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

export default GeoDashSideTable;
