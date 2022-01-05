import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { GlobalVariable } from '../globals';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  model: any = {};
  signupmodel: any = {};
  form: FormGroup;
  title: string;
  loader_cont;
  year: number = new Date().getFullYear();
  loginerror: string;
  erroruser: string = '';
  UserID: number;
  rid: number;
  isActiveUser: boolean = false;
  type: string;
  
  constructor(private dialog: MatDialog,private appcmp: AppComponent, private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.appcmp.loadermessage = 'Please wait...';
    
    this.activatedRoute.params.subscribe(routeParams => {
      //console.log('routeParams 1', routeParams);
      //console.log('UserID', routeParams.id);
      
      if (routeParams && (routeParams.Userid)) {
        //localStorage.setItem('RefRequestID', routeParams.id);
        //localStorage.setItem('RefRecordingID', routeParams.id);
        let uid: number;
        if (routeParams.Userid) uid = routeParams.Userid;
        if (routeParams.Requestid) this.rid = routeParams.Requestid;
        if (routeParams.Type) this.type = routeParams.Type;
        
        if (uid) {
          this.getUsersDetails(uid);
        }
        //getting recording status
        //if (rid) this.getRecordingStatus(rid);

      } else {
        //this.router.navigateByUrl('/ReferenceApplication/Error');
      }
    });
  }

 


  onSignUpSubmit(form:NgForm){
    
    if (form.valid && !this.isActiveUser) {
      let userObj: any = {};

      if (this.UserID) {

        userObj.FirstName = form.value.FirstName;
        userObj.LastName = form.value.LastName;
        userObj.EmailID = form.value.EmailId;
        userObj.UserID = this.UserID;
        userObj.Password = form.value.Password;

        //showing loader icon
        this.appcmp.showLoader = true;
        this.appcmp.loadermessage = 'Please wait, creating user...';
        
        return this.http
        .post(`${environment.domainApi}I2B_Users/UpdateUserDetails`, userObj).subscribe(res=>{
          if (res[0]['ResponseStatus'] == 'Success') {

            if (this.rid) {

              let loginobj: any = {};
              loginobj.Email = userObj.EmailID;
              loginobj.Password = userObj.Password;
              this.appcmp.loadermessage = 'Please wait...';

              this.UserLogin(loginobj);

            } else {
              this.UserID = null;
              this.router.navigateByUrl('/SignupSuccess');
              //hidding loader icon
              this.appcmp.showLoader = false;
              this.appcmp.loadermessage = 'Please wait...';
            }
          }
        });

      } else {

        userObj.FirstName = form.value.FirstName;
        userObj.LastName = form.value.LastName;
        userObj.EmailID = form.value.EmailId;
        userObj.Password = form.value.Password;
        userObj.RoleID = 1;

        //showing loader icon
        this.appcmp.showLoader = true;
        this.appcmp.loadermessage = 'Please wait, creating user...';
        
        return this.http
        .post(`${environment.domainApi}I2B_Users/InsertUserCreation`, userObj).subscribe(res=>{
          if (res[0]['ResponseStatus'] == 'Success') {
            this.router.navigateByUrl('/SignupSuccess');
            //hidding loader icon
            this.appcmp.showLoader = false;
            this.appcmp.loadermessage = 'Please wait...';
          }
        });
      }
    }
  }
  
  //Method to get the users details
  getUsersDetails(uid) {
    if (uid) {
      let Obj: any = {};
      Obj.UserID = uid;

      //showing loader icon
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      
      return this.http
      .post(`${environment.domainApi}I2B_Users/GetUserDetails`, Obj).subscribe(res=>{
        if (res["length"] > 0) {
          
          if (res[0]['ResponseStatus'] == 'Success') {
            
            this.UserID = res[0]['UserID'];
            //this.signupmodel.EmailId = '';
            this.signupmodel.FirstName = res[0]['FirstName'];
            this.signupmodel.LastName = res[0]['LastName'];
            this.signupmodel.EmailId = res[0]['EmailID'];

            //Check the email is active user or not
            if (res[0]['EmailID']) this.onEmailEnter(res[0]['EmailID']);

            //hiding loader icon
            this.appcmp.showLoader = false;
            
          } else {

            //hiding loader icon
            this.appcmp.showLoader = false;
          }
        } else {

          //hiding loader icon
          this.appcmp.showLoader = false;
        }
      });
      
    }
  }
  
  //Method to check the existing email id
  onEmailEnter(email) {
    
    if (email != "") {
      /*let emailObj: any = {};
      emailObj.Email = email;*/
      
      return this.http
      .get(`${environment.domainApi}I2B_Users/CheckUserEmail?Email=` +email).subscribe(res=>{
          
        //Check length
        let data = Object.keys(res).length;
        if (data > 0) { }

        //If success then set few values into the local storage as per the logged persona
        if (res[0]['ResponseStatus'] == 'Success') {
          this.isActiveUser = res[0]['IsActive'];
          /*if (this.isActiveUser) this.erroruser = "This email has been already registered.";
          else this.erroruser = "";*/
          
        } else {
          //this.erroruser = "";
          this.isActiveUser = res[0]['IsActive'];
        }
      });
    } else {
      //this.erroruser = "";
      this.isActiveUser = false;
    }
  }
  
  // Function for login.
  UserLogin(formval) {
    
    if (formval) {
      let loginObj: any = {};

      loginObj.EmailID = formval.Email;
      loginObj.Password = formval.Password;
      
      return this.http
      .post(`${environment.domainApi}I2B_Users/LoginUser`, loginObj).subscribe(res=>{
        
        //Check length
        let data = Object.keys(res).length;
        if (data > 0) {
          //If success then set few values into the local storage as per the logged persona
          if (res[0]['ResponseStatus'] == 'Success') {

            localStorage.setItem('LoginUserID', res[0]["UserID"]);
            localStorage.setItem('UserID', res[0]["UserID"]);
            localStorage.setItem('LoginFullName', res[0]["FirstName"] + " " + res[0]["LastName"]);
            localStorage.setItem('RoleCheck', res[0]["RoleID"]);
            localStorage.setItem('FirstName', res[0]["FirstName"]);
            localStorage.setItem('ProfileImageName', res[0]["ProfileImageName"]);
            localStorage.setItem('LinkedIn', res[0]["LinkedIn"]);

            if (this.rid) {
              //res[0]["RoleID"] == 2
              if (this.type == 'record') {
                localStorage.setItem('RefRecordingID', String(this.rid));
                this.router.navigateByUrl('/I2BApplication/I2BHost');
                //res[0]["RoleID"] == 3
              } else if (this.type == 'invite') {
                this.router.navigateByUrl('/I2BApplication/RecordingsCatalogForMyReview');
              }
            } else {
              this.router.navigateByUrl('/I2BApplication/Dashboard');
            }
            //hiding loader after login
            this.appcmp.showLoader = false;
          } else {
            //hiding loader after login
            this.appcmp.showLoader = false;
          }
        } else {
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });

    }
  }
  

}
