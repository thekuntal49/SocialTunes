import React, { useState, useContext } from "react";
import PlayerControls from "./PlayerControls";
import SongList from "./SongsList/SongsList";
import { MusicContext } from "../context/MusicContext";

const SinglePlayer = () => {
  const { currentSong } = useContext(MusicContext);

  return (
    <div >
      <SongList />
      {currentSong ? <PlayerControls /> : <></>}
    </div>
  );
};

export default SinglePlayer;
