import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DownloadProjectReportsAPI extends API {
  constructor(id, reportsLevel, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.DOWNLOAD_PROJECT_REPORTS;
    const queryString =
      reportsLevel === "User"
        ? "send_users_report_email"
        : "send_languages_report_email";
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.project
    }${id}/${queryString}/`;
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
