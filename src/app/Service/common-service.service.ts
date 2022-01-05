import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
//import { Http } from '@angular/http';
import { GlobalVariable } from '../globals';
//import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { BehaviorSubject, Observable, observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/observable/throw';


@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private httpc: HttpClient) { }
  
  //Method to perform user login
  // UserLogin(loginObj:any):Observable<Object>{
  //   // return this.httpc.post(GlobalVariable.APIUrl + 'I2B_Users/LoginUser', loginObj);
  //   return this.httpc.post(`${environment.domainApi}I2B_Users/LoginUser`, loginObj).pipe(catchError(this.errorHandler));
  // }

  errorHandler(error : HttpErrorResponse)
  {
  return throwError( 'Server Error');
    
  }
  
  //Method to perform user login
  GetAccountDatabyEmail(emailObj): Observable<Object> {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getaccountdatabyemail', emailObj);
  }
  
  //Method to get the question
  GetSurveyQuestions(Obj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BRecordingRequest/GetRecordingRequestQuestions', Obj);
  }
  
  //get unread notification by user id for I2B
  GetUnReadNotifications(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BNotifications/GetUnReadNotificationsCount?UserID=' + uid);
  }
  
  //get Dashboard data by user ID
  DashboardData(uid) {
    return this.httpc.post(GlobalVariable.APIUrl + 'I2BDashboard/GetUserDashboard', uid);
  }
  //get unread message by user id
  GetUnReadMessages(uid) {
    return this.httpc.get(GlobalVariable.APIUrl + 'I2BMessages/GetUnReadMessageCount?UserID=' + uid);
  }
  
  //Method to perform user login
  VerifyPasswordpReset(passResetObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/verifyresetpassword', passResetObj);
  }
  
  //Method to perform issue reset password
  IssuePasswordReset(issuePassObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/issuepasswordreset', issuePassObj);
  }
  
  //Method to perform user verification
  VerifyUser(verifyuserObj) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/verifyuser', verifyuserObj);
  }
    
  //Method to perform user verification
  GetPartners() {
    return this.httpc.get(GlobalVariable.APIUrl + 'cardnmore/getpartnerbyid');
  }
  
  //Method to perform user verification
  GetPartnerbyHostName(hostnameObj:string) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getpartnerbyhostname', hostnameObj);
  }
  
  //Method to perform user verification
  GetPartnerbyHostId(partnerid:number) {
    return this.httpc.post(GlobalVariable.APIUrl + 'partners/getpartner', partnerid);
  }
  
  //Method to perform user verification
  GetRewardsbyPartnerId(partnerObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getrewardsbypartnerid', partnerObj);
  }
    
  //Method to perform user verification
  GetRewardsbyCustomerid(partCustObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'rewards/getrewardsbycustomerid', partCustObj);
  }
  
  //Method to perform user verification
  GetClaimedRewardsbyCustomerId(pid:number, cid:number) {
    return this.httpc.get(GlobalVariable.APIUrl + 'rewards/getclaimedrewardsbycustomerid?partnerid='+pid+'&customerid='+cid);
  }
  
  //Method to perform user verification
  GetTransactionsbyCustomerAndDateRange(transactionObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/gettransactionsbycustomeranddaterange', transactionObj);
  }
  
  //Method to get last 5 transaction
  Get5TransactionsbyCustomer(transactionObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getlast5transactionsbycustomer', transactionObj);
  }
    
  //Method to perform user verification
  GetNewsFeedDetails(customerObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getpartnernewsfeed', customerObj);
  }
    
  //Method to perform user verification
  GetTotalAmount(customerObj:any) {
    return this.httpc.post(GlobalVariable.APIUrl + 'cardnmore/getcustomertotals', customerObj);
  }

}
