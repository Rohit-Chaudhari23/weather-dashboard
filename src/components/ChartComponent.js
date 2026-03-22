import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
  ResponsiveContainer
} from "recharts";

function ChartComponent({ data, dataKey }) {
  return (
    <div className="chartBox">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            dot={false}
          />

          {/* ✅ FIXED */}
          <Brush dataKey="time" height={30} travellerWidth={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;