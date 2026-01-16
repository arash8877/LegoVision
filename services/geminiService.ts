
import { GoogleGenAI, Type } from "@google/genai";
import { VisionAnalysis, DiscoverItem } from "../types";

// Local session cache for discovery results to bypass AI calls for identical recent queries
const discoveryCache = new Map<string, DiscoverItem[]>();

export async function analyzeBrickPile(base64Image: string): Promise<VisionAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this photo of LEGO® bricks and identify the pieces available. 
  
  1. Identify every physical LEGO brick visible.
  2. Suggest 3 creative micro-builds that can be made using ONLY the identified pieces.
  3. For each suggestion, provide a title, an emoji icon, a brief description, difficulty level, estimated piece count, and step-by-step building instructions.

  Rules:
  - Do not suggest builds that require pieces not visible in the image.
  - Each physical brick can only be used once in a single build.
  - Return the results in valid JSON format matching the provided schema.`;

  const result = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identifiedBricks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of identified bricks."
          },
          colorPalette: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                icon: { type: Type.STRING },
                description: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                estimatedPieces: { type: Type.NUMBER },
                requiredBricks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "icon", "description", "difficulty", "estimatedPieces", "requiredBricks", "steps"]
            }
          }
        },
        required: ["identifiedBricks", "colorPalette", "suggestions"]
      }
    }
  });

  try {
    const jsonStr = result.text || "";
    if (!jsonStr) throw new Error("Empty response from AI");
    return JSON.parse(jsonStr) as VisionAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not analyze your bricks. Please try again with a clearer photo.");
  }
}

export async function generateBuildImage(
  sourceImageBase64: string,
  title: string,
  requiredBricks: string[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a stylized cartoon illustration of a LEGO micro-build called "${title}". 
  Use these pieces: ${requiredBricks.join(', ')}. 
  The style should be clean with thick outlines on a white background.`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: sourceImageBase64, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const part = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData?.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Image generation failed");
}

/**
 * Optimized Discovery Service
 * Uses Gemini-3-Flash for lower latency and better responsiveness.
 */
export async function getDiscoveryData(topic: string, query: string = "", page: number = 1): Promise<DiscoverItem[]> {
  const cacheKey = `${topic}-${query}-${page}`;
  if (discoveryCache.has(cacheKey)) {
    return discoveryCache.get(cacheKey)!;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const searchQueryText = query ? ` specifically searching for "${query}"` : " trending and iconic entries";
  const offsetText = page > 1 ? ` (Batch ${page})` : "";
  
  // Refined prompt for speed - less conversational, more directive
  const prompt = `JSON ONLY. 15 items. Topic: LEGO ${topic}${searchQueryText}.${offsetText}. 
  Reference: Rebrickable, Brickset, BrickLink. 
  Each item must have: id, title, type, year, pieceCount, description, funFacts (2), theme, rarity, marketPrice.
  Output image URLs matching official CDN patterns if possible.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched to Flash for significantly faster response times
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            type: { type: Type.STRING },
            year: { type: Type.STRING },
            pieceCount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            funFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
            theme: { type: Type.STRING },
            subtheme: { type: Type.STRING },
            rarity: { type: Type.STRING },
            marketPrice: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "title", "type", "description", "funFacts", "rarity"]
        }
      }
    }
  });

  const rawJson = response.text || "[]";
  const items: any[] = JSON.parse(rawJson);
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sourceUrls = groundingChunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri)
    .map((web: any) => ({ title: web.title, uri: web.uri }));

  const processed = items.map(item => {
    let imageUrl = item.imageUrl;
    const cleanId = String(item.id).replace(/-1$/, '').trim();
    
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.length < 10) {
      if (topic === 'sets') {
        imageUrl = `https://images.brickset.com/sets/images/${cleanId}.jpg`;
      } else if (topic === 'pieces') {
        imageUrl = `https://img.bricklink.com/ItemImage/PN/0/${cleanId}.png`;
      } else if (topic === 'minifigures') {
        imageUrl = `https://img.bricklink.com/ItemImage/MN/0/${cleanId}.png`;
      } else {
        imageUrl = `https://placehold.co/600x400/0055BF/FFFFFF?text=${encodeURIComponent(item.title)}`;
      }
    }

    return {
      ...item,
      imageUrl,
      sourceUrls: sourceUrls.slice(0, 3)
    };
  });

  discoveryCache.set(cacheKey, processed);
  return processed;
}
