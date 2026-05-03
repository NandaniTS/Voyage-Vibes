import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Only allow image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  }
});

// POST /api/upload/images - Upload multiple images
router.post('/images', upload.array('images', 5), (req, res) => {
  console.log('Upload request received');
  console.log('Files:', req.files);
  console.log('Request headers:', req.headers);
  
  try {
    if (!req.files || req.files.length === 0) {
      console.log('No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => {
      // Return the relative path that can be used to access the file
      return `/api/uploads/${file.filename}`;
    });

    res.json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

// DELETE /api/upload/:filename - Delete an uploaded file
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

export default router;
