import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatXAxis = (tickItem: Date) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};

const LinearChart = ({ data }: any) => {
  return (
    <ResponsiveContainer width="100%" height={407}>
      <LineChart data={data}>
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          className="text-[10px] leading-5 text-secondary"
        />
        <YAxis />
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
