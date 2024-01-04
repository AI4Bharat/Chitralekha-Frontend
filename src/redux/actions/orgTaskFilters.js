import C from "../constants";

export const updateOrgSelectedFilter = (payload) => {
  return {
    type: C.ORG_SELECTED_FILTERS,
    payload,
  };
};

export const updateOrgColumnDisplay = (payload) => {
  return {
    type: C.ORG_COLUMN_DISPLAY,
    payload,
  };
};

export const updateOrgSortOptions = (payload) => {
  return {
    type: C.ORG_SORT_OPTIONS,
    payload,
  };
};

export const updateOrgSearchValues = (payload) => {
  return {
    type: C.ORG_SEARCH_VALUES,
    payload,
  };
};

export const updateCurrentOrgSearchedColumn = (payload) => {
  return {
    type: C.CURRENT_ORG_SEARCHED_COLUMN,
    payload,
  };
};
