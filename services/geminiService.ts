
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
  
  const prompt = `Analyze this photo of LEGO bricks with 100% precision. 
  
  STEP 1: Create an exact count and inventory of every brick visible. 
  - Note dimensions exactly (e.g., "1x4" is different from "2x4").
  - Note quantity exactly (e.g., if there is only one "1x1 Red Brick", you cannot use two).
  - Note colors exactly.

  STEP 2: Suggest 3 creative "micro-build" ideas.
  
  CRITICAL CONSTRAINTS FOR BUILD SUGGESTIONS:
  1. PHYSICAL POSSIBILITY: A human must be able to build this using ONLY the pieces in the photo.
  2. STRICT BRICK COUNT: If the photo has one Green 1x4, the build MUST NOT use more than one Green 1x4. It cannot use a Green 2x4 if one isn't there.
  3. NO SUBSTITUTIONS: Do not invent, hallucinate, or substitute any bricks.
  4. NO PIECE DUPLICATION: You cannot use the same physical brick for two different parts of the same build.

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
            description: "Detailed list of all bricks identified (e.g. '1x Red 2x4 Brick', '2x Blue 1x2 Plate')"
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
                  description: "The specific subset of identified bricks used, including their exact quantities."
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
  
  const prompt = `Generate a stylized cartoon illustration of a completed LEGO micro-build called "${title}". 
  
  STRICT BRICK ADHERENCE:
  Use ONLY these bricks: ${requiredBricks.join(', ')}. 
  - Do not use more bricks than listed. 
  - Match dimensions perfectly (e.g., if a 1x4 is listed, use a 1x4, NOT a 2x4).

  VISUAL CONSISTENCY RULES:
  1. UNIFORM COLOR: Each brick must have a single, consistent base color. The sides of the brick must be the same color as the top (only slightly darker for shading).
  2. MATCHING STUDS: The circular studs on top of each brick MUST be the exact same color as the brick's body.
  3. CARTOON STYLE: 2.5D perspective, thick black outlines, flat colors.
  4. NO TEXTURES: No plastic grain, no logos, no stickers. Just clean, stylized shapes.
  5. BACKGROUND: Solid, clean white background only.

  The final result must look like a professional, clean UI illustration with perfectly consistent colors for each piece.`;

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
