import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchOrganizatioProjectManagersUserAPI extends API {
  constructor(id,projectrole, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_ORGANIZATION_PROJECT_MANAGER_USER;
        let endpoint = `${super.apiEndPointChitralekha()}${ENDPOINTS.getTranscriptReport}`;
    if (this.start_date) {
      endpoint += `?start_date=${this.start_date}`;
    }
    if (this.end_date) {
      endpoint += `${this.start_date ? '&' : '?'}end_date=${this.end_date}`;
    }
    
    this.endpoint = endpoint;
  }

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
