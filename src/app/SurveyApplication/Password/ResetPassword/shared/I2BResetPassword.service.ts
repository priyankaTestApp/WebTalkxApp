
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../../../../globals';


@Injectable()
export class I2BResetPasswordService {

  constructor(private http: HttpClient) { }

  public handleError(error: any) {
    console.log(error);
    //return Observable.throw(error.json());

  }

  resetPassword(requester) {
    return this.http.put(GlobalVariable.APIUrl + 'I2BForgotPassword/ResetUserPassword', requester);

  }
}



