import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UploadCSVAPI extends API {
  constructor(type = "project", timeout = 2000) {
    super("POST", timeout, false);
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.video}${
      type === "project" ? "upload_csv_data" : "enable_org_csv_upload"
    }`;
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
