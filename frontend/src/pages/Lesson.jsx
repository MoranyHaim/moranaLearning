import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages.css';

function Lesson({ profile }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!profile) {
            navigate('/');
            return;
        }

        const greeting = `👋 שלום! אני מורנה, המורה שלך.

ראיתי שאתה מכיר את הנושא ברמה של ${profile.threads_knowledge === 'yes' ? 'מתקדמת' : profile.threads_knowledge === 'somewhat' ? 'בינונית' : 'בסיסית'}. נהדר!

בואו נתחיל עם שאלה קטנה: **מה לדעתך ההבדל בין משחק שמקפא כל הזמן לבין משחק שזז חלק?**`;

        setMessages([{ sender: 'morna', text: greeting }]);
    }, [profile, navigate]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/chat', {
                studentId: profile.student_id,
                message: userMsg,
                conversationHistory: messages
            });

            setMessages(prev => [...prev, { sender: 'morna', text: response.data.reply }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { sender: 'morna', text: '❌ סליחה, יש לי בעיה. נסה שוב בעוד רגע.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteLesson = () => {
        const updated = { ...profile, lesson_stage: 'lesson-complete', lesson_end_time: new Date().toISOString() };
        localStorage.setItem('morna_student_profile', JSON.stringify(updated));
        navigate('/assessment');
    };

    return (
        <div className="lesson-page" dir="rtl">
            <div className="lesson-container">
                <aside className="chat-sidebar">
                    <div className="morna-header">
                        <span className="avatar-small">👩‍🏫</span>
                        <h2>מורנה 🎓</h2>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message message-${msg.sender}`}>
                                <strong>{msg.sender === 'morna' ? '🎓 מורנה' : '👤 אתה'}</strong>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && <div className="typing-indicator">⏳ מורנה כותבת...</div>}
                        <div ref={chatEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="כתוב את התשובה שלך כאן..."
                            rows="3"
                            disabled={isLoading}
                        />
                        <button type="submit" className="btn btn-primary" disabled={isLoading || !input.trim()}>
                            {isLoading ? '⏳ מחכה...' : 'שלח'}
                        </button>
                    </form>
                </aside>

                <main className="lesson-content">
                    <h1>שלב א': תיאוריה יישומית</h1>

                    <section className="theory-section">
                        <h2>📚 למה SurfaceView?</h2>
                        <p>תחשוב על מצב כזה:</p>
                        <ul>
                            <li>
                                <strong>View רגיל:</strong> אתה מצייר דברים בחוט הראשי של Android 
                                (ה-UI Thread). אם הציור לוקח זמן, המסך "מקפא".
                            </li>
                            <li>
                                <strong>SurfaceView:</strong> אתה יכול לצייר מחוט נפרד. 
                                זה כמו שהמורה כותבת על הלוח בזמן שהתלמידים עוקבים – זה לא מעכב את שום דבר.
                            </li>
                        </ul>
                    </section>

                    <section className="code-section">
                        <h2>💻 דוגמת קוד</h2>
                        <pre><code>{`public class AnimatedCircleView extends SurfaceView 
    implements SurfaceHolder.Callback {
    
    private DrawingThread drawingThread;
    
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        drawingThread = new DrawingThread(holder);
        drawingThread.start();
    }
    
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        drawingThread.stopDrawing();
    }
}`}</code></pre>
                    </section>

                    <button className="btn btn-success btn-large" onClick={handleCompleteLesson}>
                        ✅ סיימתי את השיעור
                    </button>
                </main>
            </div>
        </div>
    );
}

export default Lesson;
