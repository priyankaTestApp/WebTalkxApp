import { Component, OnInit, Inject, Optional } from '@angular/core';

import { Router } from '@angular/router';
import { FormGroup, NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { GlobalVariable } from '../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyApplicationComponent } from '../SurveyApplication.component';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sample-questions',
  templateUrl: './sample-questions.component.html',
  styleUrls: ['./sample-questions.component.css']
})
export class SampleQuestionsComponent implements OnInit {
  title: string;
  ShowSampleQuestions: boolean = false;
  sampleQuestionsData: any;
  sampleQuestionText: any;

  public UserID: number;
  today: Date;
  model: any = {}
  form: FormGroup;
  //dtOptions: DataTables.Settings = {};
  dtOptions = {};
  masterSelected: boolean;
  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private appcmp: AppComponent) {

    //method to get sample questions names
    this.getSampleQuestionName();
   

    this.title = appcmp.title + " | My questions";
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

    this.appcmp.loadermessage = 'Please wait...';
    this.masterSelected = false;

    this.surveyCmp.showNavigation = true;
  }
  ngOnInit(): void {

   
  }

  //method to get sample name
  getSampleQuestionName() {
    this.sampleQuestionText = [];
    return this.http
      .get(`${environment.domainStageApi}/SampleQuestion/GetSampleQuestionNames`).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          //alert('Recieved Successfully!');
          this.ShowSampleQuestions = true;
          this.sampleQuestionsData = res;


        }
      });

  }

  //method to get all sample questions
  getSampleQuestionText(sampleQuestionName) {
    this.sampleQuestionText = [];
    let Id = sampleQuestionName.ID;
    return this.http
      .get(`${environment.domainStageApi}/SampleQuestion/GetSubQuestionList?ID=` + Id).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {

          this.sampleQuestionText = res;
        }
      });

  }

  copyQuestionAcc(i, sampleInpt, elm) {
    var copyText = sampleInpt;

    /* Select the text field */
    copyText.focus();
    copyText.select();

    document.execCommand("copy");
    //this._notificationservice.success("Copied to Clipboard.");
  }

}
