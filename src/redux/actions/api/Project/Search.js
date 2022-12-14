import constants from "../../../constants";

const action = (searchValue) => {
   
  return {
    type: constants.SEARCH_LIST,
    payload: searchValue
  };
};

export default action;