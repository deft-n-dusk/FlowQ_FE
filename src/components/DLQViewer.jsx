import { useEffect, useState } from "react";

import {
  getDLQ,
  replayDLQJob,
  deleteDLQJob,
} from "../api/api";

export default function DLQViewer() {
  const [jobs, setJobs] = useState([]);

  const fetchDLQ = async () => {
    try {
      const res = await getDLQ();
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDLQ();
  }, []);

  const replay = async (jobId) => {
    await replayDLQJob(jobId);
    fetchDLQ();
  };

  const remove = async (jobId) => {
    await deleteDLQJob(jobId);
    fetchDLQ();
  };

  return (
    <div className="space-y-4">
      {jobs.length === 0 && (
        <div className="bg-slate-800 rounded-xl p-5">
          No DLQ jobs found
        </div>
      )}

      {jobs.map((job) => (
        <div
          key={job.jobId}
          className="bg-slate-800 rounded-xl p-5"
        >
          <h3 className="font-semibold text-lg mb-2">
            {job.type}
          </h3>

          <p className="text-red-400 mb-4">
            {job.lastError}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() =>
                replay(job.jobId)
              }
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              Replay
            </button>

            <button
              onClick={() =>
                remove(job.jobId)
              }
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}