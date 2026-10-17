import { useState } from "react";
import StudentForm from "./components/StudentForm.jsx";
import IDCard from "./components/IDCard.jsx";
import { defaultStudent } from "./data/dummyStudent.js";
import V2Studio from "./v2/V2Studio.jsx";

export default function App() {
  const [student, setStudent] = useState(defaultStudent);

  const handlePhotoChange = (dataUrl) => {
    setStudent((prev) => ({ ...prev, photo: dataUrl }));
  };

  const handleReset = () => {
    setStudent(defaultStudent);
  };

  const [activeTab, setActiveTab] = useState("v1"); // "v1" | "v2"

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              School ID Card Generator
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Production ID card creation, batch preview, and print-ready export
            </p>
          </div>

          {/* Non-destructive V1 / V2 Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("v1")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                activeTab === "v1"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              V1: Single Card Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("v2")}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === "v2"
                  ? "bg-white text-idnavy shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              V2: Batch & Export Studio
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === "v1" ? (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <StudentForm
                student={student}
                onChange={setStudent}
                onPhotoChange={handlePhotoChange}
                onReset={handleReset}
              />

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3 text-center lg:text-left">
                  Live Preview
                </p>
                <div className="bg-gray-100 rounded-2xl p-6 flex justify-center">
                  <IDCard student={student} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <V2Studio />
        )}
      </main>
    </div>
  );
}
