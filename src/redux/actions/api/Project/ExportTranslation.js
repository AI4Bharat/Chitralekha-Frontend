import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class exportTranslationAPI extends API {
  constructor(projectId,exportType,data, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.EXPORT_TRANLATION;
    this.data = data;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.translation}export_translation/?task_id=${projectId}&export_type=${exportType}`;
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

  getBody() {
    return this.data;
  }

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
