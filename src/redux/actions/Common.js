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

export const setTotalPages = (data) => {
  return {
    type: C.TOTAL_PAGES,
    payload: data,
  };
};

export const setCurrentPage = (data) => {
  return {
    type: C.CURRENT_PAGE,
    payload: data,
  };
};

export const setNextPage = (data) => {
  return {
    type: C.NEXT_PAGE,
    payload: data,
  };
};

export const setPreviousPage = (data) => {
  return {
    type: C.PREVIOUS_PAGE,
    payload: data,
  };
};