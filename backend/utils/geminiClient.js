const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
    constructor() {
        this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.client.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
        });
    }

    /**
     * שלח הודעה ל-Gemini עם morna system prompt
     */
    async chat(userMessage, conversationHistory = []) {
        const mornaPrompt = require('./mornaPrompt');

        try {
            const result = await this.model.generateContent({
                contents: [
                    ...conversationHistory,
                    {
                        role: 'user',
                        parts: [{ text: userMessage }]
                    }
                ],
                systemInstruction: mornaPrompt.SYSTEM_PROMPT
            });

            const response = result.response.text();
            return response;
        } catch (error) {
            console.error('❌ Gemini chat error:', error);
            throw new Error('Failed to generate response from Gemini');
        }
    }

    /**
     * Function Calling - קרא לפונקציות קבוצות מ-Gemini
     */
    async callWithFunctions(userMessage, availableFunctions) {
        try {
            const tools = this._buildToolDefinitions(availableFunctions);

            const result = await this.model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: userMessage }]
                    }
                ],
                tools: [{ functionDeclarations: tools }],
                systemInstruction: `
                    אתה מורנה, מורה וירטואלית. כשהתלמיד סיים עם החומר, 
                    קרא לפונקציה המתאימה.
                `
            });

            const functionCalls = this._extractFunctionCalls(result);
            return functionCalls;
        } catch (error) {
            console.error('❌ Function calling error:', error);
            throw error;
        }
    }

    /**
     * בנה הגדרות כלים ל-Gemini
     */
    _buildToolDefinitions(functions) {
        return Object.entries(functions).map(([name, config]) => ({
            name: name,
            description: config.description,
            parameters: {
                type: 'OBJECT',
                properties: config.parameters,
                required: config.required || []
            }
        }));
    }

    /**
     * חלץ קריאות פונקציה מתגובת Gemini
     */
    _extractFunctionCalls(response) {
        const calls = [];
        const candidates = response.response.candidates || [];

        for (const candidate of candidates) {
            const content = candidate.content?.parts || [];
            for (const part of content) {
                if (part.functionCall) {
                    calls.push({
                        name: part.functionCall.name,
                        args: part.functionCall.args || {}
                    });
                }
            }
        }

        return calls;
    }

    /**
     * ניתוח קוד Java שהתלמיד העלה
     */
    async analyzeCode(codeContent, rubric) {
        try {
            const analysisPrompt = `
                בדוק את קוד Java הזה עבור פרויקט SurfaceView:
                
                \`\`\`java
                ${codeContent}
                \`\`\`
                
                הערוך לפי הקריטריונים הבאים:
                ${rubric.map(r => `- ${r.criterion}: ${r.weight}%`).join('\n')}
                
                תן:
                1. ציון מ-0-100
                2. משוב בנקודות חוזק ותחומי שיפור
                3. המלצות ספציפיות
                
                כתוב בעברית.
            `;

            const result = await this.model.generateContent(analysisPrompt);
            return result.response.text();
        } catch (error) {
            console.error('❌ Code analysis error:', error);
            throw error;
        }
    }
}

module.exports = new GeminiClient();
