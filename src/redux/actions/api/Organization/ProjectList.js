//API to get the list of all the projects in the organization.

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ProjectListAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_PROJECT_LIST;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.project}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        console.log(res,'res');
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
        "Authorization":`JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
