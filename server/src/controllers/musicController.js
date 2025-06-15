import fs from "fs";
import {
  uploadCloudinary,
  uploadCloudinaryAudio,
} from "../../config/cloudinary.js";
import { multerConfig } from "../../config/multer.js";
import { Music } from "../models/Music.js";

export const createSong = async (req, res) => {
  try {
    // Use multer.fields() to handle multiple fields (image and audio)
    multerConfig(req, res, async (err) => {
      if (err) {
        console.error("Multer Error:", err.message);
        return res.status(500).json({
          success: false,
          error: "File upload failed: " + err.message,
        });
      }

      let imageUrl = null;
      let audioUrl = null;

      // If an image is uploaded, process it
      if (req.files.image && req.files.image[0]) {
        const { path, filename } = req.files.image[0];
        try {
          const uploadResult = await uploadCloudinary(path, filename);
          imageUrl = uploadResult.secure_url;

          // Clean up the file after upload
          setTimeout(() => {
            fs.unlink(path, (err) => {
              if (err) {
                console.error("File Deletion Error:", err.message);
              } else {
                console.log("Temporary file deleted:", path);
              }
            });
          }, 10000);
        } catch (uploadError) {
          console.error("Image Upload Error:", uploadError.message);
          return res.status(500).json({
            success: false,
            message: "Image upload failed, please try again.",
          });
        }
      }

      // If an audio file is uploaded, process it
      if (req.files.audio && req.files.audio[0]) {
        const { path, filename } = req.files.audio[0];
        try {
          const uploadResult = await uploadCloudinaryAudio(path, filename);
          audioUrl = uploadResult.secure_url;

          // Clean up the file after upload
          setTimeout(() => {
            fs.unlink(path, (err) => {
              if (err) {
                console.error("File Deletion Error:", err.message);
              } else {
                console.log("Temporary file deleted:", path);
              }
            });
          }, 10000);
        } catch (uploadError) {
          console.error("Audio Upload Error:", uploadError.message);
          return res.status(500).json({
            success: false,
            message: "Audio upload failed, please try again.",
          });
        }
      }

      if (!imageUrl && !audioUrl) {
        return res.status(400).json({
          success: false,
          error: "Please upload either an image or an audio file.",
        });
      }

      const { name, artist } = req.body;
      if (!name && !artist) {
        return res.status(400).json({
          success: false,
          error: "Please enter song's name and artist.",
        });
      }

      const song = await Music.create({
        name,
        artist,
        audioUrl,
        thumbnail: imageUrl,
      });

      // Return the URLs of the uploaded files
      res.status(200).json({
        success: true,
        message: "Media uploaded successfully.",
        song,
      });
    });
  } catch (error) {
    console.error("createSong Error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while uploading the media.",
    });
  }
};

export const getSongs = async (req, res) => {
  try {
    const songs = await Music.find();

    res.status(200).json({
      success: true,
      message: "Songs loaded successfully.",
      songs,
    });
  } catch (error) {
    console.error("GetSongs Error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while getting songs.",
    });
  }
};
