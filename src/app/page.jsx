// app/page.jsx
"use client";

import { useState } from "react";
import { post } from "@/lib/axios";
import { get } from "lodash";
export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    const validTypes = [
      "text/csv",
      // "application/vnd.ms-excel",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a CSV file.");
      e.target.value = "";
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful");
    } catch (err) {
      console.error(err);
      setErr(get(err, "errMsg"));
      //alert("Upload failed");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
        className={`
          block w-full text-gray-700 
          file:mr-3 file:py-2 file:px-4 
          file:rounded file:border-0 
          file:bg-blue-600 file:text-white 
          hover:file:bg-blue-700
        `}
      />
      {loading && <p className="mt-2 text-blue-600">Uploading…</p>}
      {err && <p className="mt-2 text-red-600">{err}</p>}
    </div>
  );
}
