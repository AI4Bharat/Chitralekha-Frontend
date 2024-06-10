//API to get the list of all the projects in the organization.

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class RegenerateResponseAPI extends API {
  constructor(id, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.REGENERATE_RESPONSE;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }${id}/regenerate_response/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
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
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
