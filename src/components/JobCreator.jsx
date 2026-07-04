import { useState, useEffect } from "react";
import { createJob } from "../api/api";

export default function JobCreator() {
  const [type, setType] = useState("SEND_EMAIL");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [modal, setModal] = useState({ isOpen: false, message: "", isError: false });

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

      setModal({ isOpen: true, message: "Job Created Successfully!", isError: false });
      setIdempotencyKey(crypto.randomUUID());
    } catch (err) {
      console.log(err);
      setModal({ isOpen: true, message: "Failed to create job", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <div className="bg-slate-800 rounded-xl p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create Job</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-slate-700 px-4 py-2 rounded-lg"
        >
          <option>SEND_EMAIL</option>
          <option>GENERATE_PDF</option>
          <option>SEND_WEBHOOK</option>
          <option>PROCESS_PAYMENT</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
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
          {loading ? "Creating..." : "Create Job"}
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
                onClick={closeModal}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
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