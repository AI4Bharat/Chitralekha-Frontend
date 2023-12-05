import C from "../../constants";

const initialState = {
    html: null
};

const newsletterPreviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case C.GET_TEMPLATE_PREVIEW:
            try {
                const { html } = action.payload;
                return {
                    ...state,
                    html
                }
            } catch (e) {
                return {
                    ...state,
                    html: null,
                }
            }
        case C.CLEAR_TEMPLATE_PREVIEW:
            return {
                ...state,
                html: null,
            }
        default:
            return {
                ...state
            }
    }
};

export default newsletterPreviewReducer;