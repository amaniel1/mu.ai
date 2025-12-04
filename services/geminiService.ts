import { GoogleGenAI, Content, Part } from "@google/genai";
import { UserProfile, ModelMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const specificIdentityAnswer = "I am Mekelle University student's assistant created by Amaniel Niguse, a senior student in Mekelle University in the Department of Economics. Contact my creator Telegram = @Amax.V2  Email = amanial.v2@gmail.com\n Thank you @2025 Amaniel Niguse";

const SYSTEM_PROMPT = `Your name is "Mekelle University student's assistant". 
If a user asks "who are you?", "who created you?", "who made you?", "your creator", "your name" or any question directly related to your identity or origin, you MUST answer ONLY with the following exact sentence: "${specificIdentityAnswer}". 
For all other queries, act as a helpful, knowledgeable, and friendly AI assistant for students of Mekelle University. You can analyze images, PDF documents, and plain text files. If you need to output mathematical formulas, use **LaTeX syntax (e.g., $E=mc^2$ for inline, or $$\int_0^1 x^2 dx$$ for block equations)**. If an image or document is provided, analyze it in the context of the user's question.`;

export const detectMode = (prompt: string): ModelMode => {
    const lower = prompt.toLowerCase();
    
    // Keywords triggering reasoning mode
    const reasoningKeywords = [
        'solve', 'calculate', 'derive', 'proof', 'explain', 'analyze', 
        'code', 'program', 'function', 'algorithm', 'debug', 
        'why', 'how', 'plan', 'structure', 'compare', 'difference'
    ];
    
    if (reasoningKeywords.some(k => lower.includes(k))) {
        return 'reasoning';
    }
    
    // Default to search (factual, current events, or general info)
    return 'search';
};

export const streamGeminiResponse = async (
    history: Content[], 
    onChunk: (text: string) => void,
    manualMode?: ModelMode
) => {
    try {
        let mode = manualMode;
        
        // If mode is not manually detected yet (e.g. from history), detect from the last user message
        if (!mode) {
            const lastMsg = history[history.length - 1];
            if (lastMsg && lastMsg.role === 'user') {
                const textPart = lastMsg.parts.find(p => p.text);
                if (textPart && textPart.text) {
                    mode = detectMode(textPart.text);
                }
            }
        }
        
        // Fallback default
        if (!mode) mode = 'search';

        let modelName: string;
        let config: any = {
            systemInstruction: SYSTEM_PROMPT,
        };

        if (mode === 'reasoning') {
            // Deep Reasoning Configuration
            modelName = 'gemini-3-pro-preview';
            config.thinkingConfig = { thinkingBudget: 32768 };
        } else {
            // Google Search Configuration (Default)
            modelName = 'gemini-2.5-flash';
            config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContentStream({
            model: modelName,
            contents: history,
            config: config
        });

        for await (const chunk of response) {
            if (chunk.text) {
                onChunk(chunk.text);
            }
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};