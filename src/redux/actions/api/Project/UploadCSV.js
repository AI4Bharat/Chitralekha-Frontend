import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class UploadCSVAPI extends API {
  constructor(id, file, timeout = 2000) {
    super("POST", timeout, false);
    this.file = file;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.video
    }upload_csv?project_id=${id}`;
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
    const formData = new FormData();
    formData.append("csv", this.file[0]);

    return formData;
  }

  getBody() {
    return this.data;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        // "Content-Type": "multipart/form-data",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.report;
  }
}
