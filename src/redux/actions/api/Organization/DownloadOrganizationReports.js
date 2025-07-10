import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DownloadOrganizationReportsAPI extends API {
  constructor(id, endPoint, taskStartDate="", taskEndDate="", timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.DOWNLOAD_ORGANIZATION_REPORTS;
    this.endpoint = endPoint === "send_tasks_report_email" ? 
     `${super.apiEndPointAuto()}${
      ENDPOINTS.organization
    }${id}/${endPoint}/?taskStartDate=${taskStartDate}&taskEndDate=${taskEndDate}`
    :`${super.apiEndPointAuto()}${
      ENDPOINTS.organization
    }${id}/${endPoint}/`;
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
