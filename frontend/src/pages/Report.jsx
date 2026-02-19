                <section className="report-section">
                    <h2>📊 ציון סופי</h2>
                    <div className="grade-display">
                        <div className="grade-circle-large">{profile.final_grade}</div>
                        <p className="grade-description">הציון שלך: <strong>{profile.final_grade}/100</strong></p>
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
                            {/* כאן הקוד שלך נעצר - הוספתי סגירה לדוגמה */}
                            <h4>🛠️ מבדק מעשי (60%)</h4>
                            <div className="grade-bar">
                                <div className="grade-fill" style={{ width: `${profile.practical_score || 0}%` }}></div>
                            </div>
                            <p>{profile.practical_score || 0}/100</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Report;
