
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMotivationalMessage(score: number, levelName: string, userName: string, language: Language): Promise<string> {
  const languageName = language === 'ru' ? 'Russian' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very short, warm, and encouraging 1-sentence message in ${languageName} for an older adult named ${userName} who just completed a visual focus level called "${levelName}" with ${score} points. Address them by name. Make it sound gentle, like a supportive friend. No emojis.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text || (language === 'ru' ? `Отличная работа над уровнем, ${userName}!` : `Wonderful job on completing the scan, ${userName}!`);
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'ru' ? `Отлично, ${userName}! Ваша сосредоточенность впечатляет.` : `Great job, ${userName}! Your focus is truly impressive.`;
  }
}

export async function getCognitiveTip(language: Language): Promise<string> {
  const languageName = language === 'ru' ? 'Russian' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one simple, 1-sentence tip in ${languageName} for maintaining brain health or focus for older adults. Keep it positive and easy to understand.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text || (language === 'ru' ? "Регулярные прогулки и питьевой режим помогают лучше концентрироваться." : "Taking regular walks and staying hydrated can significantly help your focus.");
  } catch (error) {
    return language === 'ru' ? "Такие упражнения помогают сохранять ум ясным и острым." : "Gentle mental exercise like this helps keep the mind sharp and focused.";
  }
}
