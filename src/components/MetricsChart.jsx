import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MetricsChart({
  throughput = [],
}) {
  const data = throughput.map(
    (jobs, index) => ({
      second: index + 1,
      jobs,
    })
  );

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4">
        Throughput (Last 60 Seconds)
      </h3>

      <div className="h-72 w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="second"
              label={{
                value: "Seconds",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              allowDecimals={false}
              label={{
                value: "Jobs",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="jobs"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}