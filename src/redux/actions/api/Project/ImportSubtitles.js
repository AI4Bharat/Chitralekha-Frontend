import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class ImportSubtitlesAPI extends API {
  constructor(id, file, timeout = 2000) {
    super("POST", timeout, false);
    this.id = id;
    this.file = file;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.task
    }${id}/import_subtitles`;
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

  getFormData() {
    const data = new FormData();
    data.append("subtitles", this.file);

    return data;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
