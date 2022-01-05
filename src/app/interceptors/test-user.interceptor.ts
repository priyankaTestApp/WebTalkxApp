import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';
import {ToastrService} from 'ngx-toastr';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class TestUserInterceptor implements HttpInterceptor {
  

  constructor(private toastr: ToastrService,private router:Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                        errorMessage = `Error: ${error.error.message}`;
                        console.error("Error Event");
                    } else {
                        errorMessage = `Error Status: ${error.status} - ${error.statusText}`;
                        console.log(`error status : ${error.status} ${error.statusText}`);
                        this.toastr.error(errorMessage)
                        switch (error.status) {
                            case 401:      //login
                                this.router.navigateByUrl("/Login");
                                console.error("error - 401");
                                this.toastr.error(errorMessage)
                                break;
                            case 403:     //forbidden
                                //this.router.navigateByUrl("/unauthorized");
                                console.error("403  - unauthorized");
                                this.toastr.error(errorMessage)
                                break;
                        }
                    } 
                } else {
                    console.error("some thing else happened");
                    this.toastr.error(errorMessage)
                }
                return throwError(error);
               // console.log('Interceptor msg error-----',error);
                //console.log('Interceptor server-side error-----',errorMessage);
               
             
                
            })
        )
}
}
