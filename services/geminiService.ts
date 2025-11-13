
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  const prompt = `Create a captivating and short marketing description for a product.
  - Product Name: "${productName}"
  - Category: "${category}"
  
  Instructions:
  - Focus on its key benefits and unique appeal.
  - Keep the description under 50 words.
  - Use an enthusiastic and persuasive tone.
  - Do not use hashtags.
  - Return only the description text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    // Using response.text as per the new guidelines.
    const description = response.text;
    
    if (!description) {
      throw new Error("Received an empty response from Gemini API.");
    }
    
    return description.trim();
  } catch (error) {
    console.error("Error generating description from Gemini:", error);
    throw new Error("Failed to generate AI product description.");
  }
};
