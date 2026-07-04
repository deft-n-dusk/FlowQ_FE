import { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../api/api";
import JobDetail from "./JobDetail";

export default function JobTable() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, jobId: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, message: "", isError: false });

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = async () => {
    const jobId = confirmModal.jobId;
    if (!jobId) return;

    try {
      await deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.jobId !== jobId));
      setConfirmModal({ isOpen: false, jobId: null });
      setStatusModal({ isOpen: true, message: "Job deleted successfully!", isError: false });
    } catch (error) {
      console.error("Delete failed:", error);
      setConfirmModal({ isOpen: false, jobId: null });
      setStatusModal({ isOpen: true, message: "Failed to delete job", isError: true });
    }
  };

  useEffect(() => {
    fetchJobs();

    const interval = setInterval(() => {
      fetchJobs();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-900/30 text-green-400 border border-green-900/50",
      processing: "bg-blue-900/30 text-blue-400 border border-blue-900/50",
      delayed: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50",
      dead: "bg-red-900/30 text-red-400 border border-red-900/50",
    };
    return styles[status] || "bg-slate-700 text-slate-300";
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700/50">
      <h2 className="text-xl font-bold mb-6 text-white">Recent Jobs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs tracking-wider">
              <th className="py-4 px-6 font-semibold">Job ID</th>
              <th className="py-4 px-6 font-semibold">Type</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Priority</th>
              <th className="py-4 px-6 font-semibold">Attempts</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/50">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-500 italic">
                  No jobs found in queue
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.jobId}
                  onClick={() => setSelectedJob(job.jobId)}
                  className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-mono text-white text-sm">
                    {job.jobId.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-6 text-slate-200">{job.type}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 capitalize text-slate-300">{job.priority}</td>
                  <td className="py-4 px-6 text-slate-300">{job.attempts}/{job.maxAttempts}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({ isOpen: true, jobId: job.jobId });
                      }}
                      className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-4 py-1.5 rounded-lg text-sm transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <JobDetail
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-2 text-white">Confirm Deletion</h3>
            <p className="text-slate-300 mb-6">Are you sure you want to delete this job? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, jobId: null })}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className={`text-xl font-bold mb-2 ${statusModal.isError ? "text-red-500" : "text-green-500"}`}>
              {statusModal.isError ? "Error" : "Success"}
            </h3>
            <p className="text-slate-300 mb-6">{statusModal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setStatusModal({ isOpen: false, message: "", isError: false })}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-white"
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