'use client';

import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Notes {
  title: string;
  markdownContent: string;
  topics: string[];
  transcript: string;
}

interface NotePanelProps {
  notes: Notes;
}

type PaperStyle = 'ruled' | 'grid' | 'blank';
type FontStyle = 'font-sans' | 'font-caveat' | 'font-handlee' | 'font-indie' | 'font-gochi';

export default function NotesPanel({ notes }: NotePanelProps) {
  const notesRef = useRef<HTMLDivElement>(null);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('ruled');
  const [activeFont, setActiveFont] = useState<FontStyle>('font-sans');

  const exportToPDF = async () => {
    if (!notesRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(notesRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            :root {
              --background: #ffffff !important;
              --foreground: #000000 !important;
              --primary: #1890ff !important;
              --secondary: #52c41a !important;
              --accent: #fadb14 !important;
              --border: #000000 !important;
            }
            body, * {
              border-color: #000000 !important;
              color: inherit;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('video2pen-study-notes.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="brutalist-card bg-white p-4 flex flex-wrap items-center justify-between gap-4 border-black">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Font Selector */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Typography</span>
            <select 
              onChange={(e) => setActiveFont(e.target.value as FontStyle)}
              className="brutalist-input py-1 text-xs font-black uppercase tracking-tighter cursor-pointer"
            >
              <option value="font-sans">Modern Clean</option>
              <option value="font-caveat">Standard Ink</option>
              <option value="font-handlee">Casual Felt</option>
              <option value="font-indie">Fine Liner</option>
              <option value="font-gochi">Bold Marker</option>
            </select>
          </div>

          {/* Paper Selector */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Background</span>
            <div className="flex border-[3px] border-black rounded-lg overflow-hidden font-black text-[10px] uppercase">
              {(['ruled', 'grid', 'blank'] as PaperStyle[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPaperStyle(s)}
                  className={`px-4 py-2 transition-all border-r-[3px] border-black last:border-r-0 ${paperStyle === s ? 'bg-primary text-white' : 'bg-white hover:bg-muted'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={exportToPDF} className="brutalist-button-accent text-xs px-8 h-12">
           DOWNLOAD AS PDF 📥
        </button>
      </div>

      {/* Main Digital Notebook */}
      <div 
        className={`brutalist-card bg-white overflow-hidden ${activeFont} border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      >
        <div 
          ref={notesRef}
          className={`notebook-paper ${paperStyle === 'grid' ? 'grid-paper' : paperStyle === 'blank' ? 'blank-paper' : ''}`}
        >
            <div className="text-5xl font-bold border-b-[3px] border-black/10 mb-10 pb-4 text-center italic tracking-tighter capitalize">
              {notes.title.toLowerCase()}
            </div>

           <div className="prose prose-lg max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase 
              prose-h2:text-primary prose-h2:border-b-2 prose-h2:border-primary/20 prose-h2:pb-2
              prose-h3:text-secondary 
              prose-a:text-blue-600 prose-a:underline 
              prose-strong:font-black prose-strong:text-black 
              prose-table:border-[3px] prose-table:border-black prose-th:bg-black/5 prose-th:p-3 prose-td:p-3
              prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-accent/10 prose-blockquote:p-4 prose-blockquote:not-italic prose-blockquote:font-bold
              prose-li:marker:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {notes.markdownContent}
              </ReactMarkdown>
            </div>

           {/* Footer branding */}
           <div className="mt-32 pt-10 border-t-2 border-black/5 text-center opacity-40 text-sm italic tracking-widest font-black uppercase">
             Generated by Video2Pen.ai • {new Date().toLocaleDateString()}
           </div>
        </div>
      </div>
    </div>
  );
}
