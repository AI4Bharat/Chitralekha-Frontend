import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchOrganizationDetailsAPI extends API {
  constructor(id, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_ORGANIZATION_DETAILS;
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.organization}${id}/`;
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
        "Authorization":`JWT ${localStorage.getItem('token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
