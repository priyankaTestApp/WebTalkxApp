import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { I2BApplicationOpenReferenceRequestsModel } from './I2BApplicationOpenReferenceRequestsModel.model';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { GlobalVariable } from '../../../../globals';

@Injectable()
export class I2BApplicationOpenReferenceRequestsService {
  ModelProfile: I2BApplicationOpenReferenceRequestsModel;
  RecordingRequestList: I2BApplicationOpenReferenceRequestsModel[];

  constructor(private http: Http, private httpc: HttpClient) { }

  //Method to get the reference request details
  GetRefRequestDetails(reqObj) {

    /* return this.http.get(GlobalVariable.APIUrl + 'RefRequest/GetScheduledRefRequest').map((data: Response) => {
       return data.json() as takeinterviewModel[];
     }).toPromise().then(x => {
       this.RecordingRequestList = x;
     })*/

    //return this.httpc.get(GlobalVariable.APIUrl + 'RefRequest/GetScheduledRefRequest');
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequest', reqObj);
  }

  //Method to get session and token
  GetSessionAndToken(requester: I2BApplicationOpenReferenceRequestsModel) {
    return this.httpc.post(GlobalVariable.APIUrl + 'RefRecording/InsertRefRecording', requester);
  }

  //Method to delete the reference recording 
  DeleteRefRecording(recording) {
    //return this.httpc.put(GlobalVariable.APIUrl + 'ReferenceGiver/InsertReferenceGiver', recording).map(res => res);
    return this.httpc.put(GlobalVariable.APIUrl + 'ReferenceGiver/InsertReferenceGiver', recording);
  }

  //Get the question from recording request specific
  GetRefRequestQuestions(ReferenceObj) {
    
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', ReferenceObj);
  }


}
