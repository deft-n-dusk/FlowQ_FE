import useWebSocket from "../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";
import QueueStats from "../components/QueueStats";
import JobCreator from "../components/JobCreator";
import JobTable from "../components/JobTable";
import WorkerHealth from "../components/WorkerHealth";
import MetricsChart from "../components/MetricsChart";

export default function Dashboard() {
    const metrics = useWebSocket();
    const navigate = useNavigate();

    if (!metrics) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-medium animate-pulse">
                    Connecting to FlowQ Servers...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold">⚡ FlowQ Dashboard</h1>

                    <button
                        onClick={() => navigate('/dlq')}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        View Dead Letter Queue (DLQ) 💀
                    </button>
                </div>

                <QueueStats queues={metrics.queues} />

                <MetricsChart throughput={metrics.throughput || []} />

                <div className="grid md:grid-cols-2 gap-4 mb-6 mt-4">
                    <div className="bg-slate-800 rounded-xl p-5 shadow">
                        <p className="text-slate-400 mb-2">Total Processed</p>
                        <h2 className="text-3xl font-bold text-green-400">
                            {metrics.totals.processed}
                        </h2>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-5 shadow">
                        <p className="text-slate-400 mb-2">Total Failed</p>
                        <h2 className="text-3xl font-bold text-red-400">
                            {metrics.totals.failed}
                        </h2>
                    </div>
                </div>

                <JobCreator />

                <WorkerHealth />

                <JobTable />
            </div>
        </div>
    );
}