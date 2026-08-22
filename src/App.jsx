import { useState } from "react";
import StudentForm from "./components/StudentForm.jsx";
import IDCard from "./components/IDCard.jsx";
import { defaultStudent } from "./data/dummyStudent.js";

export default function App() {
  const [student, setStudent] = useState(defaultStudent);

  const handlePhotoChange = (dataUrl) => {
    setStudent((prev) => ({ ...prev, photo: dataUrl }));
  };

  const handleReset = () => {
    setStudent(defaultStudent);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Student ID Card Generator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and preview a school ID card
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}
