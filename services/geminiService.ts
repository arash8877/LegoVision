
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
  
  TASK 1: Create a precise inventory of all visible bricks. Note their exact size (e.g., 2x4, 1x2, 1x1), shape (brick, plate, slope), and color.
  TASK 2: Suggest exactly 3 creative "micro-build" ideas.
  
  STRICT CONSTRAINTS FOR SUGGESTIONS:
  1. INVENTORY ONLY: Each suggested build MUST use ONLY the exact bricks found in the photo. 
  2. NO INVENTING: Do not suggest pieces that aren't clearly visible (e.g., don't use a 2x4 green brick if the photo only has a 1x4 green brick).
  3. NO SUBSTITUTIONS: Do not use different colors or sizes than those identified.
  4. SUBSET RULE: Each build should be a strict subset of the total pile.
  
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
            items: { type: Type.STRING },
            description: "List of all unique bricks identified in the photo (e.g. 'Red 2x4 Brick', 'Blue 2x2 Plate')"
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
                requiredBricks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "The specific subset of identified bricks used in this build."
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
  
  // Refined prompt to strictly use the identified brick list
  const prompt = `Generate a stylized, high-quality cartoon-style illustration of a completed LEGO micro-build called "${title}". 
  
  CONSTRUCTION CONSTRAINT:
  The build must be illustrated using ONLY this exact list of bricks: ${requiredBricks.join(', ')}.
  DO NOT add any extra pieces. DO NOT use different colors or sizes. The illustration must be a physically accurate representation of a build using ONLY those pieces.
  
  STYLE REQUIREMENTS:
  1. CARTOON ILLUSTRATION: Clean 2.5D perspective, bold black outlines (line-art style).
  2. FLAT COLORS: Playful, vibrant LEGO colors matching the provided list.
  3. GEOMETRY: Smooth rounded corners and simplified brick shapes.
  4. STUDS: Simple cylindrical studs with a small highlight on the top left.
  5. ENVIRONMENT: Isolated on a clean, solid white background.
  
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
