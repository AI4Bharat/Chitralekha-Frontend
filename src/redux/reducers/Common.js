import C from "../constants";

const initialState = {
  fullscreen: false,
  fullscreenVideo: false,
  subtitles: [],
  fullSubtitles: [],
  player: null,
  videoDetails: [],
  subtitlesForCheck: [],
  totalPages: 0,
  currentPage: 1,
  nextPage: "",
  previousPage: "",
  completedCount: 0,
  limit: 50,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case C.FULLSCREEN: {
      let result = state;
      result.fullscreen = action.payload;
      return result;
    }

    case C.FULLSCREEN_VIDEO: {
      let result = state;
      result.fullscreenVideo = action.payload;
      return result;
    }

    case C.SUBTITLES: {
      let result = state;
      result.subtitles = action.payload;
      return result;
    }

    case C.FULL_SUBTITLES: {
      let result = state;
      result.fullSubtitles = action.payload;
      return result;
    }

    case C.PLAYER: {
      let result = state;
      result.player = action.payload;
      return result;
    }

    case C.SUBTITLES_FOR_CHECK: {
      let result = {...state};
      result.subtitlesForCheck = action.payload;
      return result;
    }

    case C.TOTAL_PAGES: {
      let result = {...state};
      result.totalPages = action.payload;
      return result;
    }

    case C.CURRENT_PAGE: {
      let result = {...state};
      result.currentPage = action.payload;
      return result;
    }

    case C.NEXT_PAGE: {
      let result = {...state};
      result.nextPage = action.payload;
      return result;
    }

    case C.PREVIOUS_PAGE: {
      let result = {...state};
      result.previousPage = action.payload;
      return result;
    }

    case C.COMPLETED_COUNT: {
      let result = {...state};
      result.completedCount = action.payload;
      return result;
    }

    case C.LIMIT: {
      let result = {...state};
      result.limit = action.payload;
      return result;
    }

    case C.CLEAR_STATE:
      return {
        ...state,
        subtitles: action.payload,
        player: null,
        fullscreen: false,
        fullscreenVideo: false,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
