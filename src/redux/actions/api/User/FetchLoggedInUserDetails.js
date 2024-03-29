//API to get the list of all the users in the organization.

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchLoggedInUserDetailsAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_LOGGEDIN_USER_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.loggedInUserDetails}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      localStorage.setItem("userData", JSON.stringify(res));
      this.report = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {}

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('token')}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
