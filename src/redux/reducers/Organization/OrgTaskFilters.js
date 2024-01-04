import constants from "../../constants";

const initialState = {
  orgSelectedFilters: {
    status: [],
    taskType: [],
    srcLanguage: [],
    tgtLanguage: [],
  },
  orgSortOptions: {
    sortBy: "",
    order: "",
  },
  orgColumnDisplay: {
    description: false,
    created_at: false,
    updated_at: false,
  },
  orgSearchValue: {
    id: "",
    video_name: "",
    description: "",
    user: "",
  },
  currentOrgSearchedColumn: {
    label: "",
    name: "",
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.ORG_SELECTED_FILTERS:
      return {
        ...state,
        orgSelectedFilters: action.payload,
      };

    case constants.ORG_SORT_OPTIONS:
      return {
        ...state,
        orgSortOptions: action.payload,
      };

    case constants.ORG_COLUMN_DISPLAY:
      return {
        ...state,
        orgColumnDisplay: action.payload,
      };

    case constants.ORG_SEARCH_VALUES:
      return {
        ...state,
        orgSearchValue: action.payload,
      };

    case constants.CURRENT_ORG_SEARCHED_COLUMN:
      return {
        ...state,
        currentOrgSearchedColumn: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
