import C from "../constants";

const initialState = {
  fullscreen: false,
  fullscreenVideo: false,
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
    
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
