import C from "../../constants";

const initalState = {
  videoSubtitle: {},
};

const getSubtitleAsPerId = (prevState, data) => {
  const { id, payload } = data;
//   const subtitleList = Object.values(payload);
//   const subtitle = subtitleList.filter((subtitleSentence) => {
//     const { start_time, end_time, timestamps } = subtitleSentence;
//     if (!!start_time && !!end_time && !!timestamps) {
//       const start = getMilliseconds(start_time);
//       const currentTime = getMilliseconds(time);
//       const end = getMilliseconds(end_time);
//       if (currentTime >= start && currentTime <= end) {
//         return true;
//       }
//       return false;
//     }
//     return false;
//   });
  let subtitleObj = { ...prevState, [id]: payload };
  return subtitleObj;
};

const getVideoSubtitle = (state = initalState, action) => {
  switch (action.type) {
    case C.GET_VIDEO_SUBTITLE:
      const videoSubtitle = getSubtitleAsPerId(
        state.videoSubtitle,
        action.payload
      );
      return {
        videoSubtitle,
      };
    default:
      return {
        ...state,
      };
  }
};

export default getVideoSubtitle;
