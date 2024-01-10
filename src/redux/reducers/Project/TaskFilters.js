import constants from "../../constants";

const initialState = {
  selectedFilters: {
    status: [],
    taskType: [],
    srcLanguage: [],
    tgtLanguage: [],
  },
  sortOptions: {
    sortBy: "",
    order: "",
  },
  columnDisplay: {
    description: false,
    created_at: false,
    updated_at: false,
  },
  searchValue: {
    id: "",
    video_name: "",
    description: "",
    user: "",
  },
  currentSearchedColumn: {
    label: "",
    name: "",
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SELECTED_FILTERS:
      return {
        ...state,
        selectedFilters: action.payload,
      };

    case constants.SORT_OPTIONS:
      return {
        ...state,
        sortOptions: action.payload,
      };

    case constants.COLUMN_DISPLAY:
      return {
        ...state,
        columnDisplay: action.payload,
      };

    case constants.PROJECT_SEARCH_VALUES:
      return {
        ...state,
        searchValue: action.payload,
      };

    case constants.CURRENT_SEARCHED_COLUMN:
      return {
        ...state,
        currentSearchedColumn: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default reducer;
