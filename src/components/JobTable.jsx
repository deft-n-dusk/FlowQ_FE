import { useEffect, useState } from "react";
import { getJobs } from "../api/api";
import JobDetail from "./JobDetail";

export default function JobTable() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
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
      <h2 className="text-xl font-semibold mb-4">
        Jobs
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="py-3">Job ID</th>
              <th className="py-3">Type</th>
              <th className="py-3">Status</th>
              <th className="py-3">Priority</th>
              <th className="py-3">Attempts</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-slate-400"
                >
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr
                  key={job.jobId}
                  onClick={() =>
                    setSelectedJob(job.jobId)
                  }
                  className="border-b border-slate-700 cursor-pointer hover:bg-slate-700/40"
                >
                  <td className="py-3">
                    <span title={job.jobId}>
                      {job.jobId.slice(0, 8)}...
                    </span>
                  </td>

                  <td className="py-3">
                    {job.type}
                  </td>

                  <td className="py-3 capitalize">
                    {job.status}
                  </td>

                  <td className="py-3 capitalize">
                    {job.priority}
                  </td>

                  <td className="py-3">
                    {job.attempts}/
                    {job.maxAttempts}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetail
          jobId={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}