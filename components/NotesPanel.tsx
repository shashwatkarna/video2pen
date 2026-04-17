'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Notes {
  summary: string;
  keyPoints: string[];
  topics: string[];
  transcript: string;
}

interface NotePanelProps {
  notes: Notes;
}

export default function NotesPanel({ notes }: NotePanelProps) {
  const notesRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!notesRef.current) return;

    try {
      // Dynamically import to avoid SSR errors
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Create canvas from the DOM element
      const canvas = await html2canvas(notesRef.current, {
        backgroundColor: '#faf8f3',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF, handling multiple pages
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save('notes.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={exportToPDF}
          variant="outline"
          className="border-primary/50"
        >
          📥 Export as PDF
        </Button>
      </div>

      {/* Notes Content */}
      <div
        ref={notesRef}
        className="space-y-6 p-8 bg-white rounded-xl shadow-lg"
        style={{
          fontFamily: 'var(--font-caveat), cursive',
          backgroundColor: '#faf8f3',
        }}
      >
        {/* Header */}
        <div className="border-b-4 border-primary/30 pb-4">
          <h2
            className="text-4xl font-bold text-primary mb-2"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Video Summary Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Summary Section */}
        <div className="space-y-3">
          <h3
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            📌 Summary
          </h3>
          <div
            className="text-lg leading-relaxed text-foreground bg-secondary/5 p-4 rounded-lg border-l-4 border-primary/40"
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: '18px',
              lineHeight: '1.8',
            }}
          >
            {notes.summary}
          </div>
        </div>

        {/* Key Points Section */}
        <div className="space-y-3">
          <h3
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            ✨ Key Points
          </h3>
          <ul className="space-y-2">
            {notes.keyPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-foreground"
                style={{ fontFamily: 'var(--font-caveat)', fontSize: '16px' }}
              >
                <span className="text-primary font-bold text-xl">•</span>
                <span className="flex-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics Section */}
        <div className="space-y-3">
          <h3
            className="text-3xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            🏷️ Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {notes.topics.map((topic, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-accent/20 text-accent rounded-full font-semibold border-2 border-accent/30"
                style={{ fontFamily: 'var(--font-caveat)', fontSize: '16px' }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-primary/30 pt-4 text-center text-sm text-muted-foreground">
          <p style={{ fontFamily: 'var(--font-caveat)' }}>
            Created with NotePad • AI-powered note generation
          </p>
        </div>
      </div>

      {/* Full Transcript (collapsible in future) */}
      <details className="group">
        <summary className="cursor-pointer font-semibold text-primary hover:text-primary/80 transition">
          📄 Show Full Transcript
        </summary>
        <Card className="mt-4 p-4 bg-muted/30">
          <p
            className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            {notes.transcript}
          </p>
        </Card>
      </details>
    </div>
  );
}
