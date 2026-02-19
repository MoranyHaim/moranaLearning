require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// 1. ייבוא הספרייה של גוגל
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. הגדרת Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// הנחיית המערכת (System Instruction) - כאן נמצא ה"אופי" של מורנה
const systemInstruction = `
את "מורנה", מורה פרטית מומחית למדעי המחשב (5 יח"ל). 
המטרה: ללמד SurfaceView באנדרואיד (Java) לתלמידי י"א.
סגנון: סבלנית, מעודדת, מפשטת מושגים למתקשים.
אסטרטגיה אדפטיבית: 
- בדקי ידע קודם (Threads, View).
- אם התלמיד מבין, תני אתגר (Canvas, Callback).
- אם התלמיד מתקשה, השתמשי באנלוגיות פשוטות.
- כאשר התלמיד מוכן לתרגול מעשי, הנחי אותו לכתוב קוד וללחוץ על כפתור "העלאה לענן" באתר.
`;

// הגדרת המודל עם ההנחיות
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction 
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== ROUTES =====

// Health Check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: '✅ Morna backend is running with Gemini AI!' 
    });
});

// 3. Chat endpoint - המוח של מורנה
app.post('/api/chat', async (req, res) => {
    try {
        const { studentId, message, history } = req.body; // הוספנו history כדי שהיא תזכור מה נאמר קודם

        if (!message || !studentId) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // ניהול שיחה עם היסטוריה (הופך אותה לאדפטיבית)
        const chat = model.startChat({
            history: history || [], // המערכת שולחת את היסטוריית ההודעות הקודמות
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const replyText = response.text();

        res.json({
            success: true,
            reply: replyText,
            studentId: studentId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Gemini Error:', error);
        res.status(500).json({ error: 'מורנה נתקלה בבעיה בחיבור למוח הדיגיטלי שלה.' });
    }
});

// Assessment endpoint (נשאר כפי שהיה)
app.post('/api/assessment/submit', async (req, res) => {
    try {
        const { studentId, answers } = req.body;
        const correctAnswers = { q1: 'b', q2: 'b', q3: 'b', q4: 'c' };
        let correctCount = 0;
        for (const [question, answer] of Object.entries(answers)) {
            if (answer === correctAnswers[question]) correctCount++;
        }
        const theoreticalScore = (correctCount / 4) * 100;

        res.json({
            success: true,
            score: Math.round(theoreticalScore),
            correctCount: correctCount
        });
    } catch (error) {
        console.error('❌ Assessment error:', error);
        res.status(500).json({ error: 'Failed to submit assessment' });
    }
});

// Error handling & Start server...
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
    console.log(`🚀 Morna AI Backend running on port ${PORT}`);
});

module.exports = app;
