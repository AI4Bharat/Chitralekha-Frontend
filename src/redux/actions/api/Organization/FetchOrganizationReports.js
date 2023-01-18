
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchOrganizationReportsAPI extends API {
  constructor(id,reportsLevel, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_ORGANIZATION_REPORTS; 
     const queryString = reportsLevel == "User" ? "get_report_users" : reportsLevel == "Language" ? "get_report_languages":"get_report_projects";
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.organization}${id}/${queryString}/`;
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
