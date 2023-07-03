import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class ExportVoiceoverTaskAPI extends API {
  constructor(taskId, exportType, timeout = 2000) {
    super("GET", timeout, false);
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.voiceover
    }export_voiceover/?task_id=${taskId}&export_type=${exportType}`;
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
