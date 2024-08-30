import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";
import moment from "moment";

export default class FetchOrganizationReportsAPI extends API {
  constructor(
    id,
    endPoint,
    limit,
    offset,
    task_type = "",
    filter,
    taskStartDate = moment().format("YYYY-MM-DD"),
    taskEndDate = moment().format("YYYY-MM-DD"),
    timeout = 2000
  ) {
    super("GET", timeout, false);
    const params = new URLSearchParams();
    params.append("filter", JSON.stringify(filter));
    this.type = C.GET_ORGANIZATION_REPORTS;
    this.endpoint =
      endPoint === "get_report_languages"
        ? `${super.apiEndPointAuto()}${
            ENDPOINTS.organization
          }${id}/${endPoint}/?limit=${limit}&offset=${offset}&task_type=${task_type}`
        : `${super.apiEndPointAuto()}${
            ENDPOINTS.organization
          }${id}/${endPoint}/?limit=${limit}&offset=${offset}&taskStartDate=${taskStartDate}&taskEndDate=${taskEndDate}`+`&${params.toString()}`;
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
