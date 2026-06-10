import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { CohereClient } from 'cohere-ai';
import OpenAI from 'openai';

export const maxDuration = 300; // 5 minutes max duration

const quickPrompt = `You are Video2Pen, a master note-taker. Your goal is to parse the transcript and produce a fast, 30-second read.
Output ONLY beautifully formatted Markdown. Do not use HTML tags. You MUST use the exact markdown headers (including the ## symbols).

# Output Structure

## TL;DR
(One or two sentences summarizing the core message)

## Key Takeaways
- (Point 1)
- (Point 2)
- ...

## Action Items
- Do (X)
- Avoid (Y)
- Try (Z)

## Important Numbers & Facts
- (Statistics, metrics, dates, or core facts)

## Quote of the Video
> (The most impactful statement or quote)`;

const detailedPrompt = `You are Video2Pen, a master note-taker. Your goal is to parse the transcript and produce a deep, 5-minute read for learning and reference.
Output ONLY beautifully formatted Markdown. Do not use HTML tags. Use markdown tables where requested. You MUST use the exact markdown headers (including the ## and ### symbols).

# Output Structure

## Video Overview
(What the video is about in detail)

## Main Concepts
### (Concept 1 Name)
(Detailed Explanation)
### (Concept 2 Name)
(Detailed Explanation)

## Key Definitions
| Term | Definition |
|------|------------|
| (Term 1) | (Definition 1) |

## Frameworks Mentioned
(List and explain any step-by-step frameworks. If none, say "No specific frameworks mentioned.")

## Examples & Case Studies
(Real-world examples discussed)

## Tools & Resources
- (Tool A)
- (Website B)

## Important Insights
(Key lessons and takeaways)

## Common Mistakes
(Things to avoid or pitfalls mentioned)

## Action Plan
(Step-by-step implementation guide)

## Chronological Flow
(A chronological breakdown of the video's flow)`;

const examPrompt = `You are Video2Pen, a master note-taker and academic tutor. Your goal is to parse the transcript and produce study notes tailored for students and competitive exams.
Output ONLY beautifully formatted Markdown. Do not use HTML tags. Use markdown tables where requested. You MUST use the exact markdown headers (including the ## and ### symbols).

# Output Structure

## Chapter Summary
(Short overview of the academic/technical content)

## Key Concepts
### (Concept 1)
(Definition and deep explanation)
### (Concept 2)
(Definition and deep explanation)

## Important Definitions
- **(Definition 1)**: (Explanation)
- **(Definition 2)**: (Explanation)

## Formulae / Equations
(If present, write them out clearly, e.g., ROI = Profit / Investment. If none, write "No mathematical formulas discussed.")

## Facts to Remember
- (Fact 1)
- (Fact 2)

## Mnemonics
(Generate creative memory tricks or acronyms automatically)

## Flashcards
**Q:** (Question 1)
**A:** (Answer 1)

**Q:** (Question 2)
**A:** (Answer 2)

## Potential Exam Questions
### Easy
- (Question)
### Medium
- (Question)
### Hard
- (Question)

## 1-Minute Revision Sheet
**KEYWORDS:**
- (Word 1), (Word 2), (Word 3)

**FORMULAS:**
- (List)

**TOP INSIGHT:**
(The single most important thing to remember before the exam)`;


async function generateAIResponse(text: string, videoTitle: string, mode: string): Promise<any> {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error('GROQ_API_KEY is missing in .env.local.');
  }

  const groq = new Groq({ apiKey: groqKey });
  let content = "";
  let systemPrompt = "";

  console.log(`[Video2Pen] Executing mode: ${mode}`);

  if (mode === 'Quick') {
    systemPrompt = quickPrompt;
  } else if (mode === 'Detailed') {
    systemPrompt = detailedPrompt;
  } else if (mode === 'Exam') {
    systemPrompt = examPrompt;
  } else {
    throw new Error('Invalid mode selected');
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Video Title: ${videoTitle}\n\nTranscript: ${text.substring(0, 20000)}` },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });
    content = response.choices[0]?.message?.content || "";
  } catch (err: any) {
    throw new Error(`Groq generation failed: ${err.message}`);
  }

  return {
    title: videoTitle,
    markdownContent: content.trim()
  };
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoTitle, mode } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const aiResult = await generateAIResponse(transcript, videoTitle || "Study Notes", mode || "Detailed");
    
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
      markdownContent: aiResult.markdownContent,
      topics: topics.length > 0 ? topics : ["General Study"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
