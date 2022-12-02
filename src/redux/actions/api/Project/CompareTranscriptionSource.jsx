import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CompareTranscriptionSource extends API {
  constructor(taskId,listCompareSources, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.COMPARE_TRANSCRIPTION_SOURCE;
    this.taskId = taskId;
    this.listCompareSources = listCompareSources
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.task}${taskId}/compare_sources/`;
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
        list_compare_sources: this.listCompareSources
    }
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
