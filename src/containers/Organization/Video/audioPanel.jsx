import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f1f1f1;
  padding: 0px;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: 2px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const PlayPauseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 3.5px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: #ccc;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div`
  height: 100%;
  background: #007aff;
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Time = styled.div`
  margin: 0 10px;
  font-family: Arial, sans-serif;
  font-size: 14px;
`;

// const VolumeControl = styled.input`
//   width: 100px;
//   margin-left: 20px;
// `;

const Audio = styled.audio`
  display: none;
`;

const AudioPlayer = ({ src, fast = false }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  // const [volume, setVolume] = useState(1);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.addEventListener('timeupdate', updateProgress);
      player.addEventListener('loadedmetadata', () => {
        setTotalTime(formatTime(player.duration));
      });

      return () => {
        player.removeEventListener('timeupdate', updateProgress);
        player.removeEventListener('loadedmetadata', () => {
          setTotalTime(formatTime(player.duration));
        });
      };
    }
  }, []);

  const togglePlay = () => {
    const player = playerRef.current;
    if (player.paused) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    const player = playerRef.current;
    const current = player.currentTime;
    const percent = (current / player.duration) * 100;
    setProgress(percent);
    setCurrentTime(formatTime(current));
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const handleProgressClick = (e) => {
    const player = playerRef.current;
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    player.currentTime = percent * player.duration;
    setProgress(percent * 100);
  };

  // const handleVolumeChange = (e) => {
  //   const player = playerRef.current;
  //   player.volume = e.target.value;
  //   setVolume(e.target.value);
  // };

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.pause();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
      player.load();
    }
    if(src===""){
      setDisabled(true);
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
      setTotalTime('0:00');
    }else{
      setDisabled(false);
    }
  }, [src]);

  return (
    <PlayerContainer style={{opacity:disabled&&"0.5", cursor:disabled&&"not-allowed", border:fast&&"1px solid red"}}>
      <Controls>
        <PlayPauseButton onClick={!disabled&&togglePlay} style={{cursor:disabled&&"not-allowed"}}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill={disabled&&"gray"}/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill={disabled&&"lightGrey"}/>
            </svg>
          )}
        </PlayPauseButton>
        <ProgressBar onClick={!disabled&&handleProgressClick} style={{cursor:disabled&&"not-allowed"}}>
          <Progress progress={progress} />
        </ProgressBar>
        <Time>{currentTime} / {totalTime}</Time>
        {/* <VolumeControl 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={handleVolumeChange} 
        /> */}
      </Controls>
      <Audio ref={playerRef}>
        <source src={src} type="audio/mpeg" />
      </Audio>
    </PlayerContainer>
  );
};

export default AudioPlayer;
