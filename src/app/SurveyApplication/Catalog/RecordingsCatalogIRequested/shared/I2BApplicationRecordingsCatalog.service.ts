import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { GlobalVariable } from '../../../../globals';

@Injectable()
export class I2BApplicationRecordingsCatalogService {

  constructor(private http: Http, private httpc: HttpClient) { }

  //Method to submit the recording request
  GetRecordingListByUserID(recordingObj) {
    
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetFineshedRecordingRequest', recordingObj);
  }

  //Method toinsert the reference recording question 
  InsertRecordingRequestQuestion(question) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/InsertRecordingQuestions', question);
  }

  //Method to check the existing email
  isEmailRegisterd(email) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2B_Users/CheckUserEmail?Email=' + email);
  }

  //Method to create the reviewer
  CreateReviewer(RevObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/InsertReviewerDetails', RevObj);
  }

  //Method to get the reviewer's list
  GetReviewerList(UserObj) {
    //return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetAllReviewer', UserObj);
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetUsersForReviewDDL', UserObj);
  }

  ////Method to get the my network user's list
  //GetMyNewtworkUser(UserObj) {
  //  return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetAllReviewer', UserObj);
  //}

  //Method to send invitation to the reviewer
  SendInvitationToReviewer(RecordObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/AssignedRequestToReviewer', RecordObj);
  }
  //Get the question from recording request specific
  GetRefRequestQuestions(ReferenceObj) {

    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', ReferenceObj);
  }
}
