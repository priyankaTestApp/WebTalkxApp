import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { GlobalVariable } from '../globals';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ErrorMessagesService } from '../services/error-messages.service';
import { CommonServiceService } from '../Service/common-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoggenIn :boolean=true;  
  model: any = {};
  signupmodel: any = {};
  form: FormGroup;
  title: string;
  loader_cont;
  year: number = new Date().getFullYear();
  IsIndividual: boolean = true;
  loginerror: string;
  erroruser: string = '';
  UserID: number;
  rid: number;
  isActiveUser: boolean = false;
  type: string;
  credentialError: boolean = false;
  errors:any;
  public errorMessage: string = '';

  constructor(private toastr: ToastrService, private commonService:CommonServiceService,private errorService:ErrorMessagesService,private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    //if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null ) {
    //  this.router.navigateByUrl('/Login');
    //}
  }

  ngOnInit(): void {
    


    this.appcmp.loadermessage = 'Please wait...';

    this.signupmodel.EmailId = '';
    this.signupmodel.PasswordText = '';
    localStorage.removeItem('LinkedIn');

    this.activatedRoute.params.subscribe(routeParams => {
      //console.log('routeParams 1', routeParams);
      //console.log('UserID', routeParams.id);
      //debugger;
      if (routeParams && (routeParams.Userid || routeParams.Requestid || routeParams.Type)) {
        //localStorage.setItem('RefRequestID', routeParams.id);
        //localStorage.setItem('RefRecordingID', routeParams.id);
        let uid: number;
        if (routeParams.Userid) uid = routeParams.Userid;
        if (routeParams.Requestid) this.rid = routeParams.Requestid;
        if (routeParams.Type) this.type = routeParams.Type;
        
        if (uid && this.rid && this.type) {
          //this.getUsersDetails(uid);
          this.router.navigateByUrl('/Signup/' + uid + '/' + this.rid + '/' + this.type);
        } else if (uid && this.rid) {
          //this.getUsersDetails(uid);
          this.router.navigateByUrl('/Signup/'+uid + '/' + this.rid);
        } else if (uid) {
          //this.getUsersDetails(uid);
          this.router.navigateByUrl('/Signup/'+uid);
        }
        //getting recording status
        //if (rid) this.getRecordingStatus(rid);

      } else {
        //this.router.navigateByUrl('/ReferenceApplication/Error');
      }
    });
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
           
            //Method to switch the tab
            this.switchTheTab();

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

  onSubmit(form) {
    /*if (this.model.Email == 'admin@webtalkx.com' && this.model.Password == 'Webtalkx2021') {
      localStorage.setItem('LoginUserID', '6352');
      localStorage.setItem('UserID', '6352');
      this.router.navigateByUrl('/I2BApplication/Dashboard');
    } else {
      this.credentialError = true;
    }*/
    
    //showing loader icon
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Please wait...';

    //Here the default admin login email and password
    if (this.model.Email == "admin@webtalkx.com") {
      if (this.model.Password == "Webtalkx2021") {
        localStorage.setItem('LoginFullName', "Admin");
        localStorage.setItem('LoginUserID', "0");
        localStorage.setItem('UserID', "0");
        localStorage.setItem('FirstName', 'Admin');

        this.router.navigateByUrl('/I2BApplication/Dashboard');

        //hiding loader after login
        this.appcmp.showLoader = false;
      } else {
        this.credentialError = true;
      }
    } else {
      
      //Except admin, method to check credentials from DB
      this.UserLogin(form.value);
    }
  }
  
  //Method to switch the tab
  switchTheTab() {

    this.router.navigateByUrl('/Signup');
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
          if (this.isActiveUser) this.erroruser = "This email has been already registered.";
          else this.erroruser = "";
          
        } else {
          this.erroruser = "";
          this.isActiveUser = res[0]['IsActive'];
        }
      });
      
      
    } else {
      this.erroruser = "";
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
        //this.commonService.UserLogin(loginObj).subscribe(res=>{
        //Check length
        let data = Object.keys(res).length;
        if (data > 0) {
          //If success then set few values into the local storage as per the logged persona
          if (res[0]['ResponseStatus'] == 'Success') {
           // localStorage.setItem('Token',String(res))

           //for auth gaurd 
            localStorage.setItem('Token', JSON.stringify(true))
            
           // this.isLoggenIn.next(true)
            localStorage.setItem('LoginUserID', res[0]["UserID"]);
            localStorage.setItem('UserID', res[0]["UserID"]);
            localStorage.setItem('LoginFullName', res[0]["FirstName"] + " " + res[0]["LastName"]);
            localStorage.setItem('RoleCheck', res[0]["RoleID"]);
            localStorage.setItem('FirstName', res[0]["FirstName"]);
            localStorage.setItem('ProfileImageName', res[0]["ProfileImageName"]);
            localStorage.setItem('LinkedIn', res[0]["LinkedIn"]);
            localStorage.setItem('EmailID', res[0]["EmailID"]);

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
            
            //this.loginerror = "";
            this.credentialError = false;
            //hiding loader after login
            this.appcmp.showLoader = false;

          } 
            
            //this.loginerror = "Sign in credentials are invalid.";
            this.credentialError = true;
            //hiding loader after login
            this.appcmp.showLoader = false;
          
        } else {
          //this.loginerror = "Sign in credentials are invalid.";
          this.credentialError = true;
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });
      
      

    }
  }


}
