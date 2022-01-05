import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../../../../globals';


@Injectable()
export class I2BApplicationChangePasswordService {
  
  constructor(private http: HttpClient) { }

  //ChangePassword(requester) {
  //  debugger;
  //  return this.http.put(GlobalVariable.APIUrl + 'I2B_Users/ChangePassword?UserID=' + requester.UserID + '&NewPassword=' + requester.NewPassword + '&AuthorID=' + requester.AuthorID + '&OldPassword=' + requester.OldPassword, requester);
  //}

  ChangePassword(requester)  {
    return this.http.put(GlobalVariable.APIUrl + 'I2B_Users/ChangePassword', requester );
  }


  public handleError(error: any) {
    //console.log(error);
    //return Observable.throw(error.json());
    ;
  }
}
