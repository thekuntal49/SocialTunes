import React from "react";
import { useSearchParams } from "react-router-dom";
import SinglePlayer from "../components/SinglePlayer";
import DuoPlayer from "../components/DuoPlayer";

const MusicPlayer = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode"); // "single" or "duo"

  return (
    <div>
      {mode === "single" ? <SinglePlayer /> : <DuoPlayer />}
    </div>
  );
};

export default MusicPlayer;
