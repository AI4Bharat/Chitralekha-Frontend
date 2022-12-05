import C from "../../constants";

const initialState = {
  data: {},
};

const setComparisonTable = (state = initialState, action) => {
  switch (action.type) {
    case C.COMPARE_TRANSCRIPTION_SOURCE:
      const { payloads } = action.payload;
      const keyPayloads = Object.keys(payloads);
      let { data } = JSON.parse(JSON.stringify(Object.assign({}, state)));
      for (let i = 0; i < keyPayloads.length; i++) {
        const key = keyPayloads[i];
        data[key] = payloads[key]["payload"];
      }
      return {
        ...state,
        data,
      };

    case C.CLEAR_COMPARISON_TABLE:
      return {
        ...initialState,
      };
    default:
      return {
        ...state,
      };
  }
};

export default setComparisonTable;
