import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { log } from 'util';


@Component({
  selector: 'app-SurveyApplication',
  templateUrl: './SurveyApplication.component.html',
  styleUrls: ['./SurveyApplication.component.css']
})
export class SurveyApplicationComponent implements OnInit {

  title: string;
  ProfileImage: string;
  public UserName: any;
  roleName: string;
  logout_option: any;
  public unreaditemcount: number;
  UserID: number;
  unreadmsgcount: number;
  datefooter: number = new Date().getFullYear();
  notificationList: any = {};
  domain_url: string;

  AsksCount: number = 0;
  RecordingsCount: number = 0;
  SharingCount: number = 0;
  MyNetworkCount: number = 0;
 
  //Assigning below project title as common name and getting passed to all the child component
  public showNavigation: boolean = true;

  constructor(private http: HttpClient, private titleService: Title, private appcmp: AppComponent, private router: Router) {
    this.title = appcmp.title;
    //if (localStorage.getItem('LoginUserID') == "" || localStorage.getItem('LoginUserID') == null) {
    //  this.router.navigateByUrl('/userlogin');
    //}

  }

  //@HostListener('document:keyup', ['$event'])
  //@HostListener('document:click', ['$event'])
  //@HostListener('document:wheel', ['$event'])

  // Method to init the admin js file.
  public initAdminScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/js/sb-admin-2.min.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {
    //this._commonservice.startTourEvent.subscribe((data) => {
    //  if (data && data.length > 0) {
    //    this.tour();
    //  }
    //  console.log(data);
    //});

    this.initAdminScript();

    localStorage.setItem('InProgress', '');
    localStorage.setItem('IsUploading', '');


    this.UserName = localStorage.getItem('LoginFullName');

    //converting user's first letter to be capital
    this.UserName = this.capital_letter(this.UserName);
    this.title = "Welcome " + this.title;
    this.roleName = localStorage.getItem('Role');
    if (this.roleName && this.roleName == 'Requester') this.roleName = 'Vendor';
    this.domain_url = `${environment.domainApi}`;

    if (localStorage.getItem("ProfileImageName") != "") {
      this.ProfileImage = localStorage.getItem("ProfileImageName");

      this.ProfileImage = this.ProfileImage.startsWith("https") ? this.ProfileImage : this.domain_url + 'ProfilePicture/' + this.ProfileImage;

    } else {
      this.ProfileImage = '../../assets/img/u_image6.png';
    }

    // this.ProfileImage = '../../assets/img/u_image6.png';

    //Added below code to update the title
    this.titleService.setTitle(this.title);

    //Method to get unread notification
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    //Method to get unread notification
   // this.GetUnreadNotificationCount(this.UserID);

    //Method to get unread message
    //this.GetUnreadMessageCount(this.UserID);
    //this.getAllNotifications(this.UserID);
   


    //  this.startSteps();
  }

  //method to get response of notification records using  @Output (when coutn=3)
  getNotificationsList(res) {
    
    this.notificationList = res;
  }

