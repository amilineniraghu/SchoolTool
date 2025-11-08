import { GoogleGenAI, Type } from "@google/genai";
import { MindMapNode } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractParagraphsFromImage = async (imageFile: File): Promise<string[]> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                parts: [
                    imagePart,
                    { text: "Extract all distinct paragraphs from this image. Return the result as a valid JSON array of strings. Each string in the array should be a single paragraph. For example: [\"This is the first paragraph.\", \"This is the second one.\"]" }
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                }
            }
        }
    });
    
    try {
        let jsonText = result.text.trim();
        
        // The model might wrap the JSON in markdown or add conversational text.
        // We will find the first '[' and the last ']' to extract the JSON array.
        const firstBracket = jsonText.indexOf('[');
        const lastBracket = jsonText.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket > firstBracket) {
            jsonText = jsonText.substring(firstBracket, lastBracket + 1);
        } else {
            throw new Error("No valid JSON array found in the model's response.");
        }

        const paragraphs = JSON.parse(jsonText);
        if (Array.isArray(paragraphs) && paragraphs.every(p => typeof p === 'string')) {
            return paragraphs;
        }
        throw new Error("Parsed JSON is not an array of strings.");
    } catch (e: any) {
        console.error("Failed to parse paragraphs JSON:", e.message);
        console.error("Raw model response for paragraphs:", result.text);
        throw new Error("Could not understand the text structure in the image. Please try another image.");
    }
};

export const generateMindMap = async (text: string): Promise<MindMapNode> => {
    const prompt = `Your task is to convert a given text into a hierarchical JSON structure for a mind map.

**CRITICAL INSTRUCTIONS:**
1.  **JSON ONLY:** Your entire response MUST be a single, valid JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
2.  **HIERARCHY:** The JSON must represent a tree with a root 'name' and an optional 'children' array for nested concepts.
3.  **CONCISE NAMES:** Every node's 'name' property MUST be a very short, concise summary of a concept, strictly between 2 and 5 words. This is the most important rule.
4.  **NO RAW TEXT:** Absolutely DO NOT copy sentences or large portions of the original text into the 'name' properties. You must summarize the concepts.
5.  **LOGICAL STRUCTURE:** The structure should go from the main topic to key concepts, then to supporting details. Keep the tree depth to a maximum of 4 levels for readability.

**EXAMPLE OUTPUT FORMAT:**
{
  "name": "Main Topic Example",
  "children": [
    {
      "name": "First Key Concept",
      "children": [
        { "name": "Supporting Detail 1A" },
        { "name": "Supporting Detail 1B" }
      ]
    },
    {
      "name": "Second Key Concept"
    }
  ]
}

**TEXT TO ANALYZE:**
---
${text}
---
`;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                required: ['name'],
                properties: {
                    name: { type: Type.STRING, description: "Main topic (2-5 words)." },
                    children: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            required: ['name'],
                            properties: {
                                name: { type: Type.STRING, description: "Key concept (2-5 words)." },
                                children: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        required: ['name'],
                                        properties: {
                                            name: { type: Type.STRING, description: "Supporting detail (2-5 words)." },
                                            children: { 
                                                type: Type.ARRAY, 
                                                items: { 
                                                    type: Type.OBJECT, 
                                                    required: ['name'],
                                                    properties: { 
                                                        name: { type: Type.STRING, description: "Sub-detail (2-5 words)." } 
                                                    }
                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    try {
        let jsonText = result.text.trim();
        
        // The model might wrap the JSON in markdown ```json ... ``` or add conversational text.
        // We will find the first '{' and the last '}' to extract the JSON object.
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonText = jsonText.substring(firstBrace, lastBrace + 1);
        } else {
            // If we can't find a JSON object, throw an error.
            throw new Error("No valid JSON object found in the model's response.");
        }

        return JSON.parse(jsonText) as MindMapNode;
    } catch (e: any) {
        console.error("Failed to parse mind map JSON:", e.message);
        console.error("Raw model response:", result.text); // Log raw response for easier debugging
        throw new Error("Could not generate a mind map from the selected text. The model returned an invalid format.");
    }
};