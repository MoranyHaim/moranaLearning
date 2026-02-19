require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

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
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        message: '✅ Morna backend is running!'
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { studentId, message } = req.body;

        if (!message || !studentId) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // Temporary response (without Gemini)
        const reply = `שלום! אני מורנה. קיבלתי את הודעתך: "${message}". השרת עובד! 🎉`;

        res.json({
            success: true,
            reply: reply,
            studentId: studentId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
});

// Assessment endpoint
app.post('/api/assessment/submit', async (req, res) => {
    try {
        const { studentId, answers } = req.body;

        const correctAnswers = {
            q1: 'b',
            q2: 'b',
            q3: 'b',
            q4: 'c'
        };

        let correctCount = 0;
        for (const [question, answer] of Object.entries(answers)) {
            if (answer === correctAnswers[question]) correctCount++;
        }

        const theoreticalScore = (correctCount / 4) * 100;

        res.json({
            success: true,
            studentId: studentId,
            score: Math.round(theoreticalScore),
            correctCount: correctCount
        });
    } catch (error) {
        console.error('❌ Assessment error:', error);
        res.status(500).json({ error: 'Failed to submit assessment' });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`🚀 Morna backend running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`✅ Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
