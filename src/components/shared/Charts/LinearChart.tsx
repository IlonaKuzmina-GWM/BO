import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Legend,
} from "recharts";

interface ILinearChart {
  data: {
    date: string;
    successCount?: number;
    failedCount?: number;
    acceptedAmount?: number;
    successAmount?: number;
  }[];
}

const formatXAxis = (tickItem: Date) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};

const LinearChart = ({ data }: ILinearChart) => {
  return (
    <ResponsiveContainer width="100%" height={407}>
      <LineChart data={data}>
        <Legend align="left" verticalAlign="top" />
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          className="text-[10px] leading-5 text-secondary"
        />
        <YAxis
          dataKey="totalAmount"
          className="text-[10px] leading-5 text-secondary"
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="acceptedAmount"
          stroke="#007DC0"
          strokeDasharray="5 5"
          name="Success Amount ($)"
        />
        <Line
          type="monotone"
          dataKey="successAmount"
          stroke="#FF6D4B"
          name="Accepted Amount ($)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LinearChart;
