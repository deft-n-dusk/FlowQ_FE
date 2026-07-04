import { useEffect, useState } from "react";
import { getJobById } from "../api/api";

export default function JobDetail({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const res = await getJobById(jobId);
      setJob(res.data || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white text-slate-900 w-[500px] rounded-lg p-5 shadow-lg">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Job Details
          </h2>

          <button
            onClick={onClose}
            className="text-red-500"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : job ? (
          <div className="space-y-2 text-sm">
            
            <p>
              <b>Job ID:</b> {job.jobId}
            </p>

            <p>
              <b>Type:</b> {job.type}
            </p>

            <p>
              <b>Status:</b> {job.status}
            </p>

            <p>
              <b>Priority:</b> {job.priority}
            </p>

            <p>
              <b>Attempts:</b>{" "}
              {job.attempts}/{job.maxAttempts}
            </p>

            <p>
              <b>Last Error:</b>{" "}
              {job.lastError || "None"}
            </p>

            <p>
              <b>Processed By:</b>{" "}
              {job.processedBy || "N/A"}
            </p>

            <p>
              <b>Created:</b>{" "}
              {new Date(
                job.createdAt
              ).toLocaleString()}
            </p>

            <div>
              <b>Payload:</b>
              <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-auto">
                {JSON.stringify(
                  job.payload,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        ) : (
          <p>Job not found</p>
        )}
      </div>
    </div>
  );
}