const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    }
}).single('image');

// Serve static files
app.use(express.static(__dirname)); // Mengizinkan akses ke file di direktori utama
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Mengizinkan akses ke file di direktori uploads

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                const uploadData = {
                    title: req.body.title,
                    content: req.body.content,
                    fileUrl: `/uploads/${req.file.filename}`,
                    fileName: req.file.filename
                };

                // Baca file uploads.json
                fs.readFile('uploads.json', (err, data) => {
                    if (err && err.code !== 'ENOENT') {
                        return res.status(500).json({ message: 'Error reading uploads file' });
                    }

                    const uploads = data ? JSON.parse(data) : [];
                    uploads.push(uploadData);

                    // Tulis ke file uploads.json
                    fs.writeFile('uploads.json', JSON.stringify(uploads, null, 2), (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error writing uploads file' });
                        }

                        res.json({
                            message: 'File berhasil di-upload',
                            fileUrl: uploadData.fileUrl,
                            fileName: uploadData.fileName
                        });
                    });
                });
            }
        }
    });
});

// Set blog.html as the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html')); // Mengarahkan ke blog.html di direktori utama
});

// Endpoint untuk mendapatkan data upload
app.get('/uploads-data', (req, res) => {
    fs.readFile('uploads.json', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ message: 'Error reading uploads file' });
        }

        const uploads = data ? JSON.parse(data) : [];
        res.json(uploads);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});