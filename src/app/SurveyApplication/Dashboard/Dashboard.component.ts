import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { GlobalVariable } from '../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SurveyApplicationComponent } from '../SurveyApplication.component';

@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: string;

  model: any = {};
  recordingList: any;

  UserID: number
  ReferenceRecording: number = 0;
  CharityRewards: number = 0;
  InfoPacks: number = 0;
  Replays: number;
  ReferenceReviewer: number;
  TeamMembers: number;
  unreaditemcount: number;
  unreadmsgcount: number;
  AsksCount: number = 0;
  RecordingsCount: number = 0;
  SharingCount: number = 0;
  MyNetworkCount: number = 0;
  notificationList:any = {};

  constructor(private titleService: Title, public surveyCmp: SurveyApplicationComponent, private http: HttpClient, private router: Router, private appcmp: AppComponent)
  {
    //getting below project title from app.component
    this.title = appcmp.title + " | Dashboard";
    
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

  }
  
  // Method for calling host js file.
  public hotSpotScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/jquery.hotspot.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // Method for calling host js file.
  public DemoScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/demo.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {
  
    this.titleService.setTitle(this.title);
    localStorage.setItem('InProgress', '');
    localStorage.setItem('IsUploading', '');
    //Scrolling window on top at initial 
    window.scroll(0, 0);

    //this.I2Bapp.showNavigation = true;
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    
    //Method to get unread notification
    //this.GetUnreadNotificationCount(this.UserID);

    //Method to get unread message
    //this.GetUnreadMessageCount(this.UserID);

    //getting dashboard data count
    this.I2BDashboardData();

    //this.joyrideService.closeTour();

    //this.openDialogue();
    // this.hotSpotScript();
    // this.DemoScript();
  }

  //method to get dashboard details
  getDashboardData(res) {
    console.log('dashoard details -----',res)
    this.UserID = res[0]['UserID'];
    this.AsksCount = res[0]['AsksCount'];
    this.RecordingsCount = res[0]['RecordingsCount'];
    this.SharingCount = res[0]['SharingCount'];
    this.MyNetworkCount = res[0]['MyNetworkCount'];
  }
  

  //Method for dashboard data
  I2BDashboardData() {
    
   //showing loader
   this.appcmp.showLoader = true;
   this.appcmp.loadermessage = 'Loading dashboard...';

    let RecordObj: any = {};
    RecordObj.UserID = this.UserID;
    
    let dataObj: any = {};
    dataObj.UserID = this.UserID;
      return this.http
        .post(`${environment.domainApi}I2BDashboard/GetUserDashboard`, dataObj).subscribe(res=>{
          if (res["length"] > 0) {
            if (res[0]['ResponseStatus'] == 'Success') {
              this.UserID = res[0]['UserID'];
              this.AsksCount = res[0]['AsksCount'];
              this.RecordingsCount = res[0]['RecordingsCount'];
              this.SharingCount = res[0]['SharingCount'];
              this.MyNetworkCount = res[0]['MyNetworkCount'];
              
              //hide loader
              this.appcmp.showLoader = false;
            } else {
              //hide loader
              this.appcmp.showLoader = false;
      
            }
          } else {
            //hide loader
            this.appcmp.showLoader = false;
          }
        });

  }

 
}
