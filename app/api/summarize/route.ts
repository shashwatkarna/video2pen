import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export const maxDuration = 300; // 5 minutes max duration

async function generateAIResponse(text: string, videoTitle: string, systemPrompt: string): Promise<any> {
  const useLocal = process.env.USE_LOCAL_AI === 'true';
  const model = useLocal ? (process.env.LOCAL_AI_MODEL || 'llama3.2') : 'Qwen/Qwen2.5-72B-Instruct';

  let content = "";

  if (useLocal) {
    console.log(`[Video2Pen] Starting Local Inference with ${model}...`);
    try {
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            // Reduced to 15,000 for maximum stability on non-GPU hardware
            { role: "user", content: `Video Title: ${videoTitle}\n\nTranscript: ${text.substring(0, 15000)}` }
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama Error: ${response.statusText}. Ensure Ollama is running and '${model}' is downloaded.`);
      }

      const data = await response.json();
      content = data.message?.content || "";
      console.log(`[Video2Pen] Local Inference Complete.`);
    } catch (err: any) {
      console.error(`[Video2Pen] Local Inference Failed:`, err);
      throw new Error(`Local AI failed: ${err.message}. Ensure Ollama is running at 127.0.0.1:11434`);
    }
  } else {
    // ... rest of the logic remains same for HF ...
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) throw new Error('HUGGING_FACE_API_KEY is not configured');
    const hf = new HfInference(apiKey);

    try {
      const hfResponse = await hf.chatCompletion({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Video Title: ${videoTitle}\n\nTranscript: ${text.substring(0, 40000)}` }
        ],
        max_tokens: 4000,
        temperature: 0.5,
      });
      content = hfResponse.choices[0].message.content || "";
    } catch (error: any) {
      console.error("Video2Pen Engine Error:", error);
      if (error.message.includes("depleted") || error.message.includes("402")) {
        throw new Error("HUGGING_FACE_LIMIT: You have depleted your monthly included credits. Switch to Local AI in .env.local or upgrade your plan.");
      }
      throw new Error(`Video2Pen generation failed: ${error.message}`);
    }
  }

  // Robust HTML splitting
  let summary = "Summary not generated.";
  let keyPoints: string[] = [];

  if (content.includes('|||SPLIT|||')) {
    const parts = content.split('|||SPLIT|||');
    summary = parts[0].trim();
    const kpSection = parts[1] || "";
    
    if (kpSection.includes('|||ITEM|||')) {
      keyPoints = kpSection.split('|||ITEM|||').map(s => s.trim()).filter(s => s.length > 5);
    } else {
      keyPoints = [kpSection.trim()];
    }
  } else {
    summary = content.trim();
    keyPoints = ["Detailed analytical points were merged into the summary above."];
  }

  return {
    title: videoTitle,
    summary,
    keyPoints,
  };
}

const systemPrompt = `You are Video2Pen, a master note-taker and academic tutor. 
Your goal is to parse the video transcript and produce incredibly deep, highly-structured, human-like handwritten notes.
- Use basic HTML tags to format your output (<b> for bolding key terms, <br> for spacing, <ul><li> for nested lists, <i> for emphasis).
- Do not use markdown like ** or ##.
- Highlight important topics dynamically.

You MUST format your ONLY output exactly as two sections divided by "|||SPLIT|||".
Section 1 (Summary): A cohesive, multi-paragraph conceptual overview.
|||SPLIT|||
Section 2 (Key Points): A list of extremely detailed bullet points, separated by "|||ITEM|||". Each item should be a deep dive into specific concepts, formulas, or themes discussed in the video.`;

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoTitle } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const aiResult = await generateAIResponse(transcript, videoTitle || "Study Notes", systemPrompt);
    
    // Auto-generate high-impact topics from transcript
    const stopwords = new Set(['the','and','to','of','in','a','is','that','for','it','on','with','as','you','this','be','are','from','at','or','an','was','can','we','what','by','not','if','they','but','your','about','which','their','has','will','how','when','there','more','all','out','up','so','one','do','summary','concepts','questions','cheat','sheet','academic','video2pen']);
    const words = transcript.toLowerCase().split(/[^a-z0-9]+/);
    const wordFreq: Record<string, number> = {};
    words.forEach((word: string) => {
      if (word.length > 5 && !stopwords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const topics = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    return NextResponse.json({
      success: true,
      title: aiResult.title,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      topics: topics.length > 0 ? topics : ["General Study"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
