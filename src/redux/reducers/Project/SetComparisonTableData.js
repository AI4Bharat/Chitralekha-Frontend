import C from "../../constants";
import { parseSubtitles } from "../../../utils/utils";

const initialState = {
  data: {},
};

const setComparisonTable = (state = initialState, action) => {
  switch (action.type) {
    case C.COMPARE_TRANSCRIPTION_SOURCE:
      const keyList = Object.keys(action.payload);
      const valueList = Object.values(action.payload);
      let data = {};
      for (let i = 0; i < keyList.length; i++) {
        parseSubtitles(valueList[i].output).then((sub) => {
          data[keyList[i]] = sub;
        });
      }

      return {
        ...state,
        data,
      };
    default:
      return {
        ...state,
      };
  }
};

export default setComparisonTable;
