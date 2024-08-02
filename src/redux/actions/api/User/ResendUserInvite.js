
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
 
export default class ResendUserInviteAPI extends API {
   constructor(email, timeout = 2000) {
      super("POST", timeout, false);
      this.email = email;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.resetPassword}`;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.signup}regenerate/`;
   }  
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.resendinviteRes = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return {
      emails : this.email
    } 
}

 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
         "Authorization":`JWT ${localStorage.getItem('token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.resendinviteRes;
   }
 }
 