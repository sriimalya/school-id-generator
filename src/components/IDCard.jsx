import "../styles/student-id-card.css";

// Fixed labels for the details section -- these never change, only the
// values (coming from `student`) are dynamic.
const detailRows = [
  { key: "fatherName", label: "F.Name" },
  { key: "dob", label: "D.O.B." },
  { key: "className", label: "Class" },
  { key: "section", label: "Sec" },
  { key: "rollNo", label: "Roll No" },
  { key: "mobile", label: "Mobile No.:-", inlineSep: true },
  { key: "address", label: "Address" },
];

export default function IDCard({ student }) {
  return (
    <div className="id-card" data-testid="id-card">
      {/* Fixed dark header */}
      <div className="id-card__header" />

      {/* Fixed diagonal accents -- top-right and bottom-left per reference */}
      <div className="id-card__diagonal-top" />
      <div className="id-card__diagonal-bottom" />

      {/* Fixed logos (dummy placeholders) */}
      <div className="id-card__logo id-card__logo--left">
        <svg viewBox="0 0 64 64" width="90%" height="90%">
          <circle cx="32" cy="32" r="30" fill="#1a3a5c" stroke="#c8a848" strokeWidth="2" />
          <text
            x="32"
            y="22"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="#fff"
          >
            GLOBAL PUBLIC SCHOOL
          </text>
          <text
            x="32"
            y="38"
            textAnchor="middle"
            fontSize="16"
            fontWeight="800"
            fill="#fff"
          >
            GPS
          </text>
          <text
            x="32"
            y="50"
            textAnchor="middle"
            fontSize="6"
            fontWeight="600"
            fill="#c8a848"
          >
            JAITHAR, SARAN
          </text>
        </svg>
      </div>
      <div className="id-card__logo id-card__logo--right">
        <svg viewBox="0 0 64 64" width="90%" height="90%">
          <circle cx="32" cy="32" r="30" fill="#fff8e0" />
          <text
            x="32"
            y="18"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="#e04020"
          >
            My Chhota School
          </text>
          <circle cx="40" cy="34" r="10" fill="#e04020" />
          <circle cx="40" cy="26" r="6" fill="#ffe0a0" />
          <circle cx="26" cy="38" r="8" fill="#3080d0" />
          <circle cx="26" cy="30" r="5" fill="#ffe0a0" />
        </svg>
      </div>

      {/* Header text */}
      <div className="id-card__header-content">
        <div className="id-card__reg">Reg.No. :- {student.regNo}</div>
        <div className="id-card__school-name">{student.schoolName}</div>
        <div className="id-card__school-location">{student.schoolLocation}</div>
        <div className="id-card__session">{student.session}</div>
      </div>

      {/* Dynamic photo */}
      <div className="id-card__photo-frame">
        <img src={student.photo} alt={`Photo of ${student.name || "student"}`} />
      </div>

      {/* Dynamic name */}
      <div className="id-card__name">{student.name}</div>

      {/* Dynamic details, fixed labels */}
      <div className="id-card__details">
        {detailRows.map((row) => (
          <div className="id-card__row" key={row.key}>
            <span className="id-card__label">{row.label}</span>
            {!row.inlineSep && <span className="id-card__sep">:-</span>}
            <span className="id-card__value">
              {row.inlineSep ? " " : ""}
              {student[row.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Fixed footer */}
      <div className="id-card__footer">
        <div className="id-card__contact">School Contact:-{student.schoolContact}</div>
        <div className="id-card__principal">
          <div className="id-card__principal-sig">A</div>
          PRINCIPAL
        </div>
      </div>
    </div>
  );
}

