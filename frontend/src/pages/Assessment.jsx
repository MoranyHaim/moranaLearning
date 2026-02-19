import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

function Assessment({ profile }) {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '' });
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!profile) {
        navigate('/');
        return null;
    }

    const questions = [
        {
            id: 'q1',
            text: 'למה אנחנו מעדיפים להשתמש ב-SurfaceView על View רגיל?',
            options: [
                { value: 'a', text: 'א. כי אפשר להשתמש ביותר צבעים' },
                { value: 'b', text: 'ב. כי SurfaceView מאפשר ציור מ-Thread נפרד' },
                { value: 'c', text: 'ג. כי קל יותר לעצב ב-XML' },
                { value: 'd', text: 'ד. אין הבדל בביצועים' }
            ],
            correct: 'b'
        },
        {
            id: 'q2',
            text: 'מה תפקידו של ה-SurfaceHolder?',
            options: [
                { value: 'a', text: 'א. שמירת תמונות בזיכרון' },
                { value: 'b', text: 'ב. "מתווך" המאפשר לנעול את Canvas' },
                { value: 'c', text: 'ג. החלפת ה-Activity' },
                { value: 'd', text: 'ד. הדפסה ל-Logcat' }
            ],
            correct: 'b'
        },
        {
            id: 'q3',
            text: 'איזו שורה חייבת להופיע לאחר הציור?',
            codeSnippet: `Canvas canvas = holder.lockCanvas();
if (canvas != null) {
    canvas.drawColor(Color.BLUE);
    // ??? חסרה שורה!
}`,
            options: [
                { value: 'a', text: 'א. canvas.show();' },
                { value: 'b', text: 'ב. holder.unlockCanvasAndPost(canvas);' },
                { value: 'c', text: 'ג. holder.finishDrawing();' },
                { value: 'd', text: 'ד. System.out.println("Done");' }
            ],
            correct: 'b'
        },
        {
            id: 'q4',
            text: 'מה יקרה אם ננסה לצייר לפני surfaceCreated?',
            options: [
                { value: 'a', text: 'א. תמתין אוטומטית' },
                { value: 'b', text: 'ב. הציור לא יופיע אבל בסדר' },
                { value: 'c', text: 'ג. האפליקציה תקרוס (Runtime Exception)' }
            ],
            correct: 'c'
        }
    ];

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!answers.q1 || !answers.q2 || !answers.q3 || !answers.q4) {
            alert('אנא ענה על כל השאלות');
            return;
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/assessment/submit', {
                studentId: profile.student_id,
                answers: answers
            });

            const theoreticalScore = response.data.score;
            const practicalScore = 75;
            const finalGrade = Math.round((theoreticalScore * 0.4) + (practicalScore * 0.6));

            const updated = {
                ...profile,
                theoretical_score: theoreticalScore,
                practical_score: practicalScore,
                final_grade: finalGrade,
                level_achieved: getLevelAchieved(finalGrade),
                assessment_completed: true,
                lesson_stage: 'assessment-complete'
            };

            localStorage.setItem('morna_student_profile', JSON.stringify(updated));
            setScore(finalGrade);
            setSubmitted(true);
        } catch (error) {
            console.error('Error:', error);
            alert('שגיאה בשליחת הבדיקה');
        }
    };

    const getLevelAchieved = (grade) => {
        if (grade >= 90) return 'מצוינות';
        if (grade >= 80) return 'גבוהה';
        if (grade >= 70) return 'בינונית';
        return 'בסיסית';
    };

    return (
        <div className="assessment-page" dir="rtl">
            <div className="container">
                <h1>📋 המבדק המסכם של מורנה</h1>
                <p className="subtitle">בואו נבדוק מה למדת היום</p>

                {!submitted ? (
                    <form className="assessment-form" onSubmit={handleSubmit}>
                        {questions.map((q, idx) => (
                            <div key={q.id} className="question-card">
                                <h3>{idx + 1}. {q.text}</h3>
                                {q.codeSnippet && <pre className="code-snippet"><code>{q.codeSnippet}</code></pre>}
                                <div className="options-group">
                                    {q.options.map(opt => (
                                        <label key={opt.value} className="option-label">
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt.value}
                                                checked={answers[q.id] === opt.value}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            />
                                            <span>{opt.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary btn-large">✅ שלח תשובות</button>
                    </form>
                ) : (
                    <div className="results-container">
                        <div className="grade-display">
                            <div className="grade-circle">{score}</div>
                            <h2>🎉 כל הכבוד!</h2>
                            <p>הציון הסופי שלך: <strong>{score}/100</strong></p>
                        </div>
                        <button className="btn btn-success btn-large" onClick={() => navigate('/report')}>
                            📄 ראה את הדו"ח המלא
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Assessment;
