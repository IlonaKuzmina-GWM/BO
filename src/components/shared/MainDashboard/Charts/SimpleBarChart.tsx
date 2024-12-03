import { formatXAxis } from "@/helpers/formatXAxis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ISimpleBarChart {
  data: {
    date: string;
    success: number;
    declined: number;
  }[];
}

const SimpleBarChart = ({ data }: ISimpleBarChart) => {
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
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.5} />

        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          tick={{ fill: "var(--secondary)" }}
          className="text-[10px]"
          height={30}
        />
        <YAxis
          dataKey="success"
          domain={[
            0,
            (dataMax: number) =>
              Math.max(...data.map((d) => Math.max(d.success, d.declined))) * 1.1,
          ]}
          tick={{ fill: "var(--secondary)" }}
          className="text-[10px]"
          width={30}
        />
        <Tooltip />

        <Bar
          dataKey="success"
          fill="var(--bar-1)"
          name="Success"
          className="rounded-sm"
          radius={[5, 5, 0, 0]}
        />

        <Bar
          dataKey="declined"
          fill="var(--bar-2)"
          name="Declined"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
