import { useState } from "react";
import { createJob } from "../api/api";

export default function JobCreator() {
  const getDefaultJob = () => ({
    id: crypto.randomUUID(), // UI list track karne ke liye
    type: "SEND_EMAIL",
    priority: "medium",
  });

  const [jobList, setJobList] = useState([getDefaultJob()]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", isError: false });

  const handleAddRow = () => {
    setJobList([...jobList, getDefaultJob()]);
  };

  const handleRemoveRow = (idToRemove) => {
    if (jobList.length === 1) return; 
    setJobList(jobList.filter((job) => job.id !== idToRemove));
  };

  const handleUpdateRow = (id, field, value) => {
    setJobList(
      jobList.map((job) => (job.id === id ? { ...job, [field]: value } : job))
    );
  };

  const handleFireAll = async () => {
    try {
      setLoading(true);
      
      const promises = jobList.map((job) =>
        createJob({
          type: job.type,
          priority: job.priority,
          idempotencyKey: crypto.randomUUID(), 
          payload: { timestamp: Date.now(), bulk_job: true },
        })
      );

      await Promise.all(promises);

      setModal({
        isOpen: true,
        message: `🔥 ${jobList.length} Jobs Fired Successfully!`,
        isError: false,
      });
      
      setJobList([getDefaultJob()]);
    } catch (err) {
      console.log(err);
      setModal({ isOpen: true, message: "Failed to create jobs", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 mb-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Bulk Job Creator</h2>
        <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
          Total: {jobList.length}
        </span>
      </div>

      <div className="space-y-3 mb-5">
        {jobList.map((job, index) => (
          <div key={job.id} className="flex flex-col md:flex-row gap-3 items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400 font-medium min-w-[24px]">
              {index + 1}.
            </span>
            
            <select
              value={job.type}
              onChange={(e) => handleUpdateRow(job.id, "type", e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg w-full md:w-auto flex-1 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>SEND_EMAIL</option>
              <option>GENERATE_PDF</option>
              <option>SEND_WEBHOOK</option>
              <option>PROCESS_PAYMENT</option>
            </select>

            <select
              value={job.priority}
              onChange={(e) => handleUpdateRow(job.id, "priority", e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg w-full md:w-auto flex-1 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>high</option>
              <option>medium</option>
              <option>low</option>
            </select>

            <button
              onClick={() => handleRemoveRow(job.id)}
              disabled={jobList.length === 1}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                jobList.length === 1
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300"
              }`}
              title="Remove row"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-slate-700 pt-5">
        <button
          onClick={handleAddRow}
          className="text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 px-5 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Another Job
        </button>

        <button
          onClick={handleFireAll}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-bold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Firing..." : `🚀 Fire ${jobList.length} Jobs`}
        </button>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className={`text-xl font-bold mb-2 ${modal.isError ? "text-red-500" : "text-green-500"}`}>
              {modal.isError ? "Error" : "Success"}
            </h3>
            <p className="text-slate-300 mb-6">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}