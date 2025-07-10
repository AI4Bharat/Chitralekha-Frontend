import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchProjectReportsAPI extends API {
  constructor(id, reportsLevel, limit, offset, task_type = "", timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_PROJECT_REPORTS;
    const queryString =
      reportsLevel === "User" ? "get_report_users" : "get_report_languages";
    this.endpoint =
      reportsLevel === "Language"
        ? `${super.apiEndPointAuto()}${
            ENDPOINTS.project
          }${id}/${queryString}/?limit=${limit}&offset=${offset}&task_type=${task_type}`
        : `${super.apiEndPointAuto()}${
            ENDPOINTS.project
          }${id}/${queryString}/?limit=${limit}&offset=${offset}`;
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
