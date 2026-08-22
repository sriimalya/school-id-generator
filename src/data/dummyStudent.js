// Generic placeholder avatar (simple silhouette) encoded as an SVG data URI.
// Used so the app has "no database / no upload required" default state,
// without depicting any real person.
export const placeholderPhoto =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <rect width="400" height="500" fill="#dbe4e8"/>
    <circle cx="200" cy="190" r="80" fill="#9fb0b8"/>
    <path d="M60 480 C60 360 140 300 200 300 C260 300 340 360 340 480 Z" fill="#9fb0b8"/>
  </svg>
`);

// Fictional sample data only -- deliberately NOT the personal details of any
// real student, so this file is safe to ship as a default/demo state.
export const defaultStudent = {
  // School/template-level fields (fixed in the reference design, but kept
  // editable here so the same template can be reused by any school)
  regNo: "219125120231223164807",
  schoolName: "GLOBAL PUBLIC SCHOOL",
  schoolLocation: "JAITHAR, SARAN",
  session: "Session-2026-27",
  schoolContact: "8804626384",

  // Student fields
  name: "PRIYANSHU KUMAR",
  fatherName: "UPENDRA MANJHI",
  dob: "15-08-2015",
  className: "III",
  section: "B",
  rollNo: "25",
  mobile: "9000000000",
  address: "JAITHAR TARAYA SARAN",
  photo: placeholderPhoto,
};
