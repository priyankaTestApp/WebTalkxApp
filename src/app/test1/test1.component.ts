import { Component, OnInit, Optional, Inject, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, NgModel ,FormControlName} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { GlobalVariable } from '../globals';
import { HttpErrorResponse } from '@angular/common/http';
//import { SurveyApplicationComponent } from './../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestedByMeComponent } from '../SurveyApplication/Record/RequestedByMe/RequestedByMe.component';
@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component implements OnInit {
  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;


  @Input() data: any[];
  @Input() questionList: any[];
  @Input() userData: any[];
  @Input() modalType: string;


  @Output() sendTestData = new EventEmitter<any>();
  @ViewChild(RequestedByMeComponent)
  dataFromTest1: RequestedByMeComponent;
  today: Date;
  model: any = {}
  showCatalog: boolean;
  showReplay: boolean;


  sender_id: number;
  receiver_id: number;
  full_name: string;
  RequesterFirstName: string;
  RequesterID: string;
  authername: string;
  autherID: string;
  GiverName: string;
  projectName: string;
  autheremail: string;
  GiverID: string;
  GiverLinkedIn: string;
  GiverEmailID: string;
  GiverFirstName: string;
  GiverSecondName: string;
  video_url: string;
  UserID: any
  recodingData: any;
  id: number;
  r_id: number;
  email: string;
  recordingsFromMe: any;
  recordingsFromMeId: number;
  recordingsFromMeEmail: string;
  //@ViewChild(RequestedByMeComponent) sub: RequestedByMeComponent;
  constructor(private http: HttpClient, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    
  }

  ngOnInit(): void {

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      //this.resizefilterDialog();
    };
    //console.log(history.state);
    this.UserID = Number(localStorage.getItem('LoginUserID'));
   
  }

  
  //Method to set the dialog height as per the window height
  resizefilterDialog() {
    let w_height = window.innerHeight,
      resize_model = (document.getElementsByClassName('resize-model') as HTMLCollection),
      totalheight: number = 0;

    if (w_height && resize_model.length > 0) {

      totalheight = w_height * 90 / 100;
      for (let i = 0; i < resize_model.length; i++) {
        //Getting dialog element and setting the calculated height
        if (resize_model[i]) resize_model[i].setAttribute('style', 'height: ' + totalheight + 'px');
      }
    }
  }

}
