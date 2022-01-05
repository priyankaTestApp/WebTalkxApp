import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { GlobalVariable } from '../../../../globals';

@Injectable()
export class I2BApplicationRequestsFromMeService {
  
  constructor(private http: Http, private httpc: HttpClient) { }

  //Method to get the reference request details
  GetRefRequestDetails(reqObj) {

    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRequestedFromMe', reqObj);
  }

  //Method to get session and token
  GetSessionAndToken(requester) {
    return this.httpc.post(GlobalVariable.APIUrl + 'RefRecording/InsertRefRecording', requester);
  }

  //Method to delete the reference recording 
  DeleteRefRecording(recording) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'ReferenceGiver/InsertReferenceGiver', recording).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'ReferenceGiver/InsertReferenceGiver', recording);
  }


}
