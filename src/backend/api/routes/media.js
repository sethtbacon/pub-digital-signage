/**
 * Media API Routes
 * Handles media uploads, browsing, and management
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('config');

// Load media configuration
const mediaConfig = config.get('media');
const allowedTypes = mediaConfig.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
const storagePath = path.resolve(process.cwd(), mediaConfig.storagePath || './data/media');

// Ensure media directories exist
const directories = ['photos', 'uploads', 'background', 'games', 'icons', 'logo'];
directories.forEach(dir => {
  const dirPath = path.join(storagePath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.params.type || 'uploads';
    const dir = path.join(storagePath, type);
    
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Set up multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// List files in media directory
router.get('/:type?', (req, res, next) => {
  try {
    const type = req.params.type || 'uploads';
    const dir = path.join(storagePath, type);
    
    if (!fs.existsSync(dir)) {
      return res.status(404).json({ error: `Media type '${type}' not found` });
    }
    
    const files = fs.readdirSync(dir)
      .filter(file => {
        const stats = fs.statSync(path.join(dir, file));
        return stats.isFile();
      })
      .map(file => {
        const stats = fs.statSync(path.join(dir, file));
        return {
          name: file,
          path: `/media/${type}/${file}`,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      });
    
    res.json(files);
  } catch (err) {
    next(err);
  }
});

// Upload media file
router.post('/upload/:type?', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const type = req.params.type || 'uploads';
    const file = req.file;
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        originalName: file.originalname,
        filename: file.filename,
        path: `/media/${type}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete media file
router.delete('/:type/:filename', (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(storagePath, type, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({
      message: 'File deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;