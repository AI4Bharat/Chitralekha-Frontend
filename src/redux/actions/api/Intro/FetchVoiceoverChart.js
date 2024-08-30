import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class FetchVoiceoverChartAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_VOICEOVER_CHART;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.voiceover
    }get_report_voiceover/`;
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
