import constants from "../../constants";

let initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.GET_GLOSSARY_LIST:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
