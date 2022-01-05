import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
//import { Observable } from 'rxjs/Rx';
//import { HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { I2BApplicationHostmodel } from './I2BApplicationHost.model';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { debuglog } from 'util';
import { GlobalVariable } from '../../../../globals';

@Injectable()
export class I2BApplicationHostService {

  questionList: I2BApplicationHostmodel[];
  constructor(private http: Http, private httpC: HttpClient) { }


  GetRefRequestQuestions(ReferenceObj) {
    //debugger
    //  return this.http.get('https://retegritysecurestg.ignatiuz.com/api/RefRequestEngFactQues/GetRefRequestEngFactQues?RefRequestID=' + Id).map((data: Response) => {
    /*return this.http.get(GlobalVariable.APIUrl + 'RefRequestEngFactQues/GetRefRequestEngFactQues?RefRequestID=' + Id).map((data: Response) => {
      return data.json() as hostmodel[];
    }).toPromise().then(x => {
      this.questionList = x;
    })*/

    //return this.httpC.get(GlobalVariable.APIUrl + 'RefRequestEngFactQues/GetRefRequestEngFactQues?RefRequestID=' + Id);
    return this.httpC.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', ReferenceObj);
  }
  
  GetCurrentArchiveDetails() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //debugger;
    // return this.http.get('https://retegritysecurestg.ignatiuz.com/api/RecordingArchive/GetCurrentArchiveDetails').map((response: Response) => response.json())
    // return this.http.get(GlobalVariable.APIUrl + 'RecordingArchive/GetCurrentArchiveDetails').map((response: Response) => response.json())
    //   .catch(this.handleError);
  }

  InterviewAsComplete(requester: I2BApplicationHostmodel) {
    //debugger;
    // return this.httpC.put('https://retegritysecurestg.ignatiuz.com/api/RefRequest/MarkInterviewAsComplete?RefRequestID=' + requester.RefRequestID + "&IsInterviewCompleted=true&AuthorID=0", requester);
    return this.httpC.put(GlobalVariable.APIUrl + 'RefRequest/MarkInterviewAsComplete?RefRequestID=' + requester.RefRequestID + "&IsInterviewCompleted=true&AuthorID=0", requester);
  }

  //Method to update the public consent
  updatePublicConsent(consentObj) {
    return this.httpC.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateReplayConsent', consentObj);
  }

  InsertAndGetCurrentArchiveDetails(requester: I2BApplicationHostmodel) {
    //debugger;
    // return this.httpC.post('https://retegritysecurestg.ignatiuz.com/api/RecordingArchive/InsertAndGetCurrentArchiveDetails', requester);
    return this.httpC.post(GlobalVariable.APIUrl + 'RecordingArchive/InsertAndGetCurrentArchiveDetails', requester);
  }

  StopArchiving(requester: I2BApplicationHostmodel) {
    //debugger;
    // return this.httpC.put('https://retegritysecurestg.ignatiuz.com/api/RecordingArchive/StopArchiving', requester);
    return this.httpC.put(GlobalVariable.APIUrl + 'RecordingArchive/StopArchiving', requester);
  }

  //StopArchiving(ArchiveID: String, RecordingArchiveID: Number, AuthorID: Number) {
  //  debugger
  //  return this.http.get('https://retegritysecurestg.ignatiuz.com/api/Login/LoginUser?ArchiveID=' + ArchiveID + "&RecordingArchiveID=" + RecordingArchiveID + "&AuthorID=" + AuthorID);
  //}


  InsertRecordingArchive(requester: I2BApplicationHostmodel) {
    //debugger;
    // return this.httpC.post('https://retegritysecurestg.ignatiuz.com/api/RecordingArchive/InsertRecordingArchive', requester);
    return this.httpC.post(GlobalVariable.APIUrl + 'RecordingArchive/InsertRecordingArchive', requester);
  }

  public handleError(error: any) {
    //console.log(error);
    //return Observable.throw(error.json());

  }

  Getrecording(ids: number) {
    //debugger
    //  return this.httpC.get('https://retegritysecurestg.ignatiuz.com/api/RefRequest/GetRefRequestByID?RefRequestID=' + ids);
    return this.httpC.get(GlobalVariable.APIUrl + 'RefRequest/GetRefRequestByID?RefRequestID=' + ids);
  }

  GetEngagementfacts(ids: number) {
    //debugger
    // return this.httpC.get('https://retegritysecurestg.ignatiuz.com/api/RefRequestEngFact/GetRefRequestEngFact?RefRequestID=' + ids);
    return this.httpC.get(GlobalVariable.APIUrl + 'RefRequestEngFact/GetRefRequestEngFact?RefRequestID=' + ids);
  }

  AnswereAndSkipQuestion(quesdata) {
    return this.httpC.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateRecordingQuestionStatus', quesdata);
  }

  GetRecordingHeadline(refObj) {
    //return this.httpC.get(GlobalVariable.APIUrl + 'RefRequest/GetRecodingReviewHeadline?RefRequestID=' + id);
    return this.httpC.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestUserDetails', refObj);
  }

  //Method to finish the recording
  FinishRecordingRequest(reqObj) {
    return this.httpC.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/FineshedRecordingRequest', reqObj);
  }

  //Method to save the recording
  SaveRecordingRequest(reqObj) {
    return this.httpC.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/UpdateRecordingStatus', reqObj);
  }

  //Method to delete the recording
  DeleteRecording(reqObj) {
    return this.httpC.put(GlobalVariable.APIUrl + 'I2BRecordingRequest/DeleteRecording', reqObj);
  }

  //Method to delete the recording
  ConvertRecordedFolderVideos(reqObj) {
    return this.httpC.post(GlobalVariable.APIUrl + 'RecordRTC/ConvertRecordedFolderVideos', reqObj);
  }

  //Method to delete the recording
  ConvertSingleRecordedFolderVideos(reqObj) {
    return this.httpC.post(GlobalVariable.APIUrl + 'RecordRTC/ConvertRecordedFile', reqObj);
  }
}
