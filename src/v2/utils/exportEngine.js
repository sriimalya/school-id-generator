import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Ensures all fonts are completely parsed and rendered in document before capturing
 */
export async function ensureFontsLoaded() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

/**
 * Captures a DOM node with high DPI (3x = 300 DPI print fidelity)
 */
export async function captureCardAsDataUrl(elementNode) {
  if (!elementNode) throw new Error("Target element node is missing");
  await ensureFontsLoaded();

  // Small delay to allow sub-pixel layout settling
  await new Promise((r) => setTimeout(r, 60));

  return await toPng(elementNode, {
    pixelRatio: 3, // 550x870 -> 1650x2610 px (Ultra-crisp 300 DPI print quality)
    cacheBust: true,
    quality: 1,
  });
}

/**
 * Converts a PNG DataURL into a CR80 standard vertical PDF (54mm x 85.6mm)
 */
export function createCR80Pdf(pngDataUrl) {
  // CR80 ID Card dimensions: 53.98mm x 85.60mm (portrait)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [54, 85.6],
  });

  pdf.addImage(pngDataUrl, "PNG", 0, 0, 54, 85.6);
  return pdf;
}

/**
 * Sanitizes student names for file saving
 */
export function getSafeFilename(student, ext = "png") {
  const roll = student.rollNo ? `Roll_${student.rollNo}` : "ID";
  const name = (student.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${roll}_${name}.${ext}`;
}

/**
 * Download a single card directly (PNG or PDF)
 */
export async function downloadSingleCard(elementNode, student, format = "png") {
  const dataUrl = await captureCardAsDataUrl(elementNode);

  if (format === "png") {
    saveAs(dataUrl, getSafeFilename(student, "png"));
  } else if (format === "pdf") {
    const pdf = createCR80Pdf(dataUrl);
    pdf.save(getSafeFilename(student, "pdf"));
  }
}

/**
 * Batch generation engine with real-time progress callbacks and cancel support
 */
export async function runBatchExport({
  students,
  renderStudentCard, // (student) => Promise<elementNode>
  format = "png",    // "png" | "pdf"
  onProgress,        // (current, total, statusText) => void
  isCancelledRef,    // { current: boolean }
}) {
  const zip = new JSZip();
  const folderName = `ID_Cards_${format.toUpperCase()}`;
  const zipFolder = zip.folder(folderName);

  const total = students.length;

  for (let i = 0; i < total; i++) {
    if (isCancelledRef?.current) {
      throw new Error("Export was cancelled by the user.");
    }

    const student = students[i];
    onProgress?.(i + 1, total, `Processing ${student.name || `Student ${i + 1}`} (${i + 1}/${total})...`);

    // Mount and wait for DOM element to be ready
    const elementNode = await renderStudentCard(student);
    const dataUrl = await captureCardAsDataUrl(elementNode);

    if (format === "png") {
      const base64Data = dataUrl.split(",")[1];
      zipFolder.file(getSafeFilename(student, "png"), base64Data, { base64: true });
    } else if (format === "pdf") {
      const pdf = createCR80Pdf(dataUrl);
      const pdfArrayBuffer = pdf.output("arraybuffer");
      zipFolder.file(getSafeFilename(student, "pdf"), pdfArrayBuffer);
    }
  }

  onProgress?.(total, total, "Bundling ZIP archive...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `batch_id_cards_${format}_${Date.now()}.zip`);
}

