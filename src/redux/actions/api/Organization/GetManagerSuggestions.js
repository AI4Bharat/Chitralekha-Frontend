import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetManagerSuggestionsAPI extends API {
  constructor(orgId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_MANAGER_SUGGESTIONS;
    this.orgId = orgId;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.pendingUsers}?organisation_id=${this.orgId}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.suggestions = res;
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
    return this.suggestions;
  }
} 