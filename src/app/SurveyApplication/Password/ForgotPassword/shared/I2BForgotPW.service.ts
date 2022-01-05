import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
//import { Observable } from 'rxjs/Rx';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../../../../globals';
import { I2BForgotPWModel } from './I2BForgotPW.model';

@Injectable()
export class I2BForgotPasswordService {
  forgetpass: I2BForgotPWModel;

  constructor(private http: HttpClient) { }

  public handleError(error: any) {
    //console.log(error);
    //return Observable.throw(error.json());
    ;
  }

  forgotPassword(requester: I2BForgotPWModel) {
    return this.http.get(GlobalVariable.APIUrl + 'I2BForgotPassword/ResetPasswordByEmail?Email=' + requester.Email);
  }


}
