import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ForgotPassword',
  templateUrl: './ForgotPassword.component.html',
  styleUrls: ['./ForgotPassword.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  model: any = {}
  form: FormGroup;
  loader_cont;
  title: string;
  UserID: number;
  enteruser: string;
  year: number = new Date().getFullYear();

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    this.title = appcmp.title + " | Forgot password";
  }
    //setting the page title

   
  ngOnInit() {
    this.titleService.setTitle(this.title);
    
    let email = localStorage.getItem('EmailAddress');
    if (email && email != "undefined") this.model.Email = email;
    let forgotemail = localStorage.getItem('ForgotEmail');
    if (forgotemail && forgotemail != "undefined") this.model.Email = forgotemail;

    //Once done, remove from local storage
    localStorage.removeItem('EmailAddress');
    localStorage.removeItem('ForgotEmail');

  }
   
  //Method to submit
  onSubmit(form: NgForm) {
    //to start loader  
    this.appcmp.showLoader = true;
    let forgotPWObj: any = {};

    forgotPWObj.Email = form.value.Email;
    
    return this.http
    .get(`${environment.domainApi}I2BForgotPassword/ResetPasswordByEmail?Email=` + forgotPWObj.Email).subscribe(res=>{
      
      if (res[0]['ResponseStatus'] == 'Success') {
        if (res[0]['UserID'] > 0) {
          this.appcmp.showLoader = false;
          //this._notificationservice.success("Link and verification code has been sent to your email. Please check your email.");
          //to reset the form
          form.resetForm();
          this.router.navigateByUrl('/Login');

        } else {
          //to stop loader  
          this.appcmp.showLoader = false;
          //this._notificationservice.error("Please enter correct email.");
        }
      }
    });
  }

}
