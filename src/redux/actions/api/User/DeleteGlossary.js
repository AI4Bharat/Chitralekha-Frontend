import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class DeleteGlossaryAPI extends API {
  constructor(sentences, timeout = 2000) {
    super("DELETE", timeout, false);

    this.type = C.DELETE_GLOSSARY;

    this.sentences = sentences;

    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.glossary
    }delete_glossary/?sentences=${JSON.stringify(this.sentences)}`;
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
    return {};
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
