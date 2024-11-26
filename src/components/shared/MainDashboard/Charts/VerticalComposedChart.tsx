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

interface IVerticalComposedChart {
  data: {
    provider: string;
    success: number;
    declined: number;
    successPercentage: number;
  }[];
}

const VerticalComposedChart = ({ data }: IVerticalComposedChart) => {
console.log("data in chart",data)

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
        <CartesianGrid strokeDasharray="1 0" fillOpacity={0.6}/>
        <Legend align="left" verticalAlign="top" />
        <Tooltip />
        <XAxis type="number" />
        <YAxis
          dataKey="provider"
          type="category"
          scale="band"
          className="text-xs"
        />

        <Bar dataKey="success" stackId="a" fill="#0052CE" name="Payment Success" />
        <Bar dataKey="declined" stackId="a" fill="#8C8AFE" name="Payment Failed" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VerticalComposedChart;
