import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class exportTranscriptionAPI extends API {
  constructor(taskId, exportType, data, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.EXPORT_TRANSCRIPTION;
    this.data = data;
    this.exportType = exportType;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.transcript
    }export_transcript/?task_id=${taskId}&export_type=${exportType}`;
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
        "Content-Type": `${
          this.exportType === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/json"
        }`,
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
