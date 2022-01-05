import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
//import { I2BApplicationChangePasswordService } from './shared/I2BApplicationChangePassword.service';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { GlobalVariable } from '../../../globals';
//import { NotificationService } from '../../../toastr-notification/toastr-notification.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changepassword',
  templateUrl: './ChangePassword.component.html',
  styleUrls: ['./ChangePassword.component.css']
})

export class ChangePasswordComponent implements OnInit {
  title: string;
  model: any = {}
  form: FormGroup;
  passworderror: string;
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent, public surveyCmp: SurveyApplicationComponent) {
    //this.title = "Change password | " + appcmp.title;
    this.title = appcmp.title + " | Change password";
    if (localStorage.getItem('LoginUserID') == "" || localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }
  }

  // Page init method.
  ngOnInit() {
    //Added below code to update the title
    this.titleService.setTitle(this.title);
    localStorage.setItem('InProgress', '');
    this.passworderror = "";

    this.surveyCmp.showNavigation = true;
  }

  // Call change password function
  onSubmit(form: NgForm) {
    if (form.status == "VALID") {
      this.ChangePassword(form)
    }
  }

  // Function for update password.
  ChangePassword(form: NgForm) {
    //showing loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Please wait...';

    if (localStorage.getItem('UserID') != "") {
      let changeObj: any = {};
      
      changeObj.UserID = localStorage.getItem('UserID');
      changeObj.AuthorID = localStorage.getItem('UserID');

      changeObj.OldPassword = form.value.OldPassword;
      changeObj.NewPassword = form.value.NewPassword;

      return this.http
      .put(`${environment.domainApi}I2B_Users/ChangePassword`, changeObj).subscribe(res=>{
        
        if (res[0]['ResponseStatus'] == 'Success') {
          //this._notificationservice.success("Password updated successfully. You need to log in again.");
         
            this.router.navigateByUrl('/Login');
         
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
        else {
          //this._notificationservice.error("Current password is wrong.");
          this.passworderror = "Current password is wrong.";
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });

      /*
      this.changepwdservice.ChangePassword(changeObj).subscribe(res => {
        success => alert("Password Changed");
        console.log("Password Changed", res);
        if (res[0]['ResponseStatus'] == 'Success') {
          this._notificationservice.success("Password updated successfully. You need to log in again.");
         
            this.router.navigateByUrl('/Login');
         
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
        else {
          this._notificationservice.error("Current password is wrong.");
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          this._notificationservice.error(GlobalVariable.TechnicalError);
          //hiding loader after login
          this.appcmp.showLoader = false;
        });
        */
    } else {
      this.router.navigateByUrl('/Login');
      //hiding loader after login
      this.appcmp.showLoader = false;
    }
  }



}
