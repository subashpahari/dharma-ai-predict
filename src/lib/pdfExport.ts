import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PredictionInput, PredictionResult } from './prediction';

export function generatePDF(input: PredictionInput, result: PredictionResult) {
  const doc = new jsPDF();
  const now = new Date().toLocaleString();

  // Header
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(222, 184, 135);
  doc.setFontSize(22);
  doc.text('DharmaAI Clinical Report', 20, 25);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${now}`, 20, 33);

  // Score
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(16);
  doc.text(`Dharma Score: ${result.dharmaScore}%`, 20, 55);
  doc.setFontSize(11);
  doc.text(`Confidence Interval: ${result.confidenceLow}% - ${result.confidenceHigh}%`, 20, 63);
  doc.text(`Status: ${result.resultStatus}`, 20, 71);

  // Clinical Note
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text('Clinical Note:', 20, 85);
  doc.setFontSize(10);
  const noteLines = doc.splitTextToSize(result.clinicalNote, 170);
  doc.text(noteLines, 20, 93);

  // Input Parameters Table
  const inputData = [
    ['Nausea', input.nausea ? 'Yes' : 'No'],
    ['Loss of Appetite', input.lossOfAppetite ? 'Yes' : 'No'],
    ['Peritonitis', input.peritonitis],
    ['Urinary Ketones', input.urinaryKetones],
    ['Free Fluids', input.freeFluids ? 'Yes' : 'No'],
    ['WBC Count (10³/μL)', String(input.wbcCount)],
    ['Body Temperature (°C)', String(input.bodyTemperature)],
    ['Neutrophil (%)', String(input.neutrophilPercentage)],
    ['CRP (mg/L)', String(input.crp)],
    ['Appendix Diameter (mm)', String(input.appendixDiameter)],
  ];

  autoTable(doc, {
    startY: 110,
    head: [['Parameter', 'Value']],
    body: inputData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] },
  });

  // SHAP Values Table
  const shapData = result.shapValues.map(s => [s.feature, s.contribution > 0 ? `+${s.contribution.toFixed(1)}` : s.contribution.toFixed(1)]);

  autoTable(doc, {
    head: [['Feature', 'Contribution']],
    body: shapData,
    theme: 'striped',
    headStyles: { fillColor: [50, 50, 50] },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text('DharmaAI — Dr. Anup Thapa & DharmaAI Team | doi: 10.1101/2025.05.27.25328468', 20, pageHeight - 10);
  doc.text('This report is for clinical decision support only and should not replace clinical judgment.', 20, pageHeight - 5);

  doc.save(`DharmaAI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
