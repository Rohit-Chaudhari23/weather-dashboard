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
  const isMobile = window.innerWidth <= 480;

  return (
    <div className="chartBox">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            angle={-30}
            textAnchor="end"
            interval={2}
          />

          <YAxis tick={{ fontSize: 10 }} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />

          {!isMobile && (
            <Brush
              dataKey="time"
              height={25}
              travellerWidth={8}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartComponent;