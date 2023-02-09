import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class GenerateTranslationOutputAPI extends API {
  constructor(id, timeout = 2000) {
    super("POST", timeout, false);
    this.id = id;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.translation
    }generate_translation_output/`;
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
    return {
      task_id: this.id,
    };
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
