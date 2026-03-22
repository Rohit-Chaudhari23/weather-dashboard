import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
  ResponsiveContainer,
  Legend
} from "recharts";

function ChartComponent({ data, dataKey }) {
  const isMobile = window.innerWidth <= 480;

  return (
    <div className="chartBox">
      <ResponsiveContainer width="100%" height={380}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 60 }} // 🔥 bottom space increase
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

          {/* 🔥 LEGEND FIX */}
          <Legend
            verticalAlign="bottom"
            align="center"
            height={36}
            wrapperStyle={{
              paddingTop: "15px",
              fontSize: "12px"
            }}
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