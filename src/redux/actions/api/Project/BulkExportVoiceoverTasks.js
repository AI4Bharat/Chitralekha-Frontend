import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "redux/constants";

export default class BulkExportVoiceoverTasksAPI extends API {
  constructor(taskIds, timeout = 2000) {
    super("GET", timeout, false);

    this.type = constants.BULK_EXPORT_VOICEOVER_TASK;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.voiceover
    }bulk_export_voiceover/?task_ids=${taskIds}`;
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
