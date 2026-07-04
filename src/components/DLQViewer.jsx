import { useEffect, useState } from "react";
import { getDLQ, replayDLQJob, deleteDLQJob } from "../api/api";

export default function DLQViewer() {
  const [jobs, setJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null); 
  const [modal, setModal] = useState({ isOpen: false, job: null, action: null });

  const fetchDLQ = async () => {
    try {
      const res = await getDLQ();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchDLQ(); }, []);

  const confirmAction = async () => {
    const { job, action } = modal;
    setLoadingId(job.jobId);
    setModal({ isOpen: false, job: null, action: null });

    if (action === "replay") await replayDLQJob(job.jobId);
    if (action === "delete") await deleteDLQJob(job.jobId);

    setLoadingId(null);
    fetchDLQ();
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.jobId} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <h3 className="font-semibold text-lg mb-2">{job.type}</h3>
          <p className="text-red-400 mb-4 text-sm bg-red-900/20 p-2 rounded">{job.lastError}</p>

          <div className="flex gap-3">
            <button
              onClick={() => setModal({ isOpen: true, job, action: "replay" })}
              disabled={loadingId === job.jobId}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-all"
            >
              {loadingId === job.jobId ? "Replaying..." : "Replay"}
            </button>

            <button
              onClick={() => setModal({ isOpen: true, job, action: "delete" })}
              disabled={loadingId === job.jobId}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-all"
            >
              {loadingId === job.jobId ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 capitalize">Confirm {modal.action}?</h2>
            <p className="text-slate-400 mb-6">Are you sure you want to {modal.action} this job?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal({ ...modal, isOpen: false })} className="px-4 py-2 text-slate-300">Cancel</button>
              <button onClick={confirmAction} className="bg-blue-600 px-4 py-2 rounded-lg font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}