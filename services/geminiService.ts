import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateQuiz = async (topic: string, difficulty: string): Promise<Question[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a fun and engaging multiple-choice quiz about "${topic}".
  Difficulty level: ${difficulty}.
  Create exactly 5 questions.
  Each question must have 4 options.
  Make sure one option is clearly correct.
  Include a short, interesting explanation for the answer.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN }
                },
                required: ['text', 'isCorrect']
              }
            },
            explanation: { type: Type.STRING }
          },
          required: ['questionText', 'options', 'explanation']
        }
      }
    }
  });

  const rawData = JSON.parse(response.text || "[]");

  // Transform to our internal type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawData.map((q: any) => ({
    id: generateId(),
    text: q.questionText,
    explanation: q.explanation,
    options: q.options.map((opt: { text: string; isCorrect: boolean }) => ({
      id: generateId(),
      text: opt.text,
      isCorrect: opt.isCorrect
    }))
  }));
};
