import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMusicsAsync,
  addMusicAsync,
  delMusicAsync,
} from "../slices/musicSlice";
import MusicCoverImage from "../components/music/MusicCoverImage/MusicCoverImage";
import Icon from "../components/Icons/Icon";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
const Home = () => {
  const musics = useSelector((state) => state.music.musics);
  const [musicIndex, setMusicIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [unformatedTrackDuration, setUnformatedTrackDuration] = useState(0);
  const [currentDuration, setCurrentDuration] = useState("00:00");
  const [trackDuration, setTrackDuration] = useState("00:00");
  const [trackName, setTrackName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [seekT, setSeekT] = useState("");
  const [seekLoc, setSeekLoc] = useState("");
  const [animation, setAnimation] = useState('');
  const [formFields, setFormFields] = useState({
    title: "",
    genre: "",
    link: "",
    cover_img: "",
  });
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();
  const sAreaRef = useRef(null);
  const seekBarRef = useRef(null);
  const sHoverRef = useRef(null);
  const insTimeRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { title, genre, link, cover_img } = formFields;
    setFormFields({ title: "", genre: "", link: "", cover_img: "" });
    setShowForm(false);
    dispatch(addMusicAsync(title, genre, link, cover_img));
  };

  const handleMusicDelete = (e) => {
    e.preventDefault();
    dispatch(delMusicAsync(e.target.id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const playAudio = (music) => {
    audio.src = music.link;
    audio.crossOrigin = "anonymous";
    audio.currentTime = playbackPosition;
    var playPromise = audio.play();
    setTrackName(music.title);
    setCoverImage(music.cover_img);
    if (playPromise !== undefined) {
      playPromise.then(() => {}).catch((error) => {});
    }
    setIsPlaying(true);
  };

  const playPauseSong = (music, nextOne = false) => {
    if (nextOne) {
      playAudio(music);
      return;
    }
    if (isPlaying) {
      audio.pause();
      setPlaybackPosition(audio.currentTime);
      setIsPlaying(false);
    } else {
      playAudio(music);
    }
  };

  const playNextSong = (next = true) => {
    const nextIndex = next ? musicIndex + 1 : musicIndex - 1;
    if (nextIndex < musics.length) {
      setMusicIndex(nextIndex);
      setCurrentSong(musics[nextIndex]);
      setPlaybackPosition(0);
      playPauseSong(musics[nextIndex], true);
    } else {
      setMusicIndex(0);
      setCurrentSong(musics[0]);
      setPlaybackPosition(0);
      playPauseSong(musics[0], true);
    }
  };

  const updateSeekBar = () => {
    const newValue = (audio.currentTime / audio.duration) * 100;
    setSeekValue(newValue);
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    const currentDurationFormatted = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    setCurrentDuration(currentDurationFormatted);
  };

  const handleSeekBarClick = (event) => {
    audio.currentTime = seekLoc;
    seekBarRef.current.style.width = seekT;
    handleMouseLeave();
  };

  const handleMouseEnter = (event) => {
    const seekBarPos = sAreaRef.current.getBoundingClientRect();
    const seekT = event.clientX - seekBarPos.left + "px";
    setSeekT(seekT);
    const seekLoc =
      (unformatedTrackDuration * (event.clientX - seekBarPos.left)) /
      sAreaRef.current.offsetWidth;
    setSeekLoc(seekLoc);
    sHoverRef.current.style.width = seekT;
    let cM = seekLoc / 60;
    let ctMinutes = Math.floor(cM);
    let ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;
    if (ctMinutes < 0 || ctSeconds < 0) return;
    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;
    if (isNaN(ctMinutes) || isNaN(ctSeconds))
      insTimeRef.current.innerText = "--:--";
    else insTimeRef.current.innerText = ctMinutes + ":" + ctSeconds;
    insTimeRef.current.style.left = seekT;
    insTimeRef.current.style.marginLeft = "-21px";
    insTimeRef.current.style.display = "block";
  };

  const handleMouseLeave = () => {
    sHoverRef.current.style.width = "0";
    insTimeRef.current.innerText = "00:00";
    insTimeRef.current.style.left = "0px";
    insTimeRef.current.style.marginLeft = "0px";
    insTimeRef.current.style.display = "none";
  };

  useEffect(() => {
    dispatch(fetchMusicsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (musics.length > 0) {
      setCurrentSong(musics[musicIndex]);
      setCoverImage(musics[musicIndex].cover_img);
    }
  }, [musics]);

  useEffect(() => {
    audio.addEventListener("timeupdate", updateSeekBar);

    audio.addEventListener("loadedmetadata", () => {
      const totalMinutes = Math.floor(audio.duration / 60);
      const totalSeconds = Math.floor(audio.duration % 60);
      setUnformatedTrackDuration(audio.duration);
      const totalDurationFormatted = `${
        totalMinutes < 10 ? "0" : ""
      }${totalMinutes}:${totalSeconds < 10 ? "0" : ""}${totalSeconds}`;
      setTrackDuration(totalDurationFormatted);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateSeekBar);
      audio.removeEventListener("loadedmetadata", () => {});
    };
  }, [audio]);

  const handleMusicItemClick = (music) => {
    setCurrentSong(music);
    setCoverImage(music.cover_img);
    playAudio(music);
  };

const getRandomAnimationClass = () => {
  const animations = ['expandingCirclesAnimation', 'twistingAndColorShift','FadeInOut'];
  const randomIndex = Math.floor(Math.random() * animations.length);
  return animations[randomIndex];
};

useEffect(() => {

  setAnimation(getRandomAnimationClass())

},[trackName])

  return (
    <>
      <div className="app-main">
        <div id="fancy-bg" className={isPlaying ? animation : '' }></div>
        <div className="bg-layer"></div>
        <div className="player">
          <div className={isPlaying ? "player-track active" : "player-track"}>
            <div className="track-name">{trackName}</div>
            <div className="track-time">
              <div className="current-time">{currentDuration}</div>
              <div className="track-length">{trackDuration}</div>
            </div>
            <div
              className="song-container"
              onClick={handleSeekBarClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={sAreaRef}
            >
              <div className="seeked-time" ref={insTimeRef}></div>
              <div className="seek-hover" ref={sHoverRef}></div>
              <div
                className="seek-bar"
                style={{ width: `${seekValue}%` }}
                ref={seekBarRef}
              ></div>
            </div>
          </div>
          <div className="player-box">
            <div className={isPlaying ? "track active" : "track"}>
              {currentSong && (
                <MusicCoverImage
                  key={currentSong.id}
                  imageLink={coverImage}
                  imageId={currentSong.id}
                />
              )}
              <div className="buffer-box">Buffering ...</div>
            </div>
            <div className="player-controls">
              {musicIndex > 0 && (
                <Icon
                  iconName="fa-backward"
                  iconId="play-previous"
                  iconType="button"
                  onClick={() => playNextSong(false)}
                />
              )}
              <Icon
                iconName={isPlaying ? "fa-pause" : "fa-play"}
                iconId="play-pause-button"
                iconType="button"
                onClick={() => playPauseSong(currentSong)}
              />
              <Icon
                iconName="fa-forward"
                iconId="play-next"
                iconType="button"
                onClick={() => playNextSong()}
              />
            </div>

            <div>
              <Button
                btnText={showForm ? "Songs List" : "+ Song"}
                btnType="button"
                classes="fancy-btn"
                style={{ marginTop: "10px", marginBottom: "10px" }}
                onClick={() => setShowForm(!showForm)}
              />
              <div id="music-list-container">
                {showForm ? (
                  <form className="fancy-form" onSubmit={handleFormSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <Input
                          label="Title"
                          type="text"
                          name="title"
                          value={formFields.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="Genre"
                          type="text"
                          name="genre"
                          value={formFields.genre}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <Input
                          label="Link"
                          type="url"
                          name="link"
                          value={formFields.link}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="Cover Image"
                          type="url"
                          name="cover_img"
                          value={formFields.cover_img}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <Button
                      btnText="Add New Song"
                      btnType="submit"
                      classes="fancy-btn"
                    />
                  </form>
                ) : (
                  <div id="music-list-container">
                    {musics.map((music) => (
                      <div
                        key={music.id}
                        className={`music-item ${
                          music === currentSong ? "highlighted" : ""
                        }`}
                        onClick={() => handleMusicItemClick(music)}
                      >
                        <div className="music-details">
                          <div className="music-title">{music.title}</div>
                        </div>
                        <Button
                          btnText="X"
                          onClick={(e) => handleMusicDelete(e)}
                          classes="remove-button"
                          id={music.id}
                          title="Delete Song"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
