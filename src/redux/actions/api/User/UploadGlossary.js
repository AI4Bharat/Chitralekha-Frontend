import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UploadGlossaryAPI extends API {
  constructor(payload, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.UPLOAD_GLOSSARY;

    this.payload = payload;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.glossary
    }upload_glossary/`;
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
    return this.payload;
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
