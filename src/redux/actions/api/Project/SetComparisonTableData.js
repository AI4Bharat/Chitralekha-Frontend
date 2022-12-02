import C from "../../../constants";

const setComparisonTable = (payload) => {
    console.log(payload);
  return {
    type: C.COMPARE_TRANSCRIPTION_SOURCE,
    payload,
  };
};

export default setComparisonTable;
