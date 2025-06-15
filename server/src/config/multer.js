import multer from "multer";
import path from "path";

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const filename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    ); // Get file name without extension
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    cb(null, filename + "_" + uniqueSuffix + ext);
  },
});

// Configuration for handling multiple files in different fields (image and audio)
export const multerConfig = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);
