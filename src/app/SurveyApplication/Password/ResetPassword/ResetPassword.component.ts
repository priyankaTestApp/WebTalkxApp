import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ResetPassword',
  templateUrl: './ResetPassword.component.html',
  styleUrls: ['./ResetPassword.component.css']
})

export class ResetPasswordComponent implements OnInit {
  title: string;
  passworderror: string;
  UserID: number;
  model: any = {};
  year: number = new Date().getFullYear();

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    this.title = "Reset password | " + appcmp.title;
  }
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.passworderror = "";
    this.UserID = Number(localStorage.getItem('UserID'));
  }


  onSubmit(form: NgForm) {

    if (form.valid) {

      //showing loader after login
      this.appcmp.showLoader = true;
      let resetPasswordObj: any = {};

      resetPasswordObj.UserID = this.UserID;
      resetPasswordObj.Password = form.value.Password;
       
      return this.http
      .put(`${environment.domainApi}I2BForgotPassword/ResetUserPassword`, resetPasswordObj).subscribe(res=>{
        this.model.usertextmsg = "";
        
        //console.log("Password Changed", res);
        if (res[0]['ResponseStatus'] == 'Success') {
          this.router.navigateByUrl('/Login');
          //hiding loader after login
          this.appcmp.showLoader = false;
          //this._notificationservice.success("Your password has changed successfully.");
        }
        else {
         // this.passworderror = "Password not matched";
          //this._notificationservice.error(GlobalVariable.TechnicalError);
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });
      
    }
  }
}
