import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgModel } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-confirmation-code',
  templateUrl: './ConfirmationCode.component.html',
  styleUrls: ['./ConfirmationCode.component.css']
})
export class ConfirmationCodeComponent implements OnInit {
  title: string;
  model: any = {}
  form: FormGroup;
  loader_cont;
  confirmuser: string = '';
  UserID: number;
  year: number = new Date().getFullYear();

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    this.title = "Reset password | " + appcmp.title;

  }

  ngOnInit() {
    this.titleService.setTitle(this.title);

    this.activatedRoute.params.subscribe(routeParams => {
      
      if (routeParams && routeParams.id) {
        localStorage.setItem('UserID', routeParams.id);
        let uid = routeParams.id;

        this.UserID = uid;
      }
    });

  }

  //OnSubmit method
  onSubmit(form: NgForm) {

    if (form.valid) {
      this.appcmp.showLoader = true;
      // form.value.UserID = Number(localStorage.getItem('UserID'));
      form.value.UserID = this.UserID;

      return this.http
      .put(`${environment.domainApi}I2BForgotPassword/VerifyCode`, form.value).subscribe(res=>{
        debugger
        if (res[0]['ResponseStatus'] == 'Success') {
          this.appcmp.showLoader = false;
          this.router.navigateByUrl('/ResetPassword');
          //this._notificationservice.success("We have successfully verified code");
        } else {
          this.confirmuser = 'Please enter valid code.';
          //this._notificationservice.error("Please enter valid code");
          this.appcmp.showLoader = false;
        }
      });
      
      /*this.confirmCodeService.confirmUserIfExist(form.value).subscribe(res => {
        
        if (res[0]['ResponseStatus'] == 'Success') {
          this.appcmp.showLoader = false;
          this.router.navigateByUrl('/ResetPassword');
          this._notificationservice.success("We have successfully verified code");
        } else {
          this.confirmuser = 'Please enter valid code.';
          this._notificationservice.error("Please enter valid code");
          this.appcmp.showLoader = false;
        }

      });*/
    }

  }
}
