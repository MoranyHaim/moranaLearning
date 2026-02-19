const express = require('express');
const router = express.Router();

/**
 * POST /api/report/generate
 * צור דו"ח סופי עבור התלמיד
 */
router.post('/generate', async (req, res) => {
    try {
        const { studentId, theoreticalScore, practicalScore, studentReflection } = req.body;

        if (!studentId) {
            return res.status(400).json({ error: 'Missing studentId' });
        }

        // חשב ציון סופי
        const finalGrade = Math.round((theoreticalScore * 0.4) + (practicalScore * 0.6));

        // קבע רמה
        let levelAchieved = 'בסיסית';
        if (finalGrade >= 90) levelAchieved = 'מצוינות';
        else if (finalGrade >= 80) levelAchieved = 'גבוהה';
        else if (finalGrade >= 70) levelAchieved = 'בינונית';

        // משוב מורנה
        const teacherFeedback = generateFeedback(finalGrade, practicalScore);

        res.json({
            success: true,
            studentId: studentId,
            finalGrade: finalGrade,
            levelAchieved: levelAchieved,
            theoreticalScore: theoreticalScore,
            practicalScore: practicalScore,
            teacherFeedback: teacherFeedback,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Report generation error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

function generateFeedback(finalGrade, practicalScore) {
    let feedback = '🌟 **נקודות חוזק:**\n';
    
    if (finalGrade >= 80) {
        feedback += '- הבנה מעמיקה של מושג ה-Thread\n';
        feedback += '- קוד נקי ומאורגן היטב\n';
        feedback += '- שמות משתנים משמעותיים\n\n';
    }

    feedback += '🔧 **תחומי שיפור:**\n';
    if (practicalScore < 80) {
        feedback += '- ניהול הודעות שגיאה - יש להוסיף try-catch נוספים\n';
        feedback += '- תיעוד קוד - כדאי להוסיף עוד הערות JavaDoc\n\n';
    }

    feedback += '💡 **המלצות להמשך:**\n';
    if (finalGrade >= 80) {
        feedback += '- לתרגל ממשקי Callback נוספים בAndroid\n';
        feedback += '- ללמוד על Double Buffering לשיפור ביצועים\n';
        feedback += '- בנייה של אפליקציית משחק קלה עם SurfaceView\n';
    } else {
        feedback += '- חזרה על הבסיס של Threads\n';
        feedback += '- עוד תרגול עם SurfaceView\n';
        feedback += '- קביעת מפגשי עזר עם המורה\n';
    }

    return feedback;
}

module.exports = router;
