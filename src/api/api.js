import axios from "axios";

const API = axios.create({
  baseURL: "https://flowq-be.onrender.com",
});

export const getJobs = (params = {}) =>
  API.get("/jobs", { params });

export const getJobById = async (jobId) => {
  return await API.get(`/jobs/${jobId}`); 
};

export const createJob = (data) =>
  API.post("/jobs", data);

export const getDLQ = () =>
  API.get("/dlq");

export const replayDLQJob = (jobId) =>
  API.post(`/dlq/${jobId}/replay`);

export const deleteDLQJob = (jobId) =>
  API.delete(`/dlq/${jobId}`);

export const getWorkers = () =>
  API.get("/workers");

export const getMetrics = () =>
  API.get("/metrics");

export default API;