import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

async function summarizeWithHF(text: string, videoTitle: string, mode: string = 'Detailed'): Promise<any> {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) throw new Error('HUGGING_FACE_API_KEY is not configured');

  const hf = new HfInference(apiKey);
  
  const baseRules = "IMPORTANT RULES:\n" +
    "- PROHIBITED: Do not use markdown markers like ##, **, ***, _, or ` in your output.\n" +
    "- Use pure plain text. Structure using line breaks and clear spacing.\n" +
    "- Do not use any symbols that wouldn't be naturally handwritten in a real notebook.\n" +
    "- Provide clear, substantive explanations. Avoid vague or 'fluff' sentences.";

  let systemPrompt = "";
  if (mode === 'Quick') {
    systemPrompt = `${baseRules}\nYou are Video2Pen, a professional academic AI. Provide a RAPID summary of the following transcript. Be sharp, concise, and focus on the 'Big Picture'. Format as: 1. Executive Summary (max 100 words), 2. Top 3 Strategic Takeaways. Output must be clean plain text.`;
  } else if (mode === 'Exam') {
    systemPrompt = `${baseRules}\nYou are Video2Pen, an expert academic tutor. Identify all critical definitions, key formulas/logic, and formulate 5 potential exam questions. Format as: 1. Must-Know Concepts & Definitions, 2. Potential Exam Questions, 3. Cheat Sheet Summary. Output must be clean plain text.`;
  } else {
    systemPrompt = `${baseRules}\nYou are Video2Pen, a master note-taker. Provide exhaustive, hierarchical study notes. Use bullet points extensively. Contextualize every technical term or example mentioned in the video. Format as: 1. Comprehensive Summary, 2. Logical Themes & Narratives, 3. Detailed Concept Breakdown. Ensure the 'Detailed Concept Breakdown' is deep and provides real educational value. Output must be clean plain text.`;
  }

  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Video Title: ${videoTitle}\n\nTranscript: ${text.substring(0, 10000)}` }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content || "";
    const sections = content.split(/\n\d+\.\s+/).filter(Boolean);
    
    return {
      title: videoTitle,
      summary: sections[0] || "Summary not generated",
      keyPoints: Array.isArray(sections[1]) ? sections[1] : (sections[1]?.split('\n').filter(s => s.trim()) || []),
    };
  } catch (error: any) {
    console.error("Video2Pen Engine Error:", error);
    throw new Error(`Video2Pen generation failed: ${error.message}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoTitle, mode } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const aiResult = await summarizeWithHF(transcript, videoTitle || "Study Notes", mode);
    
    const stopwords = new Set(['the','and','to','of','in','a','is','that','for','it','on','with','as','you','this','be','are','from','at','or','an','was','can','we','what','by','not','if','they','but','your','about','which','their','has','will','how','when','there','more','all','out','up','so','one','do','summary','concepts','questions','cheat','sheet','academic','video2pen']);
    const words = transcript.toLowerCase().split(/[^a-z0-9]+/);
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
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
