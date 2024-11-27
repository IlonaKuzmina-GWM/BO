import { PureComponent, useState } from "react";
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

interface IVerticalComposedChart {
  data: {
    provider: string;
    success: number;
    declined: number;
    successPercentage?: number;
  }[];
}

const VerticalComposedChart = ({ data }: IVerticalComposedChart) => {
  const [opacity, setOpacity] = useState<{ [key: string]: number }>({
    success: 1,
    declined: 1,
  });

  const handleMouseEnter = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 })); // Dim the corresponding bar
  };

  const handleMouseLeave = (o: any) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 })); // Reset opacity
  };

  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={10}
          ry={10}
          style={{ filter: "url(#drop-shadow)" }}
        />
      </g>
    );
  };

  const CustomizedLabel = (props: any) => {
    const { x, y, width, payload } = props;
    const successPercentage = payload?.successPercentage;

    return (
      <text
        x={x + width + 5}
        y={y + 10}
        dy={-4}
        fill="var(--main)"
        fontSize={10}
        textAnchor="middle"
      >
        {successPercentage !== undefined ? `${successPercentage}%` : ""}
      </text>
    );
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
            <span style={{ color: "#333", fontSize: "14px" }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <defs>
          <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="2"
              dy="0"
              stdDeviation="4"
              floodColor="rgba(0, 0, 0, 0.25)"
            />
          </filter>
        </defs>

        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.6} />
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <Tooltip />
        <XAxis type="number" />
        <YAxis
          dataKey="provider"
          type="category"
          className="text-[16px]"
        />

        <Bar
          dataKey="success"
          stackId="a"
          fill="#0052CE"
          name="Success"
          background={{ fill: "rgba(230, 238, 250, 0.6)" }}
          label={<CustomizedLabel />}
          shape={<CustomBar />}
        />
        <Bar
          dataKey="declined"
          stackId="a"
          fill="#8C8AFE"
          name="Declined"
          background={{ fill: "rgba(230, 238, 250, 0.6)" }}
          shape={<CustomBar />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;
