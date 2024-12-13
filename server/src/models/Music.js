import mongoose from "mongoose";

const MusicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  { timestamps: true }
);

// Add unique index for name and artist
MusicSchema.index({ name: 1, artist: 1 }, { unique: true });

// Export the Song model
export const Music = mongoose.models.Music || mongoose.model("Music", MusicSchema);

