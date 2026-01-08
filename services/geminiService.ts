
import { GoogleGenAI, Type } from "@google/genai";
import { VisionAnalysis } from "../types";

/**
 * Strictly follows @google/genai guidelines:
 * - Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
 * - Direct use of .text property for responses
 * - Correct model names
 */

export async function analyzeBrickPile(base64Image: string): Promise<VisionAnalysis> {
  // Use process.env.API_KEY directly in the constructor per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this photo of LEGO bricks. 
  1. Identify the key types of bricks visible (plates, bricks, slopes, etc.).
  2. Determine the dominant colors.
  3. Suggest exactly 3 creative "micro-build" ideas that could be made with a subset of these bricks.
  
  DIFFICULTY RULES:
  - If the pile is large (>30 bricks), include 1 Easy, 1 Medium, and 1 Hard build.
  - If the pile is small (<30 bricks), provide only Easy and Medium builds.
  
  Return the result in valid JSON format matching the schema provided.`;

  // Define model name directly within the generateContent parameters
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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
            items: { type: Type.STRING }
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
                difficulty: { 
                  type: Type.STRING,
                  description: "Must be 'Easy', 'Medium', or 'Hard'"
                },
                estimatedPieces: { type: Type.NUMBER },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "icon", "description", "difficulty", "estimatedPieces", "steps"]
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
  steps: string[],
  estimatedPieces: number
): Promise<string> {
  // Use process.env.API_KEY directly in the constructor per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Based on the bricks in the provided photo, generate a high-quality, professional photograph of a completed LEGO micro-build of a "${title}". 
  
  The build should:
  1. Use only colors and basic shapes seen in the pile.
  2. Be at a "micro-scale" using approximately ${estimatedPieces} pieces.
  3. Look like an official LEGO "Creator" set box art or instruction final photo.
  4. Shot in a clean, brightly lit studio environment.`;

  // Define model name directly within the generateContent parameters
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: sourceImageBase64, mimeType: "image/jpeg" } },
        { text: prompt }
      ]
    },
  });

  const part = result.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (part?.inlineData?.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Image generation failed");
}
