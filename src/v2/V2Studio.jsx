import React, { useState, useRef } from "react";
import IDCard from "../components/IDCard.jsx"; // Reusing visual card from V1 without modifying it
import BatchStudentTable from "./components/BatchStudentTable.jsx";
import ProgressModal from "./components/ProgressModal.jsx";
import { HiddenCardMount } from "./components/HiddenCardMount.jsx";
import { sampleBatchStudents } from "./data/mockStudents.js";
import {
  downloadSingleCard,
  runBatchExport,
} from "./utils/exportEngine.js";

export default function V2Studio() {
  const [students] = useState(sampleBatchStudents);
  const [activeStudent, setActiveStudent] = useState(sampleBatchStudents[0]);
  const [selectedIds, setSelectedIds] = useState(
    new Set(sampleBatchStudents.map((s) => s.id))
  );

  // Hidden offscreen card reference and state for batch export
  const [exportMountStudent, setExportMountStudent] = useState(null);
  const hiddenCardRef = useRef(null);

  // Export progress modal state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: "" });
  const isCancelledRef = useRef(false);

  // Handle student selections
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(students.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Single card download (PNG or PDF)
  const handleDownloadSingle = async (format) => {
    setExportMountStudent(activeStudent);
    // Allow state to mount to DOM
    await new Promise((r) => setTimeout(r, 60));
    try {
      await downloadSingleCard(hiddenCardRef.current, activeStudent, format);
    } catch (err) {
      console.error(err);
      alert(`Download failed: ${err.message}`);
    } finally {
      setExportMountStudent(null);
    }
  };

  // Batch export (PNGs in ZIP or PDFs in ZIP)
  const handleBatchExport = async (format) => {
    const targets = students.filter((s) => selectedIds.has(s.id));
    if (targets.length === 0) {
      alert("Please select at least one student to export.");
      return;
    }

    isCancelledRef.current = false;
    setIsExporting(true);
    setProgress({ current: 0, total: targets.length, message: "Initializing export queue..." });

    try {
      await runBatchExport({
        students: targets,
        format,
        isCancelledRef,
        onProgress: (current, total, message) => {
          setProgress({ current, total, message });
        },
        renderStudentCard: async (student) => {
          setExportMountStudent(student);
          // Wait for hidden component mount tick
          await new Promise((r) => setTimeout(r, 70));
          return hiddenCardRef.current;
        },
      });
    } catch (err) {
      if (err.message !== "Export was cancelled by the user.") {
        console.error(err);
        alert(`Batch export failed: ${err.message}`);
      }
    } finally {
      setIsExporting(false);
      setExportMountStudent(null);
    }
  };

  const handleCancelExport = () => {
    isCancelledRef.current = true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Offscreen Unscaled Card for Pixel-Perfect 300 DPI Captures */}
      <HiddenCardMount ref={hiddenCardRef} student={exportMountStudent} />

      {/* Progress Dialog */}
      <ProgressModal
        isOpen={isExporting}
        progress={progress}
        onCancel={handleCancelExport}
      />

      {/* V2 Studio Top Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Batch Generation & Export Studio
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              V2 Beta
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Preview any student and export selected cards as high-resolution PNGs or CR80 PDFs in a .zip archive.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleBatchExport("png")}
            disabled={selectedIds.size === 0 || isExporting}
            className="px-4 py-2 bg-idnavy text-white text-xs font-semibold rounded-xl hover:opacity-95 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Selected as PNG ZIP ({selectedIds.size})
          </button>

          <button
            type="button"
            onClick={() => handleBatchExport("pdf")}
            disabled={selectedIds.size === 0 || isExporting}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Selected as PDF ZIP ({selectedIds.size})
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Roster Table */}
        <div className="lg:col-span-6">
          <BatchStudentTable
            students={students}
            selectedIds={selectedIds}
            activeStudentId={activeStudent?.id}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onSelectStudent={setActiveStudent}
          />
        </div>

        {/* Right Column: Live Card Preview + Single Download */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Live Preview: {activeStudent?.name}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownloadSingle("png")}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Download PNG
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSingle("pdf")}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-6 w-full flex justify-center border border-gray-200">
            <IDCard student={activeStudent} />
          </div>
        </div>
      </div>
    </div>
  );
}

