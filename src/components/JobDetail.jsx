import { useEffect, useState } from "react";
import { getJobById } from "../api/api";

export default function JobDetail({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await getJobById(jobId);
      setJob(res.data.job || res.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchJob();
  }, [jobId]);

  if (!jobId) return null;

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const colors = {
      completed: "bg-green-500/20 text-green-400 border-green-500/20",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/20",
      delayed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      dead: "bg-red-500/20 text-red-400 border-red-500/20",
    };
    return colors[status] || "bg-slate-700 text-slate-300";
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Job Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : job ? (
          <div className="space-y-4">
            <DetailRow label="Job ID" value={job.jobId} isCode />
            <DetailRow label="Type" value={job.type} />
            <DetailRow 
              label="Status" 
              value={
                <span className={`px-2 py-0.5 rounded-md border text-xs font-bold uppercase ${getStatusBadge(job.status)}`}>
                  {job.status}
                </span>
              } 
            />
            <DetailRow label="Priority" value={job.priority} />
            <DetailRow label="Attempts" value={`${job.attempts} / ${job.maxAttempts}`} />
            <DetailRow label="Processed By" value={job.processedBy || "N/A"} />
            <DetailRow label="Created" value={new Date(job.createdAt).toLocaleString()} />
            
            {job.lastError && (
              <div className="bg-red-950/30 p-3 rounded-lg border border-red-900/50">
                <p className="text-red-400 text-xs font-bold mb-1">LAST ERROR</p>
                <p className="text-red-200 text-sm">{job.lastError}</p>
              </div>
            )}

            <div>
              <p className="text-slate-400 text-xs font-bold mb-2">PAYLOAD</p>
              <pre className="bg-black/40 p-4 rounded-xl text-xs overflow-auto max-h-48 border border-slate-700 text-slate-300">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-400 py-10">Job not found.</p>
        )}
      </div>
    </div>
  );
}

// Small helper component for clean layout
function DetailRow({ label, value, isCode }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-sm font-medium ${isCode ? "font-mono text-blue-300" : ""}`}>{value}</span>
    </div>
  );
}