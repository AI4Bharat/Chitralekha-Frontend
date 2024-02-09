import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class CreateBulkProjectsAPI extends API {
  constructor(projectId, projectTitles, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.CREATE_BULK_PROJECTS;
    this.projectId = projectId;
    this.projectTitles = projectTitles;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.project
    }create_bulk_projects/`;
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
      titles: this.projectTitles,
      project_id: this.projectId,
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
