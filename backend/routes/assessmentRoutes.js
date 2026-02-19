const express = require('express');
const router = express.Router();

/**
 * POST /api/assessment/submit
 * קבל תשובות למבדק וחשב ציון
 */
router.post('/submit', async (req, res) => {
    try {
        const { studentId, answers } = req.body;

        if (!studentId || !answers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const correctAnswers = {
            q1: 'b',
            q2: 'b',
            q3: 'b',
            q4: 'c'
        };

        let correctCount = 0;
        const results = {};

        for (const [question, answer] of Object.entries(answers)) {
            const isCorrect = answer === correctAnswers[question];
            results[question] = { answer, correct: isCorrect };
            if (isCorrect) correctCount++;
        }

        const theoreticalScore = (correctCount / 4) * 100;

        res.json({
            success: true,
            studentId: studentId,
            results: results,
            score: Math.round(theoreticalScore),
            correctCount: correctCount
        });
    } catch (error) {
        console.error('❌ Assessment error:', error);
        res.status(500).json({ error: 'Failed to submit assessment' });
    }
});

module.exports = router;
