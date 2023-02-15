import C from "../constants";

export const FullScreen = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};

export const FullScreenVideo = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};

export const setSubtitles = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};

export const setPlayer = (data) => {
  return {
    type: C.PLAYER,
    payload: data,
  };
};

export const setSubtitlesForCheck = (data) => {
  return {
    type: C.SUBTITLES_FOR_CHECK,
    payload: data,
  };
};
