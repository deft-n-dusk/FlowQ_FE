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

  return (
    <div className="bg-slate-800 rounded-xl p-5 text-white">
      <h2 className="text-xl font-semibold mb-4">Jobs</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="py-3">Job ID</th>
              <th className="py-3">Type</th>
              <th className="py-3">Status</th>
              <th className="py-3">Priority</th>
              <th className="py-3">Attempts</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-400">
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.jobId}
                  onClick={() => setSelectedJob(job.jobId)}
                  className="border-b border-slate-700 cursor-pointer hover:bg-slate-700/40"
                >
                  <td className="py-3">
                    <span title={job.jobId}>{job.jobId.slice(0, 8)}...</span>
                  </td>

                  <td className="py-3">{job.type}</td>

                  <td className="py-3 capitalize">{job.status}</td>

                  <td className="py-3 capitalize">{job.priority}</td>

                  <td className="py-3">
                    {job.attempts}/{job.maxAttempts}
                  </td>

                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({ isOpen: true, jobId: job.jobId });
                      }}
                      className="text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 px-3 py-1 rounded text-sm transition-colors"
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