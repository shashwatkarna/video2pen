import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

function getMBartLang(ytLang: string): string {
  const map: Record<string, string> = {
    'en': 'en_XX', 'es': 'es_XX', 'fr': 'fr_XX', 'de': 'de_DE',
    'ar': 'ar_AR', 'hi': 'hi_IN', 'it': 'it_IT', 'ja': 'ja_XX',
    'ko': 'ko_KR', 'nl': 'nl_XX', 'ro': 'ro_RO', 'ru': 'ru_RU',
    'tr': 'tr_TR', 'vi': 'vi_VN', 'zh': 'zh_CN', 'pt': 'pt_XX',
    'sv': 'sv_SE', 'th': 'th_TH', 'uk': 'uk_UA', 'pl': 'pl_PL',
    'id': 'id_ID', 'bn': 'bn_IN', 'ur': 'ur_PK', 'ps': 'ps_AF'
  };
  const prefix = ytLang ? ytLang.split('-')[0].toLowerCase() : 'en';
  return map[prefix] || 'en_XX';
}

async function summarizeWithHF(text: string, targetLang: string, sourceLangCode: string): Promise<string> {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('HUGGING_FACE_API_KEY is not configured');
  }

  const hf = new HfInference(apiKey);
  const src_lang = getMBartLang(sourceLangCode);
  
  // Limit text to first 3000 chars to avoid taking a decade translating linearly chunk by chunk
  const truncatedText = text.length > 3000 ? text.substring(0, 3000) : text;
  
  const maxLength = 1000;
  const chunks = [];
  
  for (let i = 0; i < truncatedText.length; i += maxLength) {
    chunks.push(truncatedText.substring(i, i + maxLength));
  }

  const summaryPromises = chunks.map(async (chunk) => {
    let retries = 3;
    let success = false;
    let textResult = '';
    
    while (retries > 0 && !success) {
      try {
        // MBart strictly requires translation task with explicit src_lang and tgt_lang
        const result = await hf.translation({
          model: 'facebook/mbart-large-50-many-to-many-mmt',
          inputs: "Summary: " + chunk,
          parameters: {
            src_lang, // Dynamic Source language map
            tgt_lang: targetLang === 'Hindi' ? 'hi_IN' : 'en_XX'
          }
        });

        if (result && result.translation_text) {
           textResult = result.translation_text;
        }
        success = true;
      } catch (error: any) {
        if (error.message?.includes('loading') || retries > 1) {
          await new Promise(r => setTimeout(r, 2000));
          retries--;
        } else {
          // If all retries fail, return empty so it doesn't crash the entire Promise.all
          console.warn("Failed chunk translation:", error.message);
          success = true;
        }
      }
    }
    return textResult;
  });

  const summaryParts = await Promise.all(summaryPromises);
  return summaryParts.filter(Boolean).join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, language, sourceLangCode } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    // Get AI summary from MBART model
    const rawSummary = await summarizeWithHF(transcript, language, sourceLangCode);
    
    // Ensure we don't return an empty summary if HF fails silently
    const summaryText = rawSummary.trim() || transcript.substring(0, 1000) + '...';

    // Parse out Key Points (e.g. split by sentences or newlines out of the summary)
    const sentences = summaryText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 8); // top 8 concepts
      
    // Better simple topic extraction (filter out stop words)
    const stopwords = new Set(['the','and','to','of','in','a','is','that','for','it','on','with','as','you','this','be','are','from','at','or','an','was','can','we','what','by','not','if','they','but','your','about','which','their','has','will','how','when','there','more','all','out','up','so','one','do','summary']);
    const words = transcript.toLowerCase().split(/[^a-z0-9]+/);
    const wordFreq: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 4 && !stopwords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const topics = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1)); // Capitalize

    return NextResponse.json({
      success: true,
      summary: summaryText,
      keyPoints: sentences.length > 0 ? sentences : ["No clear points could be extracted."],
      topics: topics.length > 0 ? topics : ["General"],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Summarization failed';
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
