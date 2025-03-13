import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateGlossaryAPI extends API {
  constructor(userId, sentences, taskId="", timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.CREATE_GLOSSARY;

    this.userId = userId;
    this.taskId = taskId;
    this.sentences = sentences;

    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.glossary}`;
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
      userID: this.userId,
      sentences: this.sentences,
      task_id: this.taskId
    };
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
