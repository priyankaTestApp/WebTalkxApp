import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {

  constructor(private http:HttpClient,private router: Router) { }

  // errMessages:any = {
  //   UNKNOWN : 'An unknown error is occured.',
  //   EMAIL_EXISTS : 'This email is already exist.',
  //   OPERATION_NOT_ALLOWED : 'Password sign-in is disabled for this project',
  //   EMAIL_NOT_FOUND: 'This email is invalid.',
  //   INVALID_PASSWORD : 'This password is incorrect.'
  // }

  public errorMessage: string = '';
 
 
 
  public handleError = (error: HttpErrorResponse) => {
    //this.createErrorMessage(error);
  }
 
  
 
  // private createErrorMessage = (error: HttpErrorResponse) => {
  //   console.log('error------------',error )
  //   //this.errorMessage = error.error ? error.error : error.message;
  //  // this.errorMessage =   `Error Status: ${error.status}\nMessage: ${error.message}`;

  //  this.errorMessage =   `${error.message}`;
   
  //   console.log('------------',this.errorMessage )
  // }
  private createErrorMessage = (error: HttpErrorResponse) => {
    //let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        this.errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        this.errorMessage = `Error Status: ${error.status}\nMessage: ${error.statusText}`;
    }
   // console.log(this.errorMessage);
    return throwError(this.errorMessage);
  }
}
