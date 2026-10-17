import React from "react";

export default function ProgressModal({
  isOpen,
  progress, // { current: number, total: number, message: string }
  onCancel,
}) {
  if (!isOpen) return null;

  const percent = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <div className="w-14 h-14 bg-blue-50 text-idnavy rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Generating ID Cards...
        </h3>
        <p className="text-sm text-gray-500 mb-6 truncate">
          {progress.message || "Preparing batch assets..."}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-idnavy h-3 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 font-medium mb-6">
          <span>Card {progress.current} of {progress.total}</span>
          <span>{percent}% Completed</span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2.5 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition"
        >
          Cancel Export
        </button>
      </div>
    </div>
  );
}

