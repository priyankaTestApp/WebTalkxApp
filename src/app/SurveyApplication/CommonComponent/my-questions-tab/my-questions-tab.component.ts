import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-my-questions-tab',
  templateUrl: './my-questions-tab.component.html',
  styleUrls: ['./my-questions-tab.component.css']
})
export class MyQuestionsTabComponent implements OnInit {
  title: string;
  ShowSampleQuestions: boolean = false;
  sampleQuestions: any;
  sampleQuestionText: any;

  public show_dialog: boolean = false;
  public UserID: number;
  today: Date;
  model: any = {}
  form: FormGroup;
  //dtOptions: DataTables.Settings = {};
  dtOptions = {};
  recording_length: number;
  RecordingRequestList: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  QuestionObj: any
  isChecked: boolean;
  //favouriteQuestion: any;
  favouriteQuestion: [];
  checkedIDs: any;
  RecordingQuestionID: number;

  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent) {
     this.GetMyQuestions(true);
    //this.title = "Reference recordings | " + appcmp.title;
    this.title = appcmp.title + " | My questions";
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

    this.appcmp.loadermessage = 'Please wait...';
    this.masterSelected = false;

    this.surveyCmp.showNavigation = true;
  }

  // Page init method
  ngOnInit() {
    //Added below line to remove the prompt message on reload and close browser.
    window.onbeforeunload = null;

    //Added below code to update the title
    this.titleService.setTitle(this.title);
    this.today = new Date();
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    //this.UserID = 10392;

    this.dtOptions = {
      pageLength: 10,
      lengthChange: false,
      "info": false,
      "order": [[2, "desc"]],
      columnDefs: [
        { "orderable": false, "targets": [3] }
      ]

    };

    //Method to get the my question list
    //this.takeinterviewservice.GetRefRequestDetails();
   

    this.sender_id = Number(localStorage.getItem('UserID'));

    //this.joyrideService.closeTour();

  }
  //Method to get the recording list
  GetMyQuestions(getFav?) {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading my questions...';

    let reqObj: any = {};
    //reqObj.RequesterID = this.UserID;
    reqObj.UserID = this.UserID;

    if (getFav) reqObj.MyFavorite = true;

    return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetUserQuestionnare`, reqObj).subscribe(res => {
        if (res["length"] > 0) {
          this.recording_length = res["length"];
          if (res[0]['ResponseStatus'] == 'Success') {

            this.RecordingRequestList = res;

            //Now getting those data which has my favorite is true
            let data_filter = this.RecordingRequestList.filter(element => element.MyFavorite == true)

            if (data_filter.length > 0) {
              this.favouriteQuestion = data_filter;
            } else {
              this.favouriteQuestion = [];
            }

            //hiding loader
            this.appcmp.showLoader = false;
            //Now initiating data table
            //this.loadDataTable();
          } else {

            this.RecordingRequestList = [];

            //hiding loader
            this.appcmp.showLoader = false;
          }
        } else {
          this.RecordingRequestList = [];

          //hiding loader
          this.appcmp.showLoader = false;
        }
      });
  }

}
