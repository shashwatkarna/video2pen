import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { transcript, messages, videoTitle } = await request.json();

    if (!transcript || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Transcript and messages array are required' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error('GROQ_API_KEY is missing in .env.local.');
    }

    const groq = new Groq({ apiKey: groqKey });

    const systemPrompt = `You are Video2Pen's AI Tutor. You are helping the user understand a video titled "${videoTitle || 'Study Video'}". 
Here is the video transcript:
---
${transcript.substring(0, 50000)}
---

Your Goal:
- Answer the user's questions clearly, concisely, and accurately based ONLY on the provided transcript.
- If the answer is not in the transcript, admit you don't know based on the video context.
- Use simple markdown formatting (bolding, lists) to make your answers readable.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role,
        content: m.content
      }))
    ];

    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
    });

    const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed';
    console.error('[Chat API Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
