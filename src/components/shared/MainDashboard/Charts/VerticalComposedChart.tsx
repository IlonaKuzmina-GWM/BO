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
  const CustomizedLabel = (props: any) => {
    const { x, y, width, payload } = props;
    const successPercentage = payload?.successPercentage;
  
    // Log the payload for debugging
    console.log("CustomizedLabel payload:", payload);
  
    return (
      <text
        x={x + width + 5} // Adjust position slightly to the right of the bar
        y={y + 10} // Center vertically with the bar
        dy={-4}
        fill="var(--main)"
        fontSize={10}
        textAnchor="start"
      >
        { `${successPercentage}%`}
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
        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.5} />
        <Legend content={<CustomLegend />} align="left" verticalAlign="top" />
        <Tooltip />
        <XAxis type="number" tick={{ fill: "var(--main)" }} />
        <YAxis
          dataKey="provider"
          type="category"
          className="text-[16px]"
          tick={{ fill: "var(--main)" }}
          tickLine={false}
          width={130}
        />

        <Bar
          dataKey="success"
          stackId="a"
          fill="var(--bar-1)"
          name="Success"
          background={{ fill: "var(--chart-bg)" }}
          radius={[0, 5, 5, 0]}
          label={<CustomizedLabel />}
        />
        <Bar
          dataKey="declined"
          stackId="a"
          fill="var(--bar-2)"
          name="Declined"
          background={{ fill: "var(--chart-bg)" }}
          radius={[0, 5, 5, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;
