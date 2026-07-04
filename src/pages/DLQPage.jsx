import { Link } from "react-router-dom";
import DLQViewer from "../components/DLQViewer";

export default function DLQPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">
            💀 Dead Letter Queue
          </h1>

          <Link
            to="/"
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
          >
            Dashboard
          </Link>
        </div>

        <DLQViewer />
      </div>
    </div>
  );
}