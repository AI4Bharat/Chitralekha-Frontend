import C from "../constants";

export const updateSelectedFilter = (payload) => {
  return {
    type: C.SELECTED_FILTERS,
    payload,
  };
};

export const updateColumnDisplay = (payload) => {
  return {
    type: C.COLUMN_DISPLAY,
    payload,
  };
};

export const updateSortOptions = (payload) => {
  return {
    type: C.SORT_OPTIONS,
    payload,
  };
};

export const updateProjectSearchValues = (payload) => {
  return {
    type: C.PROJECT_SEARCH_VALUES,
    payload,
  };
};

export const updateCurrentSearchedColumn = (payload) => {
  return {
    type: C.CURRENT_SEARCHED_COLUMN,
    payload,
  };
};
