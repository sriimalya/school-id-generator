const studentFields = [
  { key: "name", label: "Student Name", type: "text" },
  { key: "fatherName", label: "Father's Name", type: "text" },
  { key: "dob", label: "Date of Birth", type: "text", placeholder: "DD-MM-YYYY" },
  { key: "className", label: "Class", type: "text" },
  { key: "section", label: "Section", type: "text" },
  { key: "rollNo", label: "Roll Number", type: "text" },
  { key: "mobile", label: "Mobile Number", type: "text" },
  { key: "address", label: "Address", type: "textarea" },
];

const schoolFields = [
  { key: "regNo", label: "Registration Number", type: "text" },
  { key: "schoolName", label: "School Name", type: "text" },
  { key: "schoolLocation", label: "School Location", type: "text" },
  { key: "session", label: "Session", type: "text" },
  { key: "schoolContact", label: "School Contact", type: "text" },
];

export default function StudentForm({ student, onChange, onPhotoChange, onReset }) {
  const handleFieldChange = (key) => (e) => {
    onChange({ ...student, [key]: e.target.value });
  };

  const handlePhotoInput = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPhotoChange(reader.result);
    reader.readAsDataURL(file);
  };

  const renderField = (field) => (
    <div key={field.key} className="mb-4">
      <label
        htmlFor={field.key}
        className="block text-sm font-semibold text-gray-700 mb-1"
      >
        {field.label}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={field.key}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-idnavy focus:ring-1 focus:ring-idnavy outline-none"
          value={student[field.key] ?? ""}
          onChange={handleFieldChange(field.key)}
        />
      ) : (
        <input
          id={field.key}
          type="text"
          placeholder={field.placeholder}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-idnavy focus:ring-1 focus:ring-idnavy outline-none"
          value={student[field.key] ?? ""}
          onChange={handleFieldChange(field.key)}
        />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Student Details</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="photo"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Student Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoInput}
          className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-idnavy file:text-white file:text-sm file:font-medium hover:file:opacity-90"
        />
      </div>

      {studentFields.map(renderField)}

      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-6 mb-3">
        School / Template Fields
      </h3>
      {schoolFields.map(renderField)}
    </div>
  );
}
