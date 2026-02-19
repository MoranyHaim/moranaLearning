
const express = require('express');
const router = express.Router();
const geminiClient = require('../utils/geminiClient');

/**
 * POST /api/chat
 * קבל הודעה מתלמיד, שלח ל-Gemini, החזר תשובה של מורנה
 */
router.post('/', async (req, res) => {
    try {
        const { studentId, message, conversationHistory = [] } = req.body;

        if (!message || !studentId) {
            return res.status(400).json({ 
                error: 'Missing required fields: studentId, message' 
            });
        }

        // שלח ל-Gemini
        const response = await geminiClient.chat(message, conversationHistory);

        res.json({
            success: true,
            reply: response,
            studentId: studentId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ 
            error: 'Failed to process chat message',
            details: error.message 
        });
    }
});

/**
 * POST /api/chat/analyze-code
 * ניתוח קוד מעשי של התלמיד
 */
router.post('/analyze-code', async (req, res) => {
    try {
        const { studentId, codeContent } = req.body;

        const rubric = [
            { criterion: 'Lifecycle Management', weight: 20 },
            { criterion: 'Canvas Handling', weight: 20 },
            { criterion: 'Error Handling', weight: 15 },
            { criterion: 'Code Quality', weight: 15 },
            { criterion: 'Functionality', weight: 20 },
            { criterion: 'Documentation', weight: 10 }
        ];

        const analysis = await geminiClient.analyzeCode(codeContent, rubric);

        res.json({
            success: true,
            analysis: analysis,
            studentId: studentId
        });
    } catch (error) {
        console.error('❌ Code analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze code' });
    }
});

module.exports = router;
