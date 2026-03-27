import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PredictionInput, PredictionResult } from './prediction';

export async function generatePDF(input: PredictionInput, result: PredictionResult) {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const now = new Date().toLocaleString();
  const accentColor: [number, number, number] = [227, 107, 85];  // Dharma Coral
  const textColor: [number, number, number] = [30, 41, 59];     // Slate 800
  const primaryColor: [number, number, number] = [71, 85, 105]; // Slate 600 for headers
  const lightGrey: [number, number, number] = [226, 232, 240];  // Slate 200

  const getLogoData = async (): Promise<string | null> => {
    try {
      const resp = await fetch('/images/logo.png');
      const blob = await resp.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) { return null; }
  };

  const logoData = await getLogoData();

  // 1. Header (Minimalist & Clean)
  if (logoData) {
    doc.addImage(logoData, 'PNG', 20, 15, 20, 20);
  }
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('DharmaAI', 45, 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Clinical Decision Support System', 45, 30);
  doc.text(`Report ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} | ${now}`, 45, 34);

  // Decorative line
  doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.setLineWidth(0.2);
  doc.line(20, 40, 190, 40);

  // 2. Result Summary (High Priority)
  let yPos = 55;
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DIAGNOSTIC SUMMARY', 20, yPos);

  yPos += 10;
  // Summary Box
  doc.setFillColor(252, 252, 252);
  doc.rect(20, yPos, 170, 35, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.rect(20, yPos, 170, 35, 'D');

  // Big Probability Score
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFontSize(36);
  doc.text(`${result.dharmaScore}%`, 25, yPos + 22);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('DHARMA SCORE', 25, yPos + 30);

  // Result Labels
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(result.resultStatus.toUpperCase(), 75, yPos + 12);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Confidence: ${result.confidenceLow}% - ${result.confidenceHigh}%`, 75, yPos + 18);
  
  const noteLines = doc.splitTextToSize(result.clinicalNote, 110);
  doc.text(noteLines, 75, yPos + 25);

  // 3. Clinical Parameters
  yPos += 50;
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT CLINICAL DATA', 20, yPos);

  const inputData = [
    ['Nausea', input.nausea ? 'Positive' : 'Negative', 'WBC Count', `${input.wbcCount} 10³/μL`],
    ['Appetite Loss', input.lossOfAppetite ? 'Positive' : 'Negative', 'Neutrophil %', `${input.neutrophilPercentage}%`],
    ['Peritonitis', input.peritonitis || 'None', 'Body Temp', `${input.bodyTemperature}°C`],
    ['Urinary Ketones', input.urinaryKetones || 'None', 'CRP', `${input.crp || 'N/A'} mg/L`],
    ['Free Fluids', input.freeFluids ? 'Present' : 'None', 'Diameter', `${input.appendixDiameter || 'N/A'} mm`],
  ];

  autoTable(doc, {
    startY: yPos + 4,
    margin: { left: 20 },
    theme: 'grid',
    body: inputData,
    styles: { fontSize: 8.5, cellPadding: 3, lineColor: [240, 240, 240] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 100, 100], fillColor: [250, 250, 250], cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { fontStyle: 'bold', textColor: [100, 100, 100], fillColor: [250, 250, 250], cellWidth: 35 },
      3: { cellWidth: 40 },
    },
  });

  // 4. SHAP Values (Explainable AI Section)
  yPos = (doc as any).lastAutoTable.finalY + 15;
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 25;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPLAINABLE AI (SHAP) ANALYSIS', 20, yPos);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('This table shows how each clinical feature contributed to the final Dharma Score.', 20, yPos + 5);

  const formatFeatureName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const sortedShap = [...result.shapValues].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 8);
  const shapData = sortedShap.map(s => {
    const isPositive = s.contribution > 0;
    const sign = isPositive ? '+' : '';
    return [formatFeatureName(s.feature), `${sign}${s.contribution.toFixed(2)}`, isPositive ? 'Increasing Risk' : 'Decreasing Risk'];
  });

  autoTable(doc, {
    startY: yPos + 8,
    margin: { left: 20 },
    head: [['Clinical Feature', 'Contribution', 'Impact on Diagnosis']],
    body: shapData,
    theme: 'striped',
    headStyles: { 
      fillColor: primaryColor, 
      textColor: [255, 255, 255], 
      fontSize: 8,
      cellPadding: 4 
    },
    styles: { 
      fontSize: 8, 
      cellPadding: 3,
      textColor: [51, 65, 85] // Slate-700
    },
    columnStyles: {
      1: { halign: 'center', fontStyle: 'bold' },
      2: { halign: 'center' }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const val = parseFloat(data.cell.text[0]);
        if (val > 0) doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        else if (val < 0) doc.setTextColor(40, 120, 200);
      }
    }
  });

  // 5. Complication Risk (Secondary)
  if (result.complication) {
    const spaceRemaining = pageHeight - (doc as any).lastAutoTable.finalY - 30; // 30 is footer area
    if (spaceRemaining < 25) {
      doc.addPage();
      yPos = 25;
    } else {
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('COMPLICATION RISK ASSESSMENT', 20, yPos);
    
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const compText = `Estimated risk of perforation or abscess: ${result.complication.probability}% (${result.complication.note || 'Likelihood of developing complications.'})`;
    doc.text(compText, 20, yPos + 6);
  }

  // Final Footer (Positioned at very bottom)
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  const footerY = pageHeight - 15;
  
  // Add a line above footer
  doc.setDrawColor(240, 240, 240);
  doc.line(20, footerY - 5, 190, footerY - 5);
  
  doc.text('DharmaAI - Advanced Appendix Diagnostic Platform | doi: 10.1101/2025.05.27.25328468', 105, footerY, { align: 'center' });
  doc.text('This data is for clinical decision support. Final diagnostic authority resides with the treating physician.', 105, footerY + 5, { align: 'center' });

  doc.save(`DharmaAI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
