import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class FetchTranscriptionChartAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_TRANSCRIPTION_CHART;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.transcript
    }get_report_transcript/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.searchData = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return false;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.searchData;
  }
}
