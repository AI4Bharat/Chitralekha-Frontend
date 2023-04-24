import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class FetchFullPayloadAPI extends API {
  constructor(id, taskType, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_FULL_PAYLOAD;
    this.id = id;
    this.payloadEndpoint = taskType.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : ENDPOINTS.translation;
    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }get_full_payload/?task_id=${id}`;
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
