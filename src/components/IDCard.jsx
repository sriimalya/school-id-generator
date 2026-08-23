import "../styles/student-id-card.css";
import { useEffect, useRef, useState } from "react";

const BASE_WIDTH = 550;
const BASE_HEIGHT = 870;

const detailRows = [
  { key: "fatherName", label: "F.Name" },
  { key: "dob", label: "D.O.B." },
  { key: "className", label: "Class" },
  { key: "section", label: "Sec" },
  { key: "rollNo", label: "Roll No" },
  { key: "mobile", label: "Mobile No." },
  { key: "address", label: "Address" },
];

export default function IDCard({ student }) {
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateScale = () => {
      const availableWidth = el.offsetWidth;
      if (!availableWidth) return;
      // Never scale UP past 1 — laptop/desktop stays pixel-exact as-is.
      const next = Math.min(1, availableWidth / BASE_WIDTH);
      setScale(next);
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(el);

    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, []);

  return (
    <div
      className="id-card-wrapper"
      ref={wrapperRef}
      style={{ height: BASE_HEIGHT * scale }}
    >
      <div
        className="id-card"
        data-testid="id-card"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Background Geometry */}
        <div className="bg-top-blue" />
        <div className="bg-top-green" />
        <div className="bg-bottom-green" />
        <div className="bg-bottom-blue" />

        {/* Content Layer */}
        <div className="content-layer">
          {/* Registration Number */}
          <div className="reg-no">Reg.No. :- {student.regNo}</div>

          {/* School Title -- left-aligned, single line */}
          <div className="school-title">{student.schoolName}</div>

          {/* Subheader: Logos + Location + Session */}
          <div className="subheader">
            <div className="logo logo-left">
              <svg viewBox="0 0 64 64" width="100%" height="100%">
                <circle cx="32" cy="32" r="30" fill="#fff" stroke="#1a3a5c" strokeWidth="1" />
                <text x="32" y="20" textAnchor="middle" fontSize="6" fontWeight="800" fill="#e53030" letterSpacing="0.4">GLOBAL PUBLIC SCHOOL</text>
                <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1e2d3d">GPS</text>
                <text x="32" y="52" textAnchor="middle" fontSize="5" fontWeight="700" fill="#e53030">JAITHAR, SARAN</text>
              </svg>
            </div>

            <div className="location-text">
              <h2>{student.schoolLocation}</h2>
              <p>{student.session}</p>
            </div>

            <div className="logo logo-right">
              <svg viewBox="0 0 64 64" width="100%" height="100%">
                <circle cx="32" cy="32" r="30" fill="#fff" />
                <text x="32" y="16" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#3080d0">My Chhota School</text>
                <circle cx="40" cy="32" r="10" fill="#e04020" />
                <circle cx="40" cy="24" r="6" fill="#ffe0a0" />
                <circle cx="26" cy="36" r="8" fill="#3080d0" />
                <circle cx="26" cy="28" r="5" fill="#ffe0a0" />
              </svg>
            </div>
          </div>

          {/* Student Photo */}
          <div className="photo-container">
            <img src={student.photo} alt={`Photo of ${student.name || "student"}`} />
          </div>

          {/* Student Name */}
          <div className="student-name">{student.name}</div>

          {/* Student Details Grid */}
          <div className="details-grid">
            {detailRows.map((row) => (
              <div className="details-grid__row" key={row.key}>
                <div className="grid-label">{row.label}</div>
                <div className="grid-colon">:-</div>
                <div className="grid-value">{student[row.key]}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="footer">
            <div className="contact-info">School Contact:-{student.schoolContact}</div>
            <div className="principal-box">
              <div className="signature-placeholder" />
              <div className="principal-text">PRINCIPAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}