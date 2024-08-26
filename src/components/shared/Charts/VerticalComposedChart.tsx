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
  ComposedChart,
} from "recharts";

const formatXAxis = (tickItem: Date) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
};

interface IVerticalComposedChart {
  data: {
    merchant: string;
    successCount: number;
    failedCount: number;
  }[];
}

const VerticalComposedChart = ({ data }: IVerticalComposedChart) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 70,
        }}
      >
        <Legend align="left" verticalAlign="top" />
        <XAxis type="number" />
        <YAxis
          dataKey="merchant"
          type="category"
          scale="band"
          className="text-5"
        />
        <Tooltip />
        <Bar
          dataKey="successCount"
          fill="#0052CE"
          stackId="a"
          name="Payment Success"
        />
        <Bar
          dataKey="failedCount"
          fill="#8C8AFE"
          stackId="a"
          name="Payment Failed"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;
