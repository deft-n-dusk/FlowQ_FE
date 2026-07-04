export default function QueueStats({ queues }) {
  if (!queues) return null;

  const stats = [
    {
      label: "High",
      value: queues.high,
    },
    {
      label: "Medium",
      value: queues.medium,
    },
    {
      label: "Low",
      value: queues.low,
    },
    {
      label: "Delayed",
      value: queues.delayed,
    },
    {
      label: "DLQ",
      value: queues.dlq,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-slate-800 rounded-xl p-5 shadow"
        >
          <p className="text-slate-400 text-sm">
            {item.label}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}