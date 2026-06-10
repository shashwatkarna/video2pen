'use client';

import { useRef, useState, useEffect } from 'react';
import { marked } from 'marked';
import { usePostHog } from 'posthog-js/react';

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
  const [activeFont, setActiveFont] = useState<FontStyle>('font-handlee');
  const [htmlContent, setHtmlContent] = useState('');
  const [highlightColor, setHighlightColor] = useState('#fadb14');
  const posthog = usePostHog();

  useEffect(() => {
    const html = marked.parse(notes.markdownContent) as string;
    setHtmlContent(html);
  }, [notes.markdownContent]);

  const exportToPDF = async () => {
    if (!notesRef.current) return;
    try {
      posthog.capture('exported_notes_to_pdf', { title: notes.title });
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
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('video2pen-study-notes.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
    }
  };

  const applyCommand = (command: string, value?: string) => {
    posthog.capture('formatted_notes', { command, value });
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="brutalist-card bg-white p-4 flex flex-wrap items-center justify-between gap-4 border-black">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Font Selector */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase mb-1 tracking-widest pl-1">Typography</span>
            <select 
              value={activeFont}
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
                  className={`px-3 py-2 transition-all border-r-[3px] border-black last:border-r-0 ${paperStyle === s ? 'bg-primary text-white' : 'bg-white hover:bg-muted'}`}
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
        className={`brutalist-card bg-white overflow-hidden ${activeFont} border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
      >
        <div 
          ref={notesRef}
          className={`notebook-paper ${paperStyle === 'grid' ? 'grid-paper' : paperStyle === 'blank' ? 'blank-paper' : ''}`}
        >
            <div className="text-5xl font-bold border-b-[3px] border-black/10 mb-10 pb-4 text-center italic tracking-tighter capitalize">
              {notes.title.toLowerCase()}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
                font-weight: 900 !important;
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
                color: #000;
              }
              .markdown-body h1 { font-size: 2.5rem !important; line-height: 1.2 !important; }
              .markdown-body h2 { font-size: 2rem !important; line-height: 1.3 !important; border-bottom: 2px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; text-transform: uppercase; color: #1890ff; }
              .markdown-body h3 { font-size: 1.5rem !important; line-height: 1.4 !important; color: #52c41a; }
              .markdown-body p { margin-bottom: 1.2rem !important; line-height: 1.8 !important; font-size: 1.4rem !important; }
              .markdown-body ul, .markdown-body ol { margin-left: 2rem !important; margin-bottom: 1.5rem !important; font-size: 1.4rem !important; }
              .markdown-body ul { list-style-type: disc !important; }
              .markdown-body ol { list-style-type: decimal !important; }
              .markdown-body li { margin-bottom: 0.5rem !important; }
              .markdown-body strong { font-weight: 900 !important; color: #000 !important; }
              .markdown-body blockquote { border-left: 4px solid #fadb14 !important; background: rgba(250,219,20,0.1) !important; padding: 1rem !important; font-weight: bold !important; font-style: normal !important; margin-bottom: 1.5rem !important; }
              .markdown-body table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 2rem !important; font-size: 1.2rem !important; border: 3px solid #000 !important; background-color: #fff; }
              .markdown-body th, .markdown-body td { border: 2px solid #000 !important; padding: 0.75rem !important; text-align: left !important; }
              .markdown-body th { background-color: rgba(0,0,0,0.05) !important; font-weight: 900 !important; text-transform: uppercase; }
              .markdown-body hr { border: none; border-bottom: 2px dashed rgba(0,0,0,0.2); margin: 2rem 0; }
            `}} />

            <div 
              className="markdown-body outline-none min-h-[500px]"
              contentEditable 
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

           {/* Footer branding */}
           <div className="mt-32 pt-10 border-t-2 border-black/5 text-center opacity-40 text-sm italic tracking-widest font-black uppercase">
             Generated by Video2Pen.ai • {new Date().toLocaleDateString()}
           </div>
        </div>
      </div>
    </div>
  );
}
