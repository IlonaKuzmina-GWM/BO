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
          rx={5}
          ry={5}
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
        x={x}
        y={y}
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
          top: 0,
          right: 20,
          bottom: 20,
          left: 0,
        }}
      >
        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.6} />
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <Tooltip />
        <XAxis type="number" />
        <YAxis
          dataKey="provider"
          type="category"
          className="text-[16px]"
          tickLine={false}
          width={130}
        />

        <Bar
          dataKey="success"
          stackId="a"
          fill="#0052CE"
          name="Success"
          background={{ fill: "rgba(230, 238, 250, 0.6)" }}
          radius={[0, 5, 5, 0]}
          label={<CustomizedLabel />}
        />
        <Bar
          dataKey="declined"
          stackId="a"
          fill="#8C8AFE"
          name="Declined"
          background={{ fill: "rgba(230, 238, 250, 0.6)" }}
          radius={[0, 5, 5, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;
