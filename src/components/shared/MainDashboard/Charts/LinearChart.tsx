import { formatXAxis } from "@/utils/formatXAxis";
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

const LinearChart = ({ data }: ILinearChart) => {
  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul
        style={{ display: "flex", listStyle: "none", padding: 0, margin: 20 }}
      >
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: 16,
              cursor: "pointer",
            }}
          >
            <svg width="10" height="10" style={{ marginRight: 5 }}>
              <circle cx="5" cy="5" r="5" fill={entry.color} />
              <circle cx="5" cy="5" r="2" fill={"var(--white)"} />
            </svg>
            <span style={{ color: "var(--secondary)", fontSize: "14px" }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={410}>
      <LineChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.5} />
        <Tooltip />

        <XAxis
          dataKey="date"
          tick={{ fill: "var(--secondary)" }}
          tickFormatter={formatXAxis}
          className="text-[10px]"
          height={30}
        />
        <YAxis
          tick={{ fill: "var(--secondary)" }}
          yAxisId="left"
          className="text-[10px]"
        />
        <YAxis
          tick={{ fill: "var(--secondary)" }}
          yAxisId="right"
          orientation="right"
          className="text-[10px]"
        />

        <Line
          yAxisId="left"
          dataKey="vol"
          stroke="#007DC0"
          strokeDasharray="5 5"
          activeDot={{ r: 8 }}
          name="Volume"
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          dataKey="transaction"
          stroke="#FF6D4B"
          name="Transactions"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LinearChart;
