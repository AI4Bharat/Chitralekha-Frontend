/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import C from "../../../constants";
 
 export default class LoginAPI extends API {
   constructor(email, password, timeout = 2000) {
     super("POST", timeout, false);
     this.type = C.GET_USER_ACCESS_TOKEN;
     this.email = email;
     this.password = password;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.users}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       localStorage.setItem('token', res.access);
        console.log("api login ---- ", res);
         this.report = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return {
       email: this.email,
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
 