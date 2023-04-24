import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class SaveFullPayloadAPI extends API {
  constructor(payload, taskType, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_TRANSCRIPT;
    this.payload = payload;
    this.payloadEndpoint = taskType.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : ENDPOINTS.translation;
    this.queryString = taskType.includes("TRANSCRIPTION")
      ? "transcript"
      : "translation";
    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }save_full_${this.queryString}/`;
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
