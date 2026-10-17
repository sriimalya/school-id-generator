# Implementation Plan: V2 Batch & Export Studio (Zero-Disturbance Architecture)

## Executive Overview
This implementation plan outlines the creation of **Version 2 (V2)** for the School ID Card Generator. The objective is to allow batch generation and export of student ID cards as high-resolution PNGs and CR80-standard PDFs bundled into a downloadable `.zip` file—**without modifying or disturbing any existing V1 code**.

---

## 1. Architectural Principles & Constraints

1. **Strict Isolation (Zero Disturbance):**
   - Existing V1 files (`src/App.jsx`, `src/components/StudentForm.jsx`, `src/components/IDCard.jsx`, `src/styles/student-id-card.css`, `src/data/dummyStudent.js`) will not be altered.
   - All new logic, components, utilities, and data will reside in a new isolated folder: `src/v2/`.
   - A lightweight top-level switch will allow switching between **V1 (Single Editor)** and **V2 (Batch & Export Studio)**.

2. **Zero Font Dislocation & Exact Print Fidelity:**
   - Pre-capture font locking: ensure `document.fonts.ready` is resolved.
   - Fixed unscaled rendering: generate images against an unscaled off-screen canvas at native dimensions (`550px × 870px`) with a high-density `pixelRatio` (3x = 1650 × 2610 px) ensuring 300+ DPI print quality.
   - Physical print standard: export PDFs sized to CR80 dimensions (54mm × 85.6mm vertical).

3. **Memory & Performance Safeguards:**
   - Sequential or chunked batch processing with an event-driven queue so processing 50–100 students does not lock the browser UI.
   - Explicit blob and image object URL cleanup to prevent browser memory leaks.

---

## 2. Directory Structure

```text
src/
├── components/             <-- Untouched V1
├── data/                   <-- Untouched V1
├── styles/                 <-- Untouched V1
├── App.jsx                 <-- Wrapped with a non-intrusive V1/V2 switcher
└── v2/                     <-- All new V2 implementation
    ├── data/
    │   └── mockStudents.js        # Realistic roster of 10-20 sample students
    ├── utils/
    │   ├── exportEngine.js        # Core html-to-image + jsPDF + JSZip pipeline
    │   └── fontLoader.js          # Font readiness and validation utility
    ├── components/
    │   ├── BatchHeader.jsx        # Top bar with batch actions and counts
    │   ├── BatchStudentTable.jsx  # Student roster list with selection checkboxes
    │   ├── BatchCardPreview.jsx   # Live preview of currently selected student
    │   ├── HiddenCardMount.jsx    # Off-screen fixed 1x unscaled card renderer for capture
    │   └── ProgressModal.jsx      # Progress bar ("Exporting 14 / 50..."), status, and cancel
    └── V2Studio.jsx               # Main V2 workspace view
```

---

## 3. Technology Stack & Dependencies

| Package | Purpose |
| :--- | :--- |
| `html-to-image` | High-fidelity DOM-to-canvas rendering preserving CSS transforms, clip paths, and SVGs. |
| `jspdf` | Generating standard dimensioned vector/image PDF ID cards. |
| `jszip` | In-browser asynchronous ZIP file creation. |
| `file-saver` | Triggering client-side file downloads of `.zip`, `.png`, and `.pdf`. |

---

## 4. Phased Implementation Steps

### Phase 1: Dependency Installation & Setup
- Install `html-to-image`, `jspdf`, `jszip`, `file-saver`.
- Verify no dependency conflicts with Vite 5 and React 18.

### Phase 2: Core Export Engine (`src/v2/utils/exportEngine.js`)
- **Single Card Capture:** Function to capture a target DOM node with `html-to-image` using `pixelRatio: 3` and cache busting.
- **PDF Wrapper:** Function to embed high-res PNG into a standardized CR80 vertical card PDF (`54mm × 85.6mm`).
- **Batch Pipeline:** Sequential runner that iterates over a student list:
  1. Mounts student data to `HiddenCardMount`.
  2. Awaits DOM render tick + font readiness.
  3. Captures PNG or converts to PDF.
  4. Appends to `JSZip` folder structure.
  5. Emits real-time progress callbacks `(completed, total)`.
  6. Compiles and triggers `students_batch_<timestamp>.zip` download.

### Phase 3: Off-Screen Mount (`src/v2/components/HiddenCardMount.jsx`)
- Render an exact clone of the card element fixed off-screen:
  ```css
  position: fixed;
  left: -9999px;
  top: 0;
  width: 550px;
  height: 870px;
  transform: none; /* Never scaled down */
  ```
- Ensures exported text, fonts, and diagonal SVG geometry match reference coordinates without viewport interference.

### Phase 4: UI & Batch Management (`src/v2/`)
- **Roster Table:** Display students with thumbnail, name, roll number, class, and status.
- **Selection Controls:** "Select All", "Deselect All", individual checkboxes.
- **Actions:**
  - "Export Selected as PNGs (.zip)"
  - "Export Selected as PDFs (.zip)"
  - "Download Single Card" (instant individual download)
- **Progress Modal:** Displays real-time progress bar, percentage, student counter, and an Abort/Cancel button.

### Phase 5: App Switcher Integration
- Wrap entry point with a clean top toggle bar:
  - `[ Version 1: Single Card Editor ]` | `[ Version 2: Batch & Export Studio ]`
- Defaults to V1 or V2 as desired; zero impact on existing V1 behavior.

---

## 5. Verification & Acceptance Criteria

1. **Visual Parity:**
   - Exported PNG and PDF cards match the screen template with zero font displacement, zero border warping, and sharp logos.
2. **Batch Handling:**
   - Successfully batch-processes 10–50 students without freezing the browser tab or leaking memory.
3. **Download Integrity:**
   - Resulting `.zip` file opens cleanly on Windows, Mac, and Linux with valid, uncorrupted individual files (`RollNo_StudentName.png` or `.pdf`).
4. **V1 Preserved:**
   - Toggling back to V1 shows the original editor working identically with no regressions.