  //method to get the all the notification
  getAllNotifications(uid) {

    return this.http
      .get(`${environment.domainApi}I2BNotifications/GetNotifications?UserID=` + uid + '&Count=3').subscribe(res => {

        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {
            this.notificationList = res;
          } else if (res[0]['ResponseStatus'] == 'Failed') {
            this.notificationList = [];
          }
        } else {
          this.notificationList = [];
        }
      });
  }

  //Method to open the logout menu option
  /*openLogoutMenu(e) {

    let profilenotification = document.getElementsByClassName('profile-notification')[0];
    if (profilenotification && profilenotification.classList.contains('show')) {
      profilenotification.classList.remove('show');
    } else {
      profilenotification.className += ' show';
    }
  }*/


 
  //Method to redirect on to the inbox and hit the notification
  moveToNotification() {
    let isProgress = localStorage.getItem('InProgress');
    let IsUploading = localStorage.getItem('IsUploading');
    if (isProgress || IsUploading == 'Y') {

      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      localStorage.setItem('Notification', 'true');

      //redirecting to inbox page
      this.router.navigateByUrl('/I2BApplication/Inbox');
    }

  }

  //Method to redirect on to the inbox and hit the message
  moveToMessage() {
    let isProgress = localStorage.getItem('InProgress');
    if (isProgress) {

      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      localStorage.setItem('UnreadMessage', 'true');

      //redirecting to inbox page
      this.router.navigateByUrl('/I2BApplication/Inbox');
    }
  }

  //method for logout and clear the local storage.
  userLogout(e) {
    let isProgress = localStorage.getItem('InProgress');
    let IsUploading = localStorage.getItem('IsUploading');
    if (isProgress || IsUploading == 'Y') {

      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      //this.checkCookie();
      this.tourDisplayCookieSet();
      //this.dialogModalCookieSet();

      // this._commonservice.dialogModal = false;


      localStorage.removeItem('Role');
      localStorage.removeItem('LoginFullName');
      localStorage.removeItem('UserID');
      localStorage.removeItem('LoginUserID');
      localStorage.removeItem('ReplayCount');
      localStorage.removeItem('BusinessID');
      localStorage.removeItem('BusinessName');
      localStorage.removeItem('IsDashboard');
      localStorage.removeItem('LoginEmail');
      localStorage.removeItem('LoginPhotoPath');
      localStorage.clear();

      this.titleService.setTitle(this.title);

      //redirecting to inbox page
      this.router.navigateByUrl('/Login');

    }
  }

  //Method to redirect into the edit profile
  moveToEditProfile(e) {
    let isProgress = localStorage.getItem('InProgress');
    let IsUploading = localStorage.getItem('IsUploading');
    if (isProgress || IsUploading == 'Y') {
      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      //redirecting to edit profile page
      this.router.navigateByUrl('/I2BApplication/EditProfile');
    }
  }

  //Method to redirect into the change password
  moveToChangePassword(e) {
    let isProgress = localStorage.getItem('InProgress');
    let IsUploading = localStorage.getItem('IsUploading');
    if (isProgress || IsUploading == 'Y') {
      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      //redirecting to change password page
      this.router.navigateByUrl('/I2BApplication/ChangePassword');
    }
  }

  //Method to redirect into the Dashboard
  moveToDashboard(e) {
    let isProgress = localStorage.getItem('InProgress');
    let IsUploading = localStorage.getItem('IsUploading');
    if (isProgress || IsUploading == 'Y') {
      //Added hack to open model to show the company details
      //(<any>$('#inprogressModal')).modal('show');
    } else {
      //redirecting to dashboard page
      this.router.navigateByUrl('/I2BApplication/Dashboard');
    }
  }

  tourDisplayCookieSet() {

  }

  //dialogModalCookieSet() {
  //  if (!this._commonservice.checkCookie('infoDialogue')) {
  //    console.log('infoDialogue not found')
  //    this._commonservice.setCookie('infoDialogue', true, 1);
  //  }
  //}

  capital_letter(str) {

    if (str) {
      str = str.split(" ");

      for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }

      return str.join(" ");
    }
  }


  startSteps(): void {

  }

  //setting cookie
  setCookie(cname, cvalue, exdays?: any) {
    document.cookie = cname + '=' + cvalue + ';path=/';
  }

  //getting cookie
  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  //checking cookie
  checkCookie(cookie) {
    const user = this.getCookie(cookie);
    if (user !== '') {
      return true;
    } else {
      return false;
    }
  }

  //Method to logout
  Logout() {
    (<any>$('#logoutModal')).modal('hide');
    localStorage.clear();
    this.router.navigateByUrl('/Login');

  }
}

  //joyride steps
  //tour() {
  //  this.joyrideService.startTour(
  //    { steps: ['firstStep'] }
  //  );
  //}


 // joyride steps
  //tour() {
  //  this.joyrideService.startTour(
  //    { steps: [''] }
  //  );
  //}

  //joyRideTour() {
  //  setTimeout(() => {
  //    this.tour();
  //  });
  //}

  //joyride steps
  //tour() {
  //  this.joyrideService.startTour(
  //    { steps: ['firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep','sixthStep'] }
  //  );
  //}



