import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class ReopenTaskAPI extends API {
  constructor(id, delete_voiceover_and_reopen=false, taskType="", timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.REOPEN_TASK;
    this.delete_and_reopen=delete_voiceover_and_reopen;
    this.id = id;

    this.endpoint = taskType.includes("VOICEOVER") ? `${super.apiEndPointAuto()}/voiceover/reopen_translation_voiceover_task/` : 
    `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }${id}/reopen_translation_task/?delete_voiceover_and_reopen=${delete_voiceover_and_reopen}`;
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
    return {task_id: this.id};
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
