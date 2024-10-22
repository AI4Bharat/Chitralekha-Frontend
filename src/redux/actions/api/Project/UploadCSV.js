import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class UploadCSVAPI extends API {
  constructor(apiType = "project", id, csv, regenerate, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.UPLOAD_CSV;

    this.id = id;
    this.csv = csv;

    this.body =
      apiType === "project"
        ? {
            csv: this.csv,
            project_id: +this.id,
          }
        : {
            csv: this.csv,
            org_id: +this.id,
          };

    if(regenerate){
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.voiceover}csv_bulk_regenerate`;
    }else{
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.video}${
        apiType === "project" ? "upload_csv_data" : "upload_csv_org"
      }`;
    }
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
    return this.body;
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
