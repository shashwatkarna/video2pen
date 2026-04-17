'use client';

import { useRef, useState } from 'react';

interface Notes {
  title: string;
  summary: string;
  keyPoints: string[];
  topics: string[];
  transcript: string;
}

interface NotePanelProps {
  notes: Notes;
}

type PaperStyle = 'ruled' | 'grid' | 'blank';
type FontStyle = 'font-caveat' | 'font-handlee' | 'font-indie' | 'font-gochi';

export default function NotesPanel({ notes }: NotePanelProps) {
  const notesRef = useRef<HTMLDivElement>(null);
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('ruled');
  const [activeFont, setActiveFont] = useState<FontStyle>('font-handlee');
  const [highlightColor, setHighlightColor] = useState('#fadb14');

  const cleanText = (text: string) => {
    return text.replace(/[#*`~_]/g, '').trim();
  };

  const exportToPDF = async () => {
    if (!notesRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(notesRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
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

  const applyCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="brutalist-card bg-white p-4 flex flex-wrap items-center justify-between gap-4 border-black">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Font Selector */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Ink Style</span>
            <select 
              onChange={(e) => setActiveFont(e.target.value as FontStyle)}
              className="brutalist-input py-1 text-xs font-black uppercase tracking-tighter cursor-pointer"
            >
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
                  className={`px-3 py-2 transition-all ${paperStyle === s ? 'bg-primary text-white' : 'bg-white hover:bg-muted'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Formatting Tools */}
          <div className="h-10 w-px bg-black/10 mx-1" />
          <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Edit</span>
             <div className="flex gap-1">
                <button onClick={() => applyCommand('bold')} className="brutalist-button p-2 py-1 bg-white text-black text-xs min-w-8">B</button>
                <button onClick={() => applyCommand('italic')} className="brutalist-button p-2 py-1 bg-white text-black text-xs italic min-w-8">I</button>
             </div>
          </div>
          
          <div className="flex flex-col">
             <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Highlight</span>
             <div className="flex gap-1.5 items-center p-1 px-2 border-[3px] border-black rounded-lg bg-white h-[34px]">
                {['#fadb14', '#b7eb8f', '#91caff', '#ffadd2', '#efdbff'].map(color => (
                    <button 
                      key={color}
                      onClick={() => {
                        setHighlightColor(color);
                        applyCommand('backColor', color);
                      }}
                      className="w-4 h-4 rounded-full border border-black/20 hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: color }}
                    />
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
        ref={notesRef}
        className={`brutalist-card bg-white overflow-hidden ${activeFont} border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      >
        <div className={`notebook-paper ${paperStyle === 'grid' ? 'grid-paper' : paperStyle === 'blank' ? 'blank-paper' : ''}`}>
            <div 
              contentEditable 
              suppressContentEditableWarning
              className="text-5xl font-bold border-b-2 border-black/10 mb-10 pb-4 text-center italic tracking-tighter capitalize"
            >
              {notes.title.toLowerCase()}
            </div>

           {/* Section: Summary */}
           <div className="space-y-6 mb-16">
             <h3 className="text-3xl font-bold text-primary flex items-center gap-2 italic">
               <span className="not-italic text-2xl">⚡</span> Summary
             </h3>
             <div 
               contentEditable 
               suppressContentEditableWarning
               className="text-2xl leading-[1.6] outline-none tracking-tight"
             >
               {cleanText(notes.summary)}
             </div>
           </div>

           {/* Section: Key Points */}
           <div className="space-y-8">
             <h3 className="text-3xl font-bold text-secondary flex items-center gap-2 italic">
               <span className="not-italic text-2xl">✎</span> Core Insights
             </h3>
             <ul className="space-y-6">
                {notes.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-6 items-start">
                    <span className="text-primary mt-1 text-2xl">✎</span>
                    <div 
                      contentEditable 
                      suppressContentEditableWarning
                      className="text-2xl flex-1 outline-none leading-[1.5]"
                    >
                      {cleanText(point)}
                    </div>
                  </li>
                ))}
             </ul>
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
