import { Component, OnInit } from '@angular/core';
import { FormGroup, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AppComponent } from '../../app.component';
import { Title } from '@angular/platform-browser';
import { GlobalVariable } from '../../globals';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-team-members',
  templateUrl: './TeamMembers.component.html',
  styleUrls: ['./TeamMembers.component.css']
})
export class TeamMembersComponent implements OnInit {
  title: string;
  UserID: number;
  membersList: any;
  OrgName: string;
  u_img: string = '../../../assets/img/u_image6.png';
  profile_img: string;
  domain_url: string;
  full_name: string;
  receiver_id: number;
  model: any = {};
  sender_id:number;

  constructor(/*public _notificationservice: NotificationService,private joyrideService: JoyrideService,*/ private http: HttpClient, private titleService: Title, private appcmp: AppComponent, /*public _commonservice: CommonService,*//* private activatedRoute: ActivatedRoute, private router: Router*/) {
    this.title = appcmp.title + " | My network";
  }

  ngOnInit() {
    //Added below code to update the title
    this.titleService.setTitle(this.title);

    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.domain_url = GlobalVariable.APIUrl;

    //Method to get all users
    this._getTeamMembers(this.UserID);

    this.sender_id = Number(localStorage.getItem('UserID'));

    //this.joyrideService.closeTour();

  }


  //method to get the all the team members
  _getTeamMembers(uid) {

    if (uid) {
      let userObj: any = {};
      userObj.UserID = uid;

      //showing loader
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Loading my network users...';

      return this.http
      .post(`${environment.domainApi}I2B_Users/GetUsersForInbox`, userObj).subscribe(res=>{
        
        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {
            //assigning all the response data into the global variable which is using in html context to draw
            this.membersList = res;
            this.OrgName = res[0]['CompanyName'];

            //hiding loader
            this.appcmp.showLoader = false;

            //Selecting first user's list
            /*this.timeintervals = setInterval(() => {
              //clear input will check the value till blank
              this.selectFirstUserList();
            }, 100);*/

          } else {
            //assigning all the response data into the global variable which is using in html context to draw
            this.membersList = [];
            
            //hiding loader
            this.appcmp.showLoader = false;
          }
        } else {
          this.membersList = [];
          //hiding loader
          this.appcmp.showLoader = false;
        }
      });

      /*
      this._commonservice.GetTeamMembers(userObj).subscribe(res => {

        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {
            //assigning all the response data into the global variable which is using in html context to draw
            this.membersList = res;
            this.OrgName = res[0]['CompanyName'];

            //hiding loader
            this.appcmp.showLoader = false;

          } else {
            //assigning all the response data into the global variable which is using in html context to draw
            this.membersList = [];
            
            //hiding loader
            this.appcmp.showLoader = false;
          }
        } else {
          this.membersList = [];
          //hiding loader
          this.appcmp.showLoader = false;
        }
      },
        (error: HttpErrorResponse) => {
          //console.log(error.error);       
          //hiding loader after login
          this.appcmp.showLoader = false;
          this._notificationservice.error(GlobalVariable.TechnicalError);
        });
        */
    } else {
      this.membersList = [];
    }
  }

  //Method to get the user info like id, name
  getUserInfo(e, id, f_name, l_name) {
    e.preventDefault();
    e.stopPropagation();

    //Added hack to open model to show the company details
    //Here it is checking to the loggedIn user
    if (id != this.UserID) {
      (<any>$('#sendmsgmodel')).modal('show');
    } else {
      (<any>$('#messagenotification')).modal('show');
    }

    this.receiver_id = id;
    this.full_name = f_name + ' ' + l_name;
  }


  //Method to send the message to the user
  sendMessage(senderid, receiverid, usertextmsg) {
    
    let content: any = {};
    //if (usertextmsg) value = usertextmsg.value;

    let msgtext_new = this.urlify(usertextmsg.trim());

    content.MessageText = msgtext_new;
    content.SenderID = senderid;
    content.ReceiverID = receiverid;

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Message is being sent...';

    if (usertextmsg) {
      //console.log("content", content);
      
    return this.http
      .post(`${environment.domainApi}I2BMessages/InsertMessages`, content).subscribe(res=>{
        this.model.usertextmsg = "";
        if (res[0]['ResponseStatus'] == 'Success') {

          //hiding loader after login
          this.appcmp.showLoader = false;
          this.appcmp.loadermessage = 'Please wait...';
          //this._notificationservice.success("Message has been sent successfully.");

        }
      });

      /*
      this._commonservice.InsertMessagesI2B(content).subscribe(res => {
        success => alert("Done");
        //console.log(res);
        this.model.usertextmsg = "";
        if (res[0]['ResponseStatus'] == 'Success') {

          //hiding loader after login
          this.appcmp.showLoader = false;
          this.appcmp.loadermessage = 'Please wait...';
          this._notificationservice.success("Message has been sent successfully.");

        }
      },
        (error: HttpErrorResponse) => {
          //console.log(error.error);
          //hiding loader after login
          this.appcmp.showLoader = false;
          this.appcmp.loadermessage = 'Please wait...';
          this._notificationservice.error(GlobalVariable.TechnicalError);
        });
        */
    }
  }

  //method to convert the text into link if available
  urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
      var url2 = (c == 'www.') ? 'http://' + url : url;
      return '<a class="white-text" href="' + url2 + '" target="_blank">' + url + '</a>';
    })
  }


}
