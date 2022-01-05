import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  selector: 'app-my-questions',
  templateUrl: './MyQuestions.component.html',
  styleUrls: ['./MyQuestions.component.css']
})
export class MyQuestionsComponent implements OnInit {
  title: string;
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
    this.GetMyQuestions();

    this.sender_id = Number(localStorage.getItem('UserID'));

    //this.joyrideService.closeTour();

  }
  
  // Method to load datatable js file.
  public loadDataTable() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/js/demo/datatables-demo.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
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
    .post(`${environment.domainApi}I2BRecordingRequest/GetUserQuestionnare`, reqObj).subscribe(res=>{
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
          this.loadDataTable();
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

  //Method to remove the notes
  QuestionRemove() {

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Question is being removed...";
    
    return this.http
    .put(`${environment.domainApi}I2BRecordingRequest/DeleteQuestionFromUserQuestionnare`, this.QuestionObj).subscribe(res=>{
      //Method to get the my question list
      this.GetMyQuestions();
    });

  }

  //Method to confirm delete
  deleteConfirm(question) {

    this.QuestionObj = question;
  }

  //Method to identify the selcted tab
  enableTab(tab, tabcontent) {
    let target, t_attr;

    if (tab) t_attr = tab.getAttribute('href');

    if (t_attr == '#AllQuestions') {


    } else if (t_attr == '#FavQuestions') {
      this.GetMyQuestions(true);
    }
  }

  //Method to enable the AllQuestions tab
  AllQuestionsMenu() {
    let AllQuestions_menutab = document.getElementById('AllQuestions_menutab');
    if (AllQuestions_menutab) {

      setTimeout(function () {
        //triggering on AllQuestions tab
        AllQuestions_menutab.click();
      }, 500);

    }
  }

  //Method to enable the notification tab
  FavQuestionsTab() {
    let FavQuestions_menutab = document.getElementById('FavQuestions_menutab');
    if (FavQuestions_menutab) {

      setTimeout(function () {
        //triggering on notification tab
        FavQuestions_menutab.click();
      }, 500);

    }

  }

  //Method to open/close the accordian menu 
  openCloseAccordianMenu(rotateicon) {

    if (rotateicon) {
      if (rotateicon.classList.contains('fa-angle-down')) {
        rotateicon.classList.remove('fa-angle-down');
        rotateicon.className += ' fa-angle-up';
      } else {
        rotateicon.classList.remove('fa-angle-up');
        rotateicon.className += ' fa-angle-down';
      }
    }
  }

  fetchCheckedIDs() {
    this.checkedIDs = [];
    this.RecordingRequestList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.id);
        //console.log(this.checkedIDs)

        //write the put function to saving the function in DB

      }
    });
  }


  //for update the profile.
  SelectMyFavoriteQuestion(q_id) {

    if (q_id) {
      const reqObj = { RecordingQuestionID: q_id };

      //showing loader icon
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      
      return this.http
      .put(`${environment.domainApi}I2BRecordingRequest/SelectMyFavoriteQuestion`, reqObj).subscribe(res=>{
        
        if (res[0]['ResponseStatus'] == 'Success') {
          this.GetMyQuestions(true);
        }
      });
      this.dtOptions = {
        "order": [[2, "desc"]],
      };
    }
  }

}
