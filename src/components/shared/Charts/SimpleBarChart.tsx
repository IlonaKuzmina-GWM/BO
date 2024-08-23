import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const formatXAxis = (tickItem: Date) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};

interface ISimpleBarChart {
  data: {
    date: string;
    successCount: number;
    failedCount: number;
    acceptedAmount?: number;
    successAmount?: number;
  }[];
}

const SimpleBarChart = ({ data }: ISimpleBarChart) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
      >
        <Legend align="left" verticalAlign="top" />
        <CartesianGrid  />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          className="text-[10px] leading-5 text-secondary"
        />
        <YAxis
            dataKey="successCount" 
           domain={[0, 'dataMax + 1']} 
          className="text-[10px] leading-5 text-secondary"
        />
        <Tooltip />

        <Bar dataKey="successCount" fill="#0052CE" name="Payment Success" className="rounded-sm"/>
        <Bar dataKey="failedCount" fill="#8C8AFE" name="Payment Failed" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
