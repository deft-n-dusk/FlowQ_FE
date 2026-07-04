import { useState, useEffect } from "react";
import { createJob } from "../api/api";

export default function JobCreator() {
  const [type, setType] = useState("SEND_EMAIL");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  
  const [idempotencyKey, setIdempotencyKey] = useState("");

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createJob({
        type,
        priority,
        idempotencyKey: idempotencyKey, 
        payload: { timestamp: Date.now(), email: "test@test.com" },
      });

      alert("Job Created Successfully!");
      
      setIdempotencyKey(crypto.randomUUID()); 

    } catch (err) {
      console.log(err);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Create Job
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="bg-slate-700 px-4 py-2 rounded-lg"
        >
          <option>SEND_EMAIL</option>
          <option>GENERATE_PDF</option>
          <option>SEND_WEBHOOK</option>
          <option>PROCESS_PAYMENT</option>
        </select>

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
          className="bg-slate-700 px-4 py-2 rounded-lg"
        >
          <option>high</option>
          <option>medium</option>
          <option>low</option>
        </select>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium"
        >
          {loading
            ? "Creating..."
            : "Create Job"}
        </button>
      </div>
    </div>
  );
}