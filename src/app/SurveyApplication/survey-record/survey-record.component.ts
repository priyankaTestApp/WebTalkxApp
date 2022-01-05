import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { GlobalVariable } from '../../globals';
//import { NotificationService } from '../../toastr-notification/toastr-notification.service';
//import { CommonServiceService } from '../../Service/common-service.service';
import { HtmlTagDefinition } from '@angular/compiler';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';

import * as Record from 'videojs-record/dist/videojs.record.js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-survey-record',
  templateUrl: './survey-record.component.html',
  styleUrls: ['./survey-record.component.css']
})
export class SurveyRecordComponent implements OnInit, OnDestroy {
  questionList:any = {};
  question_length:number;
  RefRecordingID:number;
  IsRecordingStarted: boolean = false;
  IsRecordingCanceled: boolean = false;
  quest_num: number;
  UserID: number;
  inprogress: string;  
  skipcount:number = 0;

  // reference to the element itself: used to access events and methods

  // index to create unique ID for component
  idx = 'clip1';
  public preview = null;
  private config: any;
  private player: any; 
  private plugin: any;

  // constructor initializes our declared vars

  constructor(private router: Router, private http: HttpClient, private titleService: Title, private appcmp: AppComponent, /*private _notificationservice: NotificationService,*/ /*public _commonservice: CommonServiceService*/) { 
    this.player = false;
    this.appcmp.loadermessage = 'Please wait';
    
    //hiding loader after login
    this.appcmp.showLoader = true;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: true,
      fluid: false,
      loop: false,
      width: 320,
      height: 240,
      bigPlayButton: false,
      controlBar: {
        volumePanel: false
      },
      plugins: {
        record: {
          audio: true,
          video: true,
          debug: true,
          maxLength: 30,
          videoMimeType: "video/mp4"
        }
      }
    };
  }

  ngOnInit(): void {
    
    //Now getting question
    this.getQuestion(this.RefRecordingID);
  }

  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);
      
      let pictureInpicture = document.getElementsByClassName('vjs-button vjs-icon-picture-in-picture-start')[0];
      if(pictureInpicture) pictureInpicture.className += '  vjs-hidden';
      
      let vjs_fullscreen = document.getElementsByClassName('vjs-fullscreen-control vjs-control vjs-button')[0];
      if(vjs_fullscreen) vjs_fullscreen.className += '  vjs-hidden';

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      if(!this.IsRecordingCanceled) {
        const formData: FormData = new FormData();
        formData.append('file', this.player.recordedData, this.player.recordedData.name);
        //console.log('finished recording: ', this.player.recordedData, this.player.recordedData.name);
        /*let q_index = localStorage.getItem("QuestionIndex");
        
        if(this.question_length == Number(q_index)){
          
          //hiding loader after login
          this.appcmp.showLoader = true;
        }*/

        //console.log('Player: ', this.player);
        return this.http
          .post(`${environment.api}upload`, formData).subscribe(res=>{
            
            /*if(this.question_length == Number(q_index)){
              
              //hiding loader after login
              //this.appcmp.showLoader = false;
              //this.router.navigateByUrl('/SurveyApp/Completed');
            }*/
            //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          });
       
          
      } else {
        let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
        (video_btn as HTMLButtonElement).click();

        this.IsRecordingCanceled = false;
      }
      
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }
  
  //method to get the all the question
  getQuestion(rid) {
    rid = 536;
    
    //hiding loader after login
    this.appcmp.showLoader = true;

    if (rid) {
      let ReferenveObj: any = {};
      ReferenveObj.RefRecordingID= 536;
      return this.http
        //.post(`${environment.api}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
          .post('https://platform.webtalkx.com/api/I2BRecordingRequest/GetRecordingRequestQuestions', ReferenveObj).subscribe(res=>{
          //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          if (res["length"] > 0) {
            this.question_length = res["length"];
            if (res[0]['ResponseStatus'] == 'Success') {
              this.questionList = res;
              
              //hiding loader after login
              this.appcmp.showLoader = false;
  
              if (this.questionList.length > 0) {
                let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
                (video_btn as HTMLButtonElement).click();
              }
  
            }
          }
        });

    }
  }
  
  onStart(e, index) {
    
    let video_btn = document.getElementsByClassName('vjs-button vjs-icon-record-start')[0];
    if(video_btn) (video_btn as HTMLButtonElement).click();
    
    let start_btn = document.getElementsByClassName('start_'+index)[0];
    if(start_btn) {
      start_btn.setAttribute('disabled', 'true');
    }

    let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+index+'"]');
    let save_ans = document.querySelector('.btn-answer-question[qcount="'+index+'"]');

    if(cancel_ans && cancel_ans.classList.contains('-hidden')){
      cancel_ans.classList.remove('-hidden');
    }
    
    if(save_ans && save_ans.classList.contains('-hidden')){
      save_ans.classList.remove('-hidden');
    }
  }

  //Method to cancel the answer
  onCancelRecording(index) {
    this.IsRecordingStarted = false;
    this.IsRecordingCanceled = true;
    
    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    //(video_btn as HTMLButtonElement).click();
    //this.ngAfterViewInit();
    
    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    (video_stop_btn as HTMLButtonElement).click();
    
    let start_btn = document.getElementsByClassName('start_'+index)[0];
    if(start_btn) {
      start_btn.removeAttribute('disabled');
    }
    
    let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+index+'"]');
    let save_ans = document.querySelector('.btn-answer-question[qcount="'+index+'"]');

    if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
      cancel_ans.className += ' -hidden';
    }
    
    if(save_ans && !save_ans.classList.contains('-hidden')){
      save_ans.className += ' -hidden';
    }
  }
    
  //method to count the skipped question
  skipQuestion(e, index, qindex) {
    
    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    if(video_stop_btn) (video_stop_btn as HTMLButtonElement).click();

    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
      if(video_btn) (video_btn as HTMLButtonElement).click();
    
    if(this.question_length == Number(qindex)){
      
      let finish_btn = document.getElementById('btn-finish-recording');
      if(finish_btn && finish_btn.classList.contains('-hidden')){
        finish_btn.classList.remove('-hidden');
      }
      
      let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+qindex+'"]');
      let save_ans = document.querySelector('.btn-answer-question[qcount="'+qindex+'"]');
      
      let start_btn = document.getElementsByClassName('start_'+qindex)[0];
      if(start_btn && !start_btn.classList.contains('-hidden')) {
        start_btn.className += ' -hidden';
      }

      if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
        cancel_ans.className += ' -hidden';
      }
      
      if(save_ans && !save_ans.classList.contains('-hidden')){
        save_ans.className += ' -hidden';
      }
    }

    /*setTimeout(function(){
      let video_pause_btn = document.getElementsByClassName('vjs-control vjs-button vjs-paused')[0];
      (video_pause_btn as HTMLButtonElement).click();
    }, 500);
    
            let q_index = localStorage.getItem("QuestionIndex");
            if(this.question_length == Number(q_index)){
              this.router.navigateByUrl('/SurveyApp/Completed');
            }
    */
    localStorage.setItem("QuestionIndex", qindex);

    if(this.question_length != qindex){
      //Now updating the wizard to be an active
      this.moveWizardQuestion(index);
    } else {
      
      //this.router.navigateByUrl('/SurveyApp/Completed');
    }
    
  }
  
  
  //method to show next two question
  moveWizardQuestion(id) {
    
    let aw_wizard_step = document.querySelectorAll('.aw-wizard-step');
    let last_elm = aw_wizard_step[aw_wizard_step.length - 1];
    let aw_wizard_elm = document.querySelectorAll('.aw-wizard-step[id="Q' + id + '"]')[0];
    let aw_wizard_ques = document.querySelectorAll('.aw-wizard-ques[id="Q' + id + '"]')[0];
    let aw_wizard_btn = document.querySelectorAll('.aw-wizard-btn[id="Q' + id + '"]')[0];

    if (aw_wizard_step.length) {
      //if (this.timeinterval) clearInterval(this.timeinterval);

      for (let j = 0; aw_wizard_step.length > j; j++) {

        /*if (aw_wizard_step[j] && !aw_wizard_step[j].hasAttribute('hidden')) {
          aw_wizard_step[j].setAttribute('hidden', 'true');
        } else if (aw_wizard_elm && aw_wizard_elm.hasAttribute('hidden')) {
          aw_wizard_elm.removeAttribute('hidden');
        }*/
        if (aw_wizard_step[j]) {

          if (!aw_wizard_step[j].hasAttribute('hidden')) {
            /*let next_elm = aw_wizard_elm.nextSibling;
            if (next_elm || aw_wizard_step[j] != aw_wizard_elm) aw_wizard_step[j].setAttribute('hidden', 'true');*/
            let next_elm = (aw_wizard_ques) ? aw_wizard_ques.nextSibling : null;
            let next_btn_elm = (aw_wizard_btn) ? aw_wizard_btn.nextSibling : null;
            
            if (next_elm || aw_wizard_step[j] != aw_wizard_ques) {
              if(next_elm && aw_wizard_ques) {
                aw_wizard_step[j].setAttribute('hidden', 'true');
              
                /*let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
                if(video_btn) (video_btn as HTMLButtonElement).click();*/
              } else {
                //this.router.navigateByUrl('/SurveyApp/Completed');
                //return false;
              }

            }
            if (next_btn_elm || aw_wizard_step[j] != aw_wizard_btn) {
              if(next_btn_elm && aw_wizard_btn) aw_wizard_step[j].setAttribute('hidden', 'true');
            }
          }
          // if (aw_wizard_elm && aw_wizard_elm.hasAttribute('hidden')) {
          //   aw_wizard_elm.removeAttribute('hidden');
          // }
          if (aw_wizard_ques && aw_wizard_ques.hasAttribute('hidden')) {
            aw_wizard_ques.removeAttribute('hidden');
          }
          if (aw_wizard_btn && aw_wizard_btn.hasAttribute('hidden')) {
            aw_wizard_btn.removeAttribute('hidden');
          }

        }

      }
    }
  }

  onFinishRecording() {
    this.router.navigateByUrl('/SurveyApp/Completed');
  }

}
