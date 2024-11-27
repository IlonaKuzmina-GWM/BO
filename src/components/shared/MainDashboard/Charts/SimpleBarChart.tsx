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
  const formatXAxis = (tickItem: Date) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

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
            <span style={{ color: "var(--main)", fontSize: "14px" }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          tick={{ fill: "var(--main)" }}
          className="text-[10px] leading-5 text-secondary"
        />
        <YAxis
          dataKey="success"
          domain={[0, "dataMax + 1"]}
          tick={{ fill: "var(--main)" }}
          className="text-[10px] leading-5 text-secondary"
        />
        <Tooltip />

        <Bar
          dataKey="success"
          fill="var(--bar-1)"
          name="Success"
          className="rounded-sm"
          radius={[5, 5, 0, 0]}
        />
        <Bar dataKey="declined" fill="var(--bar-2)" name="Declined"       radius={[5, 5, 0, 0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
