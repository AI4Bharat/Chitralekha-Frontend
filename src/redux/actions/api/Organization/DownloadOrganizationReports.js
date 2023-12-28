import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DownloadOrganizationReportsAPI extends API {
  constructor(id, endPoint, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.DOWNLOAD_ORGANIZATION_REPORTS;
    this.endpoint = `${super.apiEndPointAuto()}${
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
