import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class RejectManagerSuggestionsAPI extends API {
  constructor(userId, timeout = 2000) {
    super("DELETE", timeout, false);
    this.type = constants.DELETE_MANAGER_SUGGESTIONS;
    this.userId = userId;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.rejectUser}?userId=${this.userId}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.rejectManagerSuggestion = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.rejectManagerSuggestion;
  }
} 