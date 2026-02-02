import { GoogleGenAI, Type } from "@google/genai";
import { getMockGeminiReport } from "../data/mockGeminiData";
import { ARCHETYPES } from "../data/archetypes";

/**
 * GEMINI INTELLIGENCE SERVICE
 * ---------------------------------------------------------------------------
 * This service handles the "Intelligence Pipeline" of Rewind.
 * It takes normalized Spotify telemetry and transforms it into a 
 * psychological/musicological narrative using Gemini 3 Flash.
 */

interface GenerationOptions {
  useDummy?: boolean;
  spotifyStats?: any;
  onLog?: (msg: string) => void;
}

export async function generateMusicReport({ 
  useDummy = false, 
  spotifyStats = null, 
  onLog 
}: GenerationOptions = {}) {
  
  /**
   * SIMULATION MODE
   * If the user is in Dummy Mode or lacks an API key, we use a 
   * deterministic logic-based approach to select a fitting mock report.
   */
  if (useDummy || !process.env.API_KEY) {
    if (onLog) onLog("Intelligence: Utilizing dummy simulation logic.");
    // Simulate network latency for UX realism
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const audioFeatures = spotifyStats?.stats?.audioFeatures || { energy: 0.5 };
    let mockId = '04'; // Default to Mood Architect
    
    // Heuristic selection for dummy mode
    if (audioFeatures.energy > 0.8) mockId = '06'; // Rhythm Rebel
    else if (audioFeatures.acousticness > 0.7) mockId = '05'; // Soul Seeker
    else if (audioFeatures.danceability > 0.7) mockId = '02'; // Trendsetter
    
    return {
      ...getMockGeminiReport(mockId),
      lastGenerated: new Date().toISOString()
    };
  }

  // Initialize the GenAI Client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  /**
   * RESPONSE SCHEMA DEFINITION
   * We use a strict schema to ensure the AI returns structured JSON 
   * that matches our application's UI requirements.
   */
  const reportSchema = {
    type: Type.OBJECT,
    properties: {
      archetypeId: { type: Type.STRING },
      whyArchetype: { type: Type.STRING, description: "A paragraph explaining why the user fits this specific archetype based on their data." },
      musicalDNA: { type: Type.STRING, description: "A description of their overall music taste and sonic preferences." },
      emotionalBias: { type: Type.STRING, description: "A one or two word emotional mood label." },
      sonicSignature: { type: Type.STRING, description: "A punchy summary of their sound." },
      maxValencePercent: { type: Type.NUMBER, description: "0-100 score of how happy/positive the music is." },
      genreAnalysis: { type: Type.STRING, description: "A paragraph analyzing their favorite genres." },
      emotionalLandscape: { type: Type.STRING, description: "A paragraph about the emotional themes in their library." }
    },
    required: ["archetypeId", "whyArchetype", "musicalDNA", "sonicSignature", "emotionalBias", "maxValencePercent", "genreAnalysis", "emotionalLandscape"]
  };

  try {
    // PREPARE CONTEXT: Extract key strings for the prompt
    const currentStats = spotifyStats?.stats || spotifyStats;
    const artists = currentStats?.['4w']?.artists?.slice(0, 15).map((a: any) => a.name).join(', ') || "Unknown";
    const features = JSON.stringify(currentStats?.audioFeatures || {});
    const genres = Array.from(new Set(currentStats?.['4w']?.artists?.flatMap((a: any) => a.genres || []))).slice(0, 10).join(', ') || "Various";

    /**
     * PROMPT ENGINEERING
     * We frame the request as a "professional musicological analysis" to 
     * encourage a sophisticated tone rather than generic AI output.
     */
    const prompt = `
      Perform a professional psychological and musicological analysis of this listener profile.
      USER DATA: 
      Top Artists: ${artists}
      Top Genres: ${genres}
      Audio Characteristics (energy, danceability, valence, etc): ${features}

      AVAILABLE ARCHETYPES: 
      ${ARCHETYPES.map(a => `${a.id}: ${a.name} (${a.description})`).join('\n')}

      TASKS:
      1. Assign the most fitting archetype ID from the list provided.
      2. Explain explicitly WHY they are that archetype using the provided data points.
      3. Analyze their musical DNA, genres, and emotional landscape.

      Return JSON following the strict schema. Tone: Sophisticated music journalism. Provide deep, non-obvious insights.
    `;

    // Updated log to reflect the use of Gemini 3 Flash
    if (onLog) onLog("Intelligence: Initiating Gemini 3 Flash inference sequence.");

    // EXECUTE INFERENCE
    // Use gemini-3-flash-preview as recommended for text tasks in the latest guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema as any,
        temperature: 0.75 // Slight creativity allowed for narrative flair
      }
    });

    const rawText = response.text || "{}";
    const aiResponse = JSON.parse(rawText.trim());
    
    // MAPPING AI OUTPUT TO UI STATE
    const selectedId = aiResponse.archetypeId || '04';
    const baseTemplate = getMockGeminiReport(selectedId);

    /**
     * DATA ENRICHMENT
     * We merge the AI's narrative with static archetype assets (icons, bg text)
     * to create the final Report JSON.
     */
    return {
      ...baseTemplate,
      lastGenerated: new Date().toISOString(),
      emotional: {
        bias: aiResponse.emotionalBias || baseTemplate.emotional.bias,
        maxValence: Math.min(100, Math.max(0, aiResponse.maxValencePercent || baseTemplate.emotional.maxValence))
      },
      aiGeneratedText: {
        ...baseTemplate.aiGeneratedText,
        whyArchetype: aiResponse.whyArchetype || "Your unique profile perfectly aligns with this identity.",
        musicalDNA: aiResponse.musicalDNA || baseTemplate.aiGeneratedText.musicalDNA,
        sonicSignature: aiResponse.sonicSignature || baseTemplate.aiGeneratedText.sonicSignature,
        genreAnalysis: aiResponse.genreAnalysis || baseTemplate.aiGeneratedText.genreAnalysis,
        emotionalLandscape: aiResponse.emotionalLandscape || baseTemplate.aiGeneratedText.emotionalLandscape
      }
    };
  } catch (err: any) {
    if (onLog) onLog(`Error: Sequence failure - ${err.message}`);
    throw err;
  }
}