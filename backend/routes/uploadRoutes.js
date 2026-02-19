const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// הגדר מטמון זמני
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.zip', '.java', '.pdf'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only ZIP, Java, or PDF files allowed'));
        }
    }
});

// Google Drive API
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

/**
 * POST /api/upload
 * העלה קובץ ל-Google Drive של המורה
 */
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { studentId, studentName } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // העלה ל-Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: `${studentId}_${studentName}_${Date.now()}.${file.originalname.split('.').pop()}`,
                parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
                description: `Submitted by student ${studentName} (${studentId}) on ${new Date().toISOString()}`
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            },
            fields: 'id, webViewLink, name'
        });

        // מחק את הקובץ הזמני
        fs.unlinkSync(file.path);

        res.json({
            success: true,
            message: 'File uploaded successfully!',
            fileId: response.data.id,
            link: response.data.webViewLink,
            fileName: response.data.name
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        
        // מחק קובץ זמני בגלל שגיאה
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ 
            error: 'Failed to upload file',
            details: error.message 
        });
    }
});

module.exports = router;
