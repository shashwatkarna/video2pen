'use client';

import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  transcript: string;
  videoTitle: string;
}

export default function ChatWidget({ transcript, videoTitle }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Tutor. Ask me anything about this video!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          videoTitle,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error('Chat failed');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Sorry, I encountered an error trying to answer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 bg-primary text-white border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl hover:-translate-y-1 transition-transform z-50 animate-bounce"
          title="Chat with Notes"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 border-b-[3px] border-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-black uppercase tracking-tighter leading-none">AI Tutor</h3>
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Ask about the video</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-black hover:bg-white border-2 border-transparent hover:border-black rounded p-1 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fdfdf0]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 border-[2px] border-black rounded-xl text-sm font-bold ${
                    msg.role === 'user' 
                      ? 'bg-accent text-black rounded-tr-none' 
                      : 'bg-white text-black rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div 
                      className="prose prose-sm max-w-none prose-p:leading-snug prose-p:mb-2 last:prose-p:mb-0 prose-strong:font-black"
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) as string }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-[2px] border-black rounded-xl rounded-tl-none p-3 text-sm font-bold animate-pulse">
                  Thinking... 💭
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t-[3px] border-black">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 border-[2px] border-black rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-secondary text-white border-[2px] border-black rounded-lg px-4 font-black uppercase hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
