import C from "../../../constants";

const setComparisonTable = (payload) => {
  return {
    type: C.COMPARE_TRANSCRIPTION_SOURCE,
    payload,
  };
};

export default setComparisonTable;
