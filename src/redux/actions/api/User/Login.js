/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 
 export default class LoginAPI extends API {
   constructor(username, password, timeout = 2000) {
     super("POST", timeout, false);
     this.username = username;
     this.password = password;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.users}login/`;
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
       username: this.username,
       password: this.password,
     };
   }
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.report
   }
 }
 