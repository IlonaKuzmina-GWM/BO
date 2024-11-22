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
    vol: number;
    transaction: number;
  }[];
}

const formatXAxis = (tickItem: string) => {
  try {
    const date = new Date(tickItem);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch (error) {
    console.error("Invalid date:", tickItem);
    return "";
  }
};

// {
//   date: "2024-11-01T00:00:00.000Z",
//   vol: 23,
//   transaction: 122,
// },

const LinearChart = ({ data }: ILinearChart) => {
  console.log("data", data);
  return (
    <div style={{ width: "100%", height: "407px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            className="text-[10px] leading-5 text-secondary"
          />
          <YAxis
            yAxisId="left"
            className="text-[10px] leading-5 text-secondary"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            className="text-[10px] leading-5 text-secondary"
          />
          <Tooltip />
          <Legend align="left" verticalAlign="top" />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="vol"
            stroke="#007DC0"
            strokeDasharray="5 5"
            activeDot={{ r: 8 }}
            name="Success Amount ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="transaction"
            stroke="#FF6D4B"
            name="Accepted Amount ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LinearChart;
