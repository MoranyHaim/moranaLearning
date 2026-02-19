import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

function Landing({ onProfileCreated }) {
    const navigate = useNavigate();
    const [showQuiz, setShowQuiz] = useState(false);
    const [formData, setFormData] = useState({
        threads_knowledge: '',
        android_experience: ''
    });

    const handleStart = () => {
        setShowQuiz(true);
    };

    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuizSubmit = (e) => {
        e.preventDefault();

        if (!formData.threads_knowledge || !formData.android_experience) {
            alert('אנא בחר תשובה לשתי השאלות');
            return;
        }

        const profile = {
            student_id: 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            threads_knowledge: formData.threads_knowledge,
            android_experience: formData.android_experience,
            lesson_stage: 'intro-complete',
            lesson_start_time: new Date().toISOString(),
            conversation_history: [],
            created_at: new Date().toISOString()
        };

        localStorage.setItem('morna_student_profile', JSON.stringify(profile));
        onProfileCreated(profile);
        navigate('/lesson');
    };

    return (
        <div className="landing-page">
            <div className="container">
                <header className="landing-header">
                    <div className="avatar-large">👩‍🏫</div>
                    <h1>👋 שלום! אני מורנה</h1>
                    <p className="subtitle">המורה הפרטית שלך ללמידת <strong>SurfaceView באנדרואיד</strong></p>
                </header>

                {!showQuiz ? (
                    <>
                        <section className="intro-cards">
                            <div className="card">
                                <h2>🎓 מה נלמד היום?</h2>
                                <ul>
                                    <li>🎯 למה צריך SurfaceView ומתי משתמשים בו</li>
                                    <li>🔧 ממשק SurfaceView.Callback וה-Thread</li>
                                    <li>🎨 ציור דינמי עם Canvas ו-Threads</li>
                                    <li>💻 בנייה של אפליקציה עם אנימציה אמיתית</li>
                                    <li>✅ בדיקה והערכה של הפרויקט שלך</li>
                                </ul>
                            </div>

                            <div className="card">
                                <h2>🚀 איך זה יעבוד?</h2>
                                <p>
                                    תלך דרך שיעור <strong>אדפטיבי</strong> (שמותאם לך).
                                    אם תתקשה, אני אעזור בצעדים קטנים יותר.
                                    אם אתה חזק, נעלה לרמה גבוהה יותר.
                                    בסוף, תבנה פרויקט משלך ותקבל ציון 📊
                                </p>
                            </div>
                        </section>

                        <button className="btn btn-primary btn-large" onClick={handleStart}>
                            🎓 בואו נתחיל את השיעור!
                        </button>
                    </>
                ) : (
                    <form className="initial-quiz" onSubmit={handleQuizSubmit}>
                        <h3>📝 קודם כל, בואו נבדוק מה אתה כבר יודע:</h3>

                        <div className="quiz-question">
                            <label><strong>שאלה 1:</strong> האם אתה מכיר את המושג <em>Thread</em> בג'אווה?</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="threads_knowledge"
                                        value="yes"
                                        onChange={handleQuizChange}
                                    />
                                    כן, יודע בטוח
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="threads_knowledge"
                                        value="somewhat"
                                        onChange={handleQuizChange}
                                    />
                                    קצת מכיר
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="threads_knowledge"
                                        value="no"
                                        onChange={handleQuizChange}
                                    />
                                    לא כלל
                                </label>
                            </div>
                        </div>

                        <div className="quiz-question">
                            <label><strong>שאלה 2:</strong> האם אתה כתבת קוד Android לפני?</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="android_experience"
                                        value="yes"
                                        onChange={handleQuizChange}
                                    />
                                    כן, כמה פרויקטים
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="android_experience"
                                        value="some"
                                        onChange={handleQuizChange}
                                    />
                                    כן, פרויקט אחד או שניים
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        name="android_experience"
                                        value="no"
                                        onChange={handleQuizChange}
                                    />
                                    לא כלל
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-secondary btn-large">
                            המשך →
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Landing;
