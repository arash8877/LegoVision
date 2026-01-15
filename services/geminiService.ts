
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
  
  const prompt = `Analyze this photo with absolute, 100% surgical precision. 
  
  PHASE 0: VALIDATION
  First, determine if the image contains physical LEGO® bricks. 
  - If NO LEGO bricks are detected: You MUST return empty arrays for 'identifiedBricks', 'colorPalette', and 'suggestions'. Do not attempt to guess or invent builds.

  PHASE 1: INVENTORY (MANDATORY IF BRICKS PRESENT)
  Identify every single physical LEGO brick visible in the image. 
  - COUNT: Exactly how many of each unique brick exist.
  - TYPE/DIMENSIONS: Exact studs (e.g., "2x2", "1x4", "2x4").
  - COLOR: Exact color (e.g., "Bright Red", "Dark Blue", "Yellow").
  - CATEGORY: Brick, Plate, Slope, Tile, or Special.

  PHASE 2: SUGGESTIONS (STRICT ENHANCED COMPLEXITY CONSTRAINTS)
  Suggest EXACTLY 3 creative and highly detailed builds based ONLY on the inventory from Phase 1. 
  
  CRITICAL: You must aim for a complexity level at least 3x higher than a basic blocky representation. Do not suggest simple 5-10 piece models if the inventory allows for more.

  DIFFICULTY SCALING RULES (ENHANCED):
  You MUST provide a range of challenges that feel substantial and professional.
  1. ONE 'Easy' build: A solid, recognizable structure. Uses a significant portion of simple bricks to create a substantial form with clear proportions. 
  2. ONE 'Medium' build: High detail level. Incorporates layering (plates on bricks), texture, and clever piece usage to define features like eyes, wheels, or architectural details.
  3. ONE 'Hard' build: Maximum complexity. An intricate, dense model that utilizes nearly the entire suitable inventory. Includes fine details, internal sub-assemblies, and sophisticated shaping.
  
  If the inventory is very small, maximize the density of the 3 levels relative to what is possible. 

  ZERO HALLUCINATION INVENTORY RULES:
  1. NO EXTRA PIECES: If the image contains 5 red 2x4 bricks, a suggestion CANNOT use 6 red 2x4 bricks.
  2. NO SUBSTITUTIONS: If the user has a 2x4 brick, you cannot suggest they use two 2x2 bricks instead.
  3. NO COLOR CHANGES: You must use the exact colors identified in the image.
  4. PIECE DEPLETION: In a single build, once a physical brick is used in Step 1, it is gone. It cannot be used again in Step 2.
  5. SUBSET ONLY: Each build must be a subset of the total physical inventory identified in Phase 1.

  CRITICAL PHYSICAL CONNECTION RULES:
  1. STUD-TO-TUBE ONLY: Bricks must ONLY connect via studs on the top to tubes/holes on the bottom. 
  2. NO SIDE GLUING: Side-to-side connections without overlapping bricks to "lock" them are impossible.
  3. LEGAL TECHNIQUES ONLY: No "illegal" stress-inducing connections.

  VISUAL ICON RULES:
  - The 'icon' field MUST be a single representative emoji character only.

  Return the result in valid JSON format matching the schema provided.`;

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
            description: "Detailed list of every single brick identified (e.g. '1x Red 2x4 Brick', '3x Blue 1x2 Plate'). Empty if no LEGO found."
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
                icon: { 
                  type: Type.STRING,
                  description: "A single representative Emoji character only. Strictly no text."
                },
                description: { type: Type.STRING },
                difficulty: { 
                  type: Type.STRING,
                  description: "Must be exactly 'Easy', 'Medium', or 'Hard'"
                },
                estimatedPieces: { type: Type.NUMBER },
                requiredBricks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "The specific subset of identified bricks used, including their exact quantities and colors. Must not exceed total inventory."
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Detailed, step-by-step instructions (at least 5-10 steps) using ONLY the requiredBricks for this build."
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
    throw new Error("Could not analyze your bricks with the required precision. Please try again with a clearer photo.");
  }
}

export async function generateBuildImage(
  sourceImageBase64: string,
  title: string,
  requiredBricks: string[]
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a stylized cartoon illustration of the completed complex LEGO micro-build called "${title}". 
  
  STRICT INVENTORY ADHERENCE:
  You MUST visualize ONLY these specific pieces: ${requiredBricks.join(', ')}. 
  - Match colors exactly to the list.
  - Match dimensions (stud count) exactly to the list.
  - Do NOT add any extra pieces that are not in the list.

  PHYSICAL LOGIC & COMPLEXITY:
  - This is a high-detail model with many pieces layered together.
  - Every connection must be via studs (stud-to-tube).
  - Show depth, layering, and intricate shaping.

  VISUAL STYLE:
  - 2.5D perspective, clean thick black outlines.
  - Solid, consistent base colors (studs must match the brick body).
  - Professional UI illustration style on a pure white background.`;

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
