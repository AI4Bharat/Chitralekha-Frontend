/**
 * Fetch Project List
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constant from "../../../constants";

export default class FetchProjectListAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constant.FETCH_PROJECT_LIST;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.project}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.projectData = res;
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
        Authorization: `JWT ${localStorage.getItem("access_token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.projectData;
  }
}
