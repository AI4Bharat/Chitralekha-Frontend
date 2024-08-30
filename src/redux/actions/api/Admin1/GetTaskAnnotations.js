import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetTaskAnnotationsAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_TASK_ANNOTATIONS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getVideoTasks}?video_id=${taskId}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.taskAnnotations = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {}

  getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Authorization token not found in localStorage');
    }

    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.taskAnnotations;
  }
}
