import React from "react";

export default function BatchStudentTable({
  students,
  selectedIds,
  activeStudentId,
  onToggleSelect,
  onSelectAll,
  onSelectStudent,
}) {
  const allSelected = students.length > 0 && selectedIds.size === students.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="selectAll"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 rounded text-idnavy border-gray-300 focus:ring-idnavy cursor-pointer"
          />
          <label htmlFor="selectAll" className="text-sm font-semibold text-gray-700 cursor-pointer">
            Select All ({students.length} Students)
          </label>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 py-1 px-2.5 rounded-full">
          {selectedIds.size} of {students.length} selected
        </span>
      </div>

      <div className="divide-y divide-gray-100 max-h-[560px] overflow-y-auto">
        {students.map((student) => {
          const isSelected = selectedIds.has(student.id);
          const isActive = activeStudentId === student.id;

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className={`p-3.5 flex items-center justify-between cursor-pointer transition ${
                isActive
                  ? "bg-blue-50/80 border-l-4 border-idnavy"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(student.id)}
                  className="w-4 h-4 rounded text-idnavy border-gray-300 focus:ring-idnavy cursor-pointer"
                />
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Roll: <span className="font-semibold text-gray-700">{student.rollNo}</span> | Class: {student.className}-{student.section}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

