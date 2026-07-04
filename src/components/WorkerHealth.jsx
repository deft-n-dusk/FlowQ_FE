import { useEffect, useState } from "react";
import { getWorkers } from "../api/api";

export default function WorkerHealth() {
  const [workers, setWorkers] = useState([]);

  const fetchWorkers = async () => {
    try {
      const res = await getWorkers();
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWorkers();

    const interval = setInterval(
      fetchWorkers,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Workers
      </h2>

      <div className="space-y-3">
        {workers.map((worker) => (
          <div
            key={worker.workerId}
            className="flex items-center justify-between bg-slate-700 rounded-lg p-3"
          >
            <span className="font-medium">
              {worker.workerId}
            </span>

            <span>
              {worker.isAlive
                ? "🟢 Alive"
                : "🔴 Dead"}
            </span>
          </div>
        ))}

        {workers.length === 0 && (
          <p className="text-slate-400">
            No workers found
          </p>
        )}
      </div>
    </div>
  );
}