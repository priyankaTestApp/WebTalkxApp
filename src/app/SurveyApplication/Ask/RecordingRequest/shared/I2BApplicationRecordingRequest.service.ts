import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { GlobalVariable } from '../../../../globals';

@Injectable()
export class I2BApplicationRecordingRequestService {

  constructor(private http: Http, private httpc: HttpClient) { }
  
  //Method to submit the recording request
  SubmitRecordingRequest(request) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/InsertRecordingRequest', request);
  }

  //Method to submit the recording request
  UpdateRecordingRequest(request) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateRecordingRequest', request);
  }

  //Method toinsert the reference recording question 
  InsertRecordingRequestQuestion(question) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/InsertRecordingQuestions', question);
  }
  
  //Method toinsert the reference recording question 
  UpdateRecordingRequestQuestions(question) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateRecordingRequestQuestions', question);
  }

  //Method to save the recording
  SaveRecordingRequest(reqObj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateRecordingStatus', reqObj);
  }

  //Method to save the giver
  giverCreation(giverObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/InsertGiverCreation', giverObj);
  }
  
  //Method to get the recording details
  GetRecordingDetails(recObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestByID', recObj);
  }

  //Method to get the recording questions
  GetRecordingRequestQuestions(recObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', recObj);
  }
  //Method to get the users by email..
  GetUserByEmail(email: string) {
    const obj = {
      EmailID: email
    };
    return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/GetUserDetailsByEmail', obj);
  }

  //Method to Select my favourite question 
  SelectMyFavoriteQuestion(reqObj) {
    return this.httpc.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/SelectMyFavoriteQuestion', reqObj);
  }
}
