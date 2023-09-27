import API from "../../../api";
import C from "../../../constants";

export default class FetchTaskFailInfoAPI extends API {
  constructor(id, taskType = "TRANSLATION_EDIT", timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.GET_TASK_FAIL_INFO;
    this.taskType = taskType;

    this.id = id;

    this.query = !taskType.includes("VOICEOVER")
      ? `/task/${id}/get_fail_info/`
      : `/voiceover/get_empty_audios/?task_id=${id}`;

    this.endpoint = `${super.apiEndPointAuto()}${this.query}`;
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
