import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

function Report({ profile }) {
    const navigate = useNavigate();

    useEffect(() => {
        // אם אין פרופיל או שהמבדק לא הושלם, נחזיר לדף הבית
        if (!profile || !profile.assessment_completed) {
            navigate('/');
        }
    }, [profile, navigate]);

    if (!profile) return null;

    // פונקציה לבחירת צבע לפי רמת ההישג
    const getLevelColor = (level) => {
        if (level === 'מצוינות') return '#fbbf24'; // זהב
        if (level === 'גבוהה') return '#10b981';    // ירוק
        if (level === 'בינונית') return '#3b82f6';  // כחול
        return '#9ca3af';                          // אפור (בסיסית)
    };

    return (
        <div className="report-page" dir="rtl">
            <div className="container">
                <div className="report-header">
                    <h1>📄 דו"ח למידה - SurfaceView</h1>
                    <p>מופק על ידי מורנה 🎓</p>
                </div>

                <section className="report-section">
                    <h2>👤 נתונים אישיים</h2>
                    <table className="report-table">
                        <tbody>
                            <tr>
                                <td><strong>מזהה התלמיד:</strong></td>
                                <td>{profile.student_id}</td>
                            </tr>
                            <tr>
                                <td><strong>תאריך השיעור:</strong></td>
                                <td>{new Date(profile.lesson_start_time).toLocaleDateString('he-IL')}</td>
                            </tr>
                            <tr>
                                <td><strong>רמת הישג:</strong></td>
                                <td style={{ color: getLevelColor(profile.level_achieved), fontWeight: 'bold' }}>
                                    {profile.level_achieved}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section className="report-section">
                    <h2>📊 ציון סופי</h2>
                    <div className="grade-display">
                        <div className="grade-circle-large">{profile.final_grade}</div>
                        <p className="grade-description">הציון המשוקלל שלך: <strong>{profile.final_grade}/100</strong></p>
                    </div>
                    
                    <div className="grade-breakdown">
                        <div className="breakdown-item">
                            <h4>📋 מבדק עיוני (40%)</h4>
                            <div className="grade-bar">
                                <div className="grade-fill" style={{ width: `${profile.theoretical_score}%` }}></div>
                            </div>
                            <p>{profile.theoretical_score}/100</p>
                        </div>
                        
                        <div className="breakdown-item">
                            <h4>🛠️ מבדק מעשי (60%)</h4>
                            <div className="grade-bar">
                                <div className="grade-fill" style={{ width: `${profile.practical_score}%` }}></div>
                            </div>
                            <p>{profile.practical_score}/100</p>
                        </div>
                    </div>
                </section>

                <button className="btn btn-primary" onClick={() => window.print()} style={{ marginTop: '20px' }}>
                    🖨️ הדפס דו"ח
                </button>
            </div>
        </div>
    );
}

export default Report;
