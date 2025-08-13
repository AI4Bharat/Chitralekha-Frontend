import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";

export default class SaveTranscriptAPI extends API {
  // static isSaveInProgress = false;

  constructor(payload, taskType, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_TRANSCRIPT;
    this.payload = payload;
    this.payloadEndpoint = taskType?.includes("TRANSCRIPTION")
      ? ENDPOINTS.transcript
      : taskType?.includes("VOICEOVER")
      ? ENDPOINTS.voiceover
      : ENDPOINTS.translation;
    this.endpoint = `${super.apiEndPointAuto()}${
      this.payloadEndpoint
    }save/`;
  }

  // static setSaveInProgress(status) {
  //   SaveTranscriptAPI.isSaveInProgress = status;
  // }

  // static shouldSkipAutoSave() {
  //   return SaveTranscriptAPI.isSaveInProgress;
  // }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
      
      // Track time spent when saving (only if session_start is provided)
      if (this.payload.session_start) {
        this.updateTimeSpent();
      }
    }
  }


  updateTimeSpent() {
    // proper URL construction by ensuring proper slashes
    const baseUrl = super.apiEndPointAuto();
    console.log('Base URL:', baseUrl);
    console.log('Task ID:', this.payload.task_id);
    
    // Ensure baseUrl ends with a slash
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const updateTimeEndpoint = `${cleanBaseUrl}task/api/${this.payload.task_id}/update_time_spent/`;
    
    console.log('Calling time tracking URL:', updateTimeEndpoint);
    
    fetch(updateTimeEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        session_start: this.payload.session_start,
        session_end: new Date().toISOString()
      })
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Time tracking updated successfully:', data);
    })
    .catch(error => {
      console.error('Error updating time spent:', error);
      
      // Try alternative URL pattern without 'api'
      console.log('Trying alternative URL pattern...');
      const altUpdateTimeEndpoint = `${cleanBaseUrl}task/${this.payload.task_id}/update_time_spent/`;
      console.log('Alternative URL:', altUpdateTimeEndpoint);
      
      return fetch(altUpdateTimeEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          session_start: this.payload.session_start,
          session_end: new Date().toISOString()
        })
      })
      .then(response => {
        console.log('Alt response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log('Time tracking updated with alt URL:', data))
      .catch(altError => console.error('Both URL patterns failed:', altError));
    });
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.payload;
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
