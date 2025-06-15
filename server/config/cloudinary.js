import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const uploadCloudinary = async (imageUrl, imageID) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
    console.log("url", imageUrl, "id", imageID);

    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      public_id: imageID,
    });

    if (!uploadResult) {
      throw new Error("Failed to upload the image to Cloudinary.");
    }

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("There was an issue uploading the image to Cloudinary.");
  }
};

export const uploadCloudinaryAudio = async (audioPath, audioID) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });

    console.log("url", audioPath, "id", audioID);

    // Upload the audio to Cloudinary (use resource_type: "video" for audio)
    const uploadResult = await cloudinary.uploader.upload(audioPath, {
      resource_type: "video", // Specify resource type as video for audio files
      public_id: audioID,
    });

    if (!uploadResult) {
      throw new Error("Failed to upload the audio to Cloudinary.");
    }

    return uploadResult;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("There was an issue uploading the audio to Cloudinary.");
  }
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Fetch Usage Details
cloudinary.api
  .usage()
  .then((result) => {
    // console.log(result);
  })
  .catch((error) => {
    console.error("Error fetching usage details:", error);
  });
