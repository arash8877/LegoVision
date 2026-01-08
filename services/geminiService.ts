
import { GoogleGenAI, Type } from "@google/genai";
import { VisionAnalysis } from "../types";

/**
 * Strictly follows @google/genai guidelines:
 * - Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
 * - Direct use of .text property for responses
 * - Correct model names
 */

export async function analyzeBrickPile(base64Image: string): Promise<VisionAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this photo of LEGO bricks. 
  1. Identify the key types of bricks visible (plates, bricks, slopes, etc.).
  2. Determine the dominant colors.
  3. Suggest exactly 3 creative "micro-build" ideas that could be made with a subset of these bricks.
  
  DIFFICULTY RULES:
  - If the pile is large (>30 bricks), include 1 Easy, 1 Medium, and 1 Hard build.
  - If the pile is small (<30 bricks), provide only Easy and Medium builds.
  
  Return the result in valid JSON format matching the schema provided.`;

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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Updated prompt to strictly request the stylized cartoon UI aesthetic
  const prompt = `Generate a stylized, high-quality cartoon-style illustration of a completed LEGO micro-build of a "${title}". 
  
  STYLE REQUIREMENTS (MATCH EXACTLY):
  1. CARTOON ILLUSTRATION: Clean 2.5D perspective, bold black outlines (line-art style).
  2. FLAT COLORS: Playful, vibrant LEGO colors with very subtle shading.
  3. GEOMETRY: Smooth rounded corners and simplified brick shapes.
  4. STUDS: Simple cylindrical studs with a small highlight on the top left.
  5. ENVIRONMENT: Isolated on a clean, solid white background. No background clutter.
  
  DO NOT generate a photograph. DO NOT use realistic textures or plastic noise. 
  The final result must look like a professional modern UI illustration.`;

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
