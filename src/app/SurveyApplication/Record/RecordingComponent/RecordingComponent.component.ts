import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import Speech from 'speak-tts';
import { HtmlTagDefinition } from '@angular/compiler';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';

import * as Record from 'videojs-record/dist/videojs.record.js';


@Component({
  selector: 'app-RecordingComponent',
  templateUrl: './RecordingComponent.component.html',
  styleUrls: ['./RecordingComponent.component.css']
})

export class RecordingComponent implements OnInit {
  title: string;
  model: any = {}
  stopmodel: any = {}
  companyname: string;
  sessionid: string;
  connectionid: string;
  recordingtype: string;
  tokenid: string;
  RefRequestID: number;
  form: FormGroup;
  ArchiveID: string;
  VideoURL: string;
  domainurl: string;
  RecordingArchiveID: Number;
  RefRequestRecordingID: Number;
  AuthorID: Number;
  RequesterBusinessName: string;
  EngagementName: string;
  public isendQuestion = false;
  public isStart = false;
  public start = false;
  recording_title:string;

  UserID: number;
  ViewEngagementName: string;
  AccountManager: string;
  EngagementTitle: string;
  EngagementChallange: string;
  EngagementSolution: string;
  EngagementResult: string;
  ViewRefRequestID: number;
  RequesterID: number;
  EngagementAreaName: string;
  IndustryName: string;
  SubIndustryName: string;
  EngagementDateFrom: string;
  EngagementDateTo: string;
  Range: string;
  ReferenceTypeName: string;
  inprogress: string;
  requesterName: string;
  requesterId: number;

  Global: boolean;
  Offshore: boolean;
  Onshore: boolean;
  FixedCost: boolean;
  RiskShare: boolean;
  Multilanguage: boolean;
  ScheduleDT: string;
  ScheduleTime: string;
  RestrictedUseCheck: boolean;
  bsValue = new Date();
  bsRangeValue: Date[];
  checkValue: boolean;
  IsInterviewAttended: boolean;
  msgtxt: string;
  msgtxt1: string;
  skipcount: number = 0;
  answercount: number = 0;
  questionList;
  questionListStatus;
  question_length: number = 0;
  answerdata: any = {};
  skipdata: any = {};
  timeinterval;
  moveQue;
  xyz: number = 0;
  currentqindex: number = 0;
  imageUrl: string = "../../../assets/images/retegrity/user.png";
  arrowicon: string = "fa-chevron-right";
  vendorname: string;
  EngagementsName: string;
  ReviewerCount: number;
  givername: string;
  ReferenceCustomer: string;
  RecordingQuestionID: number;

  vendor_Org: string;
  engagment_type: string;
  engagment_category: string;
  softwarevendor: string;
  itsoftware: string;
  engagment_other: string;
  vendorID: number;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  refGiverid: number;
  interviewer: string;
  intLinkedInURL: string;
  venLinkedIn: string;
  givLinkedIn: string;
  starttime: string = '00:00:01';
  textarea;
  video_index:number;
  Cloud: boolean;
  Mobile: boolean;
  //introJS = introJs();
  speech;
  Isresume: boolean = true;
  IsReRecord: boolean = false;
  IsRecordingStarted: boolean = false;
  Isfinish: boolean;
  IsSave: boolean;
  RefRecordingID: number;
  requestermsg: string;
  ReplayConsent: string;
  quest_num: number;
  delete_record: number;
  unreaditemcount: number;
  unreadmsgcount: number;
  IsqueTouched: boolean = false;
  IsEdited: boolean = false;
  browserName: string;
  IsUploading: string;
  video_url:string;
  WelcomePageRequired:boolean = false;
  JobDescription:string;

  // index to create unique ID for component
  idx = 'clip1';
  public preview = null;
  private config: any;
  private config2: any;
  private player: any; 
  private plugin: any;
  stopTimer = false;
  characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  IsRecordingCanceled: boolean = false;
  question_player;
  playing_error:string;
  // Credit: Mateusz Rybczonec
  
  FULL_DASH_ARRAY = 283;
  WARNING_THRESHOLD = 120;
  ALERT_THRESHOLD = 40;

  COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
      color: "orange",
      threshold: this.WARNING_THRESHOLD
    },
    alert: {
      color: "red",
      threshold: this.ALERT_THRESHOLD
    }
  };

  TIME_LIMIT = 300;
  timePassed = 0;
  timeLeft = this.TIME_LIMIT;
  timerInterval = null;
  remainingPathColor = this.COLOR_CODES.info.color;
  final_str:string;
  alert_message:string;
   
  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    //getting below project title from app.component
    this.title = appcmp.title + " | Interview";

    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

    this.appcmp.loadermessage = 'Please wait...';

    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      width: 320,
      height: 320,
      bigPlayButton: false,
      controlBar: {
        volumePanel: true
      },
      plugins: {
        record: {
          audio: true,
          video: true,
          debug: true,
          maxLength: 300,
          videoMimeType: "video/mp4"
        }
      }
    };



    //window.addEventListener("beforeunload", (event) => {
    //  event.preventDefault();
    //  event.returnValue = "Unsaved modifications";
    //  return event;
    //});
  }

  // Method for calling host js file.
  public mediaScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.webrtc-experiment.com/getHTMLMediaElement.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // Method for calling host js file.
  public webRTCScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/RecordSetup.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // Method for calling host js file.
  public RTCMainScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/main.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // Method to remove the host js file.
  removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
  }

  ngOnInit() {

    //introJS method for start the tour
    //this.startSteps();


    //Added below code to update the title
    this.titleService.setTitle(this.title);

    //Scrolling window on top at initial
    window.scroll(0, 0);

    /*let left_menu_container = document.getElementsByClassName('left_menu_container')[0];
    if (left_menu_container && !left_menu_container.classList.contains('-hidden')) left_menu_container.className += ' -hidden';

    let pcoded_main_container = document.getElementsByClassName('pcoded-main-container')[0];
    if (pcoded_main_container && !pcoded_main_container.classList.contains('m-0')) pcoded_main_container.className += ' m-0';*/

    //localStorage.setItem('RefRequestID', "10180");

    this.msgtxt = 'Interview not started yet.';
    this.msgtxt1 = 'Please click on start recording button to start the interview.';
    this.sender_id = Number(localStorage.getItem('UserID'));

    // Staging
    this.RefRequestID = Number(localStorage.getItem('RefRecordingID'));
    this.RefRecordingID = this.RefRequestID;
    //this.UserID = this.RefRecordingID;
    //this.ReqId = 10180;

    this.requesterName = localStorage.getItem('requesterName');
    this.requesterId = Number(localStorage.getItem('requesterId'));
    this.requestermsg = localStorage.getItem('requesterMsg');


    //Method to get unread notification
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    //Method to get unread notification
    this.GetUnreadNotificationCount(this.UserID);

    //Method to get unread message
    this.GetUnreadMessageCount(this.UserID);

    if (this.sessionid != "" && this.sessionid != null) {
      //showing loader after login
      this.appcmp.showLoader = true;
      //setTimeout(() => {

      //hiding loader after login
      this.appcmp.showLoader = false;
      //}, 8000);
    }

    //Method to call on init
    this.callOnInit();
    //this.domainurl = GlobalVariable.APIUrl;

    this.surveyCmp.showNavigation = false;
    //this.model.PublicConsent = true;

    //open a dialogue for recording instruction.
    this.openDialogue();
    localStorage.setItem('InProgress', '');
    this.domainurl = `${environment.domainApi}`;

    
    /*this.route.params.subscribe(routeParams => {
      //console.log('routeParams 1', routeParams);
      //console.log('UserID', routeParams.id);

      if (routeParams && routeParams.id) {
        //localStorage.setItem('RefRecordingID', routeParams.id);
        let rid = routeParams.id;

        this.RefRequestId = rid;
      }
    });*/

    //get the random string with date time
    this.getDateTimeStamp();

  }

  
  initTimerUI(){
    //debugger
    if(document.getElementById("app")){
      // <span class="time_remain mr-3">Time remaining: </span>
      document.getElementById("app").innerHTML = `
        <span class="mr-2">Time Limit</span>
        <div class="base-timer">
          <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
              <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
              <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${this.remainingPathColor}"
                d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                "
              ></path>
            </g>
          </svg>
          <span id="base-timer-label" class="base-timer__label font-18">${this.formatTime(
            this.timeLeft
          )}</span>
        </div>
        `;
    }
  }

  InitVariable(){
    //debugger
    this.FULL_DASH_ARRAY = 283;
    this.WARNING_THRESHOLD = 120;
    this.ALERT_THRESHOLD = 40;

    this.COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: this.WARNING_THRESHOLD
      },
      alert: {
        color: "red",
        threshold: this.ALERT_THRESHOLD
      }
    };

    this.TIME_LIMIT = 300;
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
    this.timerInterval = null;
    this.remainingPathColor = this.COLOR_CODES.info.color;
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
    this.InitVariable();
    this.initTimerUI();
  }
  
  startTimer() {
    //debugger
    this.timerInterval = setInterval(() => {
      
      if(this.stopTimer) {
        this.onTimesUp();
        return false;
      }
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      document.getElementById("base-timer-label").innerHTML = this.formatTime(
        this.timeLeft
      );
      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);
  
      if (this.timeLeft === 0) {
        this.onTimesUp();
      }
    }, 1000);
  }
  
  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
  
    if (seconds < 10) {
      seconds = Number(`0${seconds}`);
    }

    if(seconds > 9) {
      return `0${minutes}:${seconds}`;  
    } else {
      return `0${minutes}:0${seconds}`;
    }
  }
  
  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = this.COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
  }
  
  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }
  
  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  initTimer(){
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/js/demo/Timer.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    
  }

  generateString(length) {
    let result = '';
    const charactersLength = this.characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  getDateTimeStamp() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var time = today.getSeconds();;

    var ran_char = this.generateString(5);
    //this.final_str = 'Record-' +mm + '-' + dd + '-' + yyyy +'-'+ ran_char;
    this.final_str = 'Record-' +mm + '-' + dd +'-'+ ran_char;
    //console.log("final_str", final_str);
    //return final_str;
  }

  ngAfterViewInit() {
    this.question_player = document.getElementsByClassName('question_player')[0];
    
    //Init video plugin
    this.InitVideoPlugin();

    //console.log(this.getDateTimeStamp());
    // ID with which to access the template's video element
    /*let el = 'video_' + this.idx;

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
        let q_index = localStorage.getItem("QuestionIndex");
        //let usercode = this.final_str;
        let usercode = String(this.RefRecordingID);
        //usercode = 'record_'+usercode + '-' + q_index;
        usercode = 'record_'+usercode + '_' + this.UserID + '_' + q_index;
        const formData: FormData = new FormData();
        var ext =  this.player.recordedData.name.split('.').pop();
        //let file_name = usercode +'.'+ ext;
        //formData.append('file', this.player.recordedData, this.player.recordedData.name);
        //formData.append('file', this.player.recordedData, file_name);
        let file_name = usercode +'.mp4';
        //formData.append('file', this.player.recordedData, file_name);
        formData.append('video-blob', this.player.recordedData);
        formData.append('RefRecordingID', String(this.RefRecordingID));
        formData.append('questionName', String(q_index));
        formData.append('FileName', file_name);
        console.log("data", this.player.recordedData, file_name);
        
        //formData.append('RefRequestId', this.RefRequestId.toString());
        //formData.append('VideoName', usercode);

        //console.log('finished recording: ', this.player.recordedData, this.player.recordedData.name);
        //return false;
        console.log("usercode", usercode);
        
        //if(this.question_length == Number(q_index)){
          
          //hiding loader after login
          //this.appcmp.showLoader = true;
        //}
        let video_pause_btn = document.getElementsByClassName('vjs-control vjs-button vjs-paused')[0];
        //(video_pause_btn as HTMLButtonElement).click();

        let answer_btn = document.querySelectorAll('.btn-answer-question');
        if(answer_btn.length > 0){
          for(let i =0; i < answer_btn.length; i++){
            if(answer_btn[i] && !answer_btn[i].classList.contains('-hidden')){
              (answer_btn[i] as HTMLButtonElement).click();
            }
          }
        }
        let ques_index = q_index;
        let status_elm = document.getElementsByClassName('status_'+ques_index)[0];
        if(status_elm) status_elm.innerHTML = 'Uploading...';

        //console.log('Player: ', this.player);
        //return false;
        return this.http
          //.post(`https://sara.webtalkx.com/api/upload`, formData).subscribe(res=>{
          .post(`${environment.domainApi}FinalSubmission/PostRecordedAudioVideoInDir`, formData).subscribe(res=>{

            let replay_elm = document.getElementsByClassName('replay_'+ques_index)[0];
            if(replay_elm) {
              replay_elm.removeAttribute('disabled');
              replay_elm.setAttribute('extension', ext);
            }

            let removeRecord = document.getElementsByClassName('removeRecord_' + ques_index)[0];
            if (removeRecord) removeRecord.removeAttribute('disabled');

            let status_elm = document.getElementsByClassName('status_'+ques_index)[0];
            if(status_elm) status_elm.innerHTML = 'Answered';
            
            //if(this.question_length == Number(q_index)){
              //https://sara.webtalkx.com/api/videorecordings
              
              //hiding loader after login
              //this.appcmp.showLoader = false;
              //this.router.navigateByUrl('/SurveyApp/Completed');
            //}
            //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          });
       
          
      } else {
        let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
        //(video_btn as HTMLButtonElement).click();

        this.IsRecordingCanceled = false;
      }
      
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });*/
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
      //this.router.navigateByUrl('/SurveyApp/Completed');
    }
  }
  

  // Method for calling deviceSetting js file.
  deviceSettingScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/deviceSetting.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  //Method to initiate
  callOnInit() {
    //Now disabling window reload
   this.disableWindowReload();

    //Now getting question
    this.getQuestion(this.RefRecordingID);

    //Getting engagment headlines details
    this.GetRecordingHeadline(this.RefRecordingID);

    //Speech
    //this.InitSpeech();

    this._initSpeech();
    this.browserName = this.getBrowserName();
    //console.log("check", this.browserName);

    //this.ConvertSingleRecordedVideos();

  }

  //Method to check the browser
  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }

  
  }


  //InitSpeech(voices) {

  _addVoicesList = voices => {
    const list = document.getElementsByClassName("lan_option")[0];
    let html = '<select id="languages" style="height:31px;"><option value="">autodetect language</option>';

    voices.forEach(voice => {
      html += `<option value="${voice.lang}" data-name="${voice.name}">${
        voice.name
        } (${voice.lang})</option>`;
    });
    list.innerHTML = html;
  }


  _initSpeech() {
    this.speech = new Speech();
    this.speech
      .init({
        volume: 1,
        //lang: "en-GB",
        lang: "en-US",
        rate: 1,
        pitch: 1,
        //'voice':'Google UK English Male',
        'voice': 'Google US English',
        //'splitSentences': false,
        listeners: {
          onvoiceschanged: voices => {
            //console.log("Voices changed", voices);
          }
        }
      })
      .then(data => {
        //console.log("Speech is ready", data);
        //this._addVoicesList(data.voices);
        // this._addVoicesList(data.voices);
        //this._prepareSpeakButton(this.speech);
      })
      .catch(e => {
        console.error("An error occured while initializing : ", e);
      });
    const text = this.speech.hasBrowserSupport()
      ? "Hurray, your browser supports speech synthesis"
      : "Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !";
    //document.getElementById("support").innerHTML = text;
  }

  _prepareSpeakButton(speech) {
    //const speakButton = document.getElementById("play");
    //const pauseButton = document.getElementById("pause");
    //const resumeButton = document.getElementById("resume");
    //const textarea = document.getElementById("text") as HTMLInputElement;

    //this.playSpeechText(speech);
    //this.pauseSpeechText(speech);
    //this.resumeSpeechText(speech);
    //const languages = document.getElementById("languages") as HTMLSelectElement;


    //  pauseButton.addEventListener("click", () => {
    //    speech.pause();
    //  });

    //  resumeButton.addEventListener("click", () => {
    //    speech.resume();
    //  });
  }

  pauseSpeechText(speech) {
    speech.pause();
  }

  resumeSpeechText(speech) {
    speech.resume();
  }

  onPauseRecording() {
    if (this.Isresume) {
      this.pauseSpeechText(this.speech);
      this.Isresume = false;
    } else {
      this.resumeSpeechText(this.speech);
      this.Isresume = true;
    }

  }

  playSpeechText(speech) {
    //const languages = document.getElementById("languages") as HTMLSelectElement;

    //const language = languages.value;
    //const voice = languages.options[languages.selectedIndex].dataset.name;
    //const languages = document.getElementById("languages") as HTMLSelectElement;

    const language = "en-US";
    const voice = 'Google US English';
    if (language) speech.setLanguage("en-US");
    if (voice) speech.setVoice(voice);

    speech
      .speak({
        text: this.textarea.innerText,
        queue: false,
        listeners: {
          onstart: () => {
            console.log("Start utterance");
          },
          onend: () => {
            console.log("End utterance");
          },
          onresume: () => {
            console.log("Resume utterance");
          },
          onboundary: event => {
            console.log(
              event.name +
              " boundary reached after " +
              event.elapsedTime +
              " milliseconds."
            );
          }
        }
      })
      .then(data => {
        console.log("Success !", data);
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });
  }

  jumpStep() { }

  //introJS method for start the tour
  //startSteps(): void {

  //  this.introJS
  //    .setOptions({
  //      steps: [
  //        {
  //          element: '#nextQuestion',
  //          intro: 'Click on the button to see the next question.'
  //        }, {
  //          element: '#jumpAtone',
  //          intro: 'Click on the arrow to jump at question number 1.'
  //        },
  //        {
  //          element: '#openDetails',
  //          intro: 'Click here to view Interview Guidelines.'
  //        },
  //        {
  //          element: '#start_recording',
  //          intro: 'Click on the button to start the interview.'
  //        },
  //        ,
  //        {
  //          element: '#pause_recording',
  //          intro: 'Click on the button to pause the interview.'
  //        },
  //        ,
  //        {
  //          element: '#stop_recording',
  //          intro: 'Click on the button to finish the interview.'
  //        },
  //        {
  //          element: '#ChatOn',
  //          intro: 'Click on the icon to chat with the interviewer.'
  //        },
  //        {
  //          element: '#casestudyArrow',
  //          intro: 'Click on arrow to expand the case study.'
  //        }

  //      ],
  //      hidePrev: true,
  //      hideNext: false
  //    })
  //    .start();
  //}

  //Method to get the recording headlines
  GetRecordingHeadline(reqid) {
    /*
    this.hostService.GetRecordingHeadline(reqid).subscribe(res => {

      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        this.vendorname = res[0]['VendorContact'];
        this.EngagementsName = res[0]['EngagementName'];
        this.givername = res[0]['ReferenceGiver'];
        this.ReferenceCustomer = res[0]['ReferenceCustomer'];
        this.ReviewerCount = res[0]['ReviewerCount'];

        this.refGiverid = res[0]['ReferenceGiverID'];
        this.vendorID = res[0]['VendorID'];
        this.interviewer = res[0]['Interviewer'];
        //this.intLinkedInURL = res[0]['InterviewerLinkedInURL'];
        //Check if linkedin url exits then also check if it contains http or not
        if (res[0]['InterviewerLinkedInURL']) {
          if (res[0]['InterviewerLinkedInURL'].indexOf("http") == -1 || res[0]['InterviewerLinkedInURL'].indexOf("https") == -1) {
            this.intLinkedInURL = "http://" + res[0]['InterviewerLinkedInURL'];
          } else {
            this.intLinkedInURL = res[0]['InterviewerLinkedInURL'];
          }
        }
        //this.venLinkedIn = res[0]['VendorLinkedIn'];

        //Check if linkedin url exits then also check if it contains http or not
        if (res[0]['VendorLinkedIn']) {
          if (res[0]['VendorLinkedIn'].indexOf("http") == -1 || res[0]['VendorLinkedIn'].indexOf("https") == -1) {
            this.venLinkedIn = "http://" + res[0]['VendorLinkedIn'];
          } else {
            this.venLinkedIn = res[0]['VendorLinkedIn'];
          }
        }
        //this.givLinkedIn = res[0]['GiverLinkedIn'];
        //Check if linkedin url exits then also check if it contains http or not
        if (res[0]['GiverLinkedIn']) {
          if (res[0]['GiverLinkedIn'].indexOf("http") == -1 || res[0]['GiverLinkedIn'].indexOf("https") == -1) {
            this.givLinkedIn = "http://" + res[0]['GiverLinkedIn'];
          } else {
            this.givLinkedIn = res[0]['GiverLinkedIn'];
          }
        }
      }
    },
      (error: HttpErrorResponse) => {
        this._notificationservice.error(GlobalVariable.TechnicalError);
      });
      */
    let refObj: any = {};
    refObj.RefRecordingID = reqid;
    refObj.GiverID = this.UserID;

    return this.http
        .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestUserDetails`, refObj).subscribe(res=>{
          let data = Object.keys(res).length;
          if (data && res[0]['ResponseStatus'] == 'Success') {
            this.vendorname = res[0]['RequesterName'];
            this.givername = res[0]['GiverName'];
            this.refGiverid = res[0]['GiverID'];
            this.vendorID = res[0]['RequesterID'];
            this.interviewer = res[0]['Interviewer'];
            //this.ReviewerID = res[0]['ReviewerID'];
            this.WelcomePageRequired = res[0]['IntroVideo'];
            this.JobDescription = res[0]['JobDescription'];
            this.recording_title = res[0]['AssignedTitle'] || res[0]['ProjectName'] || res[0]['MeetingName'];
    
            // this.ReplayConsent = ;
    
            this.model.PublicConsent = (res[0]['ReplayConsent'] == 'webtalkx platform only') ? false : true;
            //this.model.PublicConsent = true;
            this.requestermsg = res[0]['Instructions'];
            if (this.requestermsg) this.requestermsg = this.requestermsg.trim();
    
            this.requesterName = this.vendorname;
            this.requesterId = this.vendorID;
            
            //Check if linkedin url exits then also check if it contains http or not
            if (res[0]['RequesterLinkedIn']) {
              if (res[0]['RequesterLinkedIn'].indexOf("http") == -1 || res[0]['RequesterLinkedIn'].indexOf("https") == -1) {
                this.venLinkedIn = "http://" + res[0]['RequesterLinkedIn'];
              } else {
                this.venLinkedIn = res[0]['RequesterLinkedIn'];
              }
            }

            //Check if linkedin url exits then also check if it contains http or not
            if (res[0]['GiverLinkedIn']) {
              if (res[0]['GiverLinkedIn'].indexOf("http") == -1 || res[0]['GiverLinkedIn'].indexOf("https") == -1) {
                this.givLinkedIn = "http://" + res[0]['GiverLinkedIn'];
              } else {
                this.givLinkedIn = res[0]['GiverLinkedIn'];
              }
            }
          } else {
            
            //showing loader after click on start button
            this.appcmp.showLoader = false;
          }
        });
  }

  //Method to disable the window relaod/close etc.
  disableWindowReload() {
    //Added below event to detect the browser closing and reloading
    window.onbeforeunload = function (event) {
      let message = 'Important: Please click on \'Stop Recording\' button to leave this page.';

      if (typeof event == 'undefined') {
        event = window.event;
      }
      if (event) {
        event.returnValue = message;
      }
      return message;
    };

  }

  //method to get the all the question
  getQuestion(rid) {
    //this.RefRequestID
    if (rid) {
      let email = localStorage.getItem('EmailID');
      let ReferenveObj: any = {};
      ReferenveObj.RefRecordingID = rid;
      ReferenveObj.EmailID = email;
      
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        if (res["length"] > 0) {
          this.question_length = res["length"];
          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionList = res;

            if (this.questionList.length > 0) {
              setTimeout(function(){
                let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
                (video_btn as HTMLButtonElement).click();
                
              }, 50);
              this.initTimerUI();
            }

            if (this.questionList.length > 0) {
              let anslen: number = 0, notlen: number = 0, q_len: number = 0;
              q_len = this.questionList.length;

              for (let i = 0; i < this.questionList.length; i++) {
                //console.log(this.questionList[i]['RecordingStatus']);
                let status = (this.questionList[i] && this.questionList[i]['RecordingStatus']);

                if (status == 'Skipped' || status == 'Answered') {
                  //this.IsqueTouched = true;
                  anslen++;
                } else if (status == 'Not recorded') {
                  //this.IsqueTouched = false;
                  notlen++;
                }
              }
              
              if (q_len == anslen) this.IsqueTouched = true;
              if (notlen > 0) this.IsqueTouched = false;
            }

            let changefont = document.getElementsByClassName('change-font');
            let changecolor = document.getElementsByClassName('change-color');

            if (changefont.length) this.changeFontHandler(changefont);
            if (changecolor.length) this.changeColorHandler(changecolor);
            //this.mediaScript();
            //this.webRTCScript();

            //showing loader after click on start button
            this.appcmp.showLoader = false;

            //Now to active first question
            //this.finalizeStep(Number(1));

            //using interval to get the length of element
            this.timeinterval = setInterval(() => {
              this.attachHandler();
            }, 100);
          } else {
            
            //showing loader after click on start button
            this.appcmp.showLoader = false;
          }
        } else {
          
            //showing loader after click on start button
            this.appcmp.showLoader = false;
        }
      });
    }
  }

  //method to get the all the question
  getQuestionStaus(rid) {
    //this.RefRequestID
    if (rid) {
      let ReferenveObj: any = {};
      ReferenveObj.RefRecordingID = rid;
      
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        if (res["length"] > 0) {
          this.question_length = res["length"];
          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionListStatus = res;

            if (this.questionListStatus.length > 0) {
              //this.IsqueTouched = false;
              let anslen: number = 0, notlen: number = 0, q_len: number = 0;
              q_len = this.questionListStatus.length;
              for (let i = 0; i < this.questionListStatus.length; i++) {
                //console.log(this.questionListStatus[i]['RecordingStatus']);
                let status = (this.questionListStatus[i] && this.questionListStatus[i]['RecordingStatus']);
                
                if (status == 'Skipped' || status == 'Answered') {
                  //this.IsqueTouched = true;
                  anslen++;
                } else if (status == 'Not recorded') {
                  //this.IsqueTouched = false;
                  notlen++;
                }
              }
              
              if (q_len == anslen) this.IsqueTouched = true;
              if (notlen > 0) this.IsqueTouched = false;
            }

          }
        }
      });
    }
  }


  //Method to binding the handler
  attachHandler() {

    this.moveQue = document.getElementsByClassName("moveQue");

    //checking until the length is available
    if (this.moveQue.length) {
      //if (this.moveQue.length) {
      if (this.timeinterval) clearInterval(this.timeinterval);

      this.showNextTwoQuestion(1);
      this._initSpeech();
    }
  }

  //Method to init to change the font size
  changeFontHandler(changefont) {

    if (changefont.length) {
      //if (this.timeinterval) clearInterval(this.timeinterval);
      for (let j = 0; changefont.length > j; j++) {
        changefont[j].addEventListener('click', this.changeFontSize.bind(this, { elm: changefont[j], allelm: changefont }));
      }
    }
  }

  //Method to init to change the font color
  changeColorHandler(changecolor) {

    if (changecolor.length) {
      //if (this.timeinterval) clearInterval(this.timeinterval);
      for (let k = 0; changecolor.length > k; k++) {
        changecolor[k].addEventListener('click', this.changeFontColor.bind(this, { elm: changecolor[k], allelm: changecolor }));
      }
    }
  }

  //method to show next two question
  showNextTwoQuestion(id) {
    this.moveQue = document.getElementsByClassName("moveQue");

    //Method to show active question
    this.showActiveQuestion(id);

    /*let navQue = document.getElementsByClassName("qnumber" + id)[0];
    let question_list = document.getElementsByClassName("question_elem");
    
    if (question_list.length) {
      //if (this.timeinterval) clearInterval(this.timeinterval);

      for (let j = 0; question_list.length > j; j++) {
        
        if (question_list[j] && question_list[j].classList.contains("active_data")) {
          question_list[j].classList.remove("active_data");
          
        } else if (navQue && !navQue.classList.contains('active_data')) {
          navQue.className += ' active_data';
        }

      }
    }*/
  }

  //Method to show active question
  showActiveQuestion(id) {

    let question_list = document.getElementsByClassName("question_elem");
    let navQue = document.getElementsByClassName("qnumber" + id)[0];

    if (question_list.length) {

      for (let j = 0; question_list.length > j; j++) {

        /*if (question_list[j] && question_list[j].classList.contains("active_data")) {
          question_list[j].classList.remove("active_data");

        } else if (navQue && !navQue.classList.contains('active_data')) {
          navQue.className += ' active_data';
        }*/

        if (question_list[j]) {

          if (question_list[j].classList.contains("active_data")) {
            question_list[j].classList.remove("active_data");
            //if ((id-1) != question_list.length) 
          }
          if (navQue && !navQue.classList.contains('active_data')) {
            //console.log("aw_wizard_elm", aw_wizard_elm);
            navQue.className += ' active_data';
          }
        }

      }
    }
  }

  //Methdo to check at last question selection
  onQuestionLastMove() {
    var list = document.getElementsByClassName("question_elem");
    for (var i =0; i < list.length; i++) {
        var active_el = document.getElementsByClassName("question_elem active_data")[0];
        if(active_el == list[i]) {
          if(active_el && active_el.classList.contains('active_data') && list[i+1]) active_el.classList.remove('active_data');
          if(list[i+1]) list[i+1].className += ' active_data';
          break;
        }
    }
  }

  onCollapsed() {
    let o = document.getElementById('collapse1');

    if (o) {
      if (o.classList.contains('show')) {
        this.arrowicon = 'fa-chevron-right';
      } else {
        this.arrowicon = 'fa-chevron-down';
      }
    }
  }

  //Method to rerecord question
  onReRecordQuestion(QuestionID, index) {
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();

    let question_player = document.getElementsByClassName('question_player_'+index)[0];
    if(question_player) (question_player as HTMLVideoElement).pause();
    
    //active_data
    this.inprogress = localStorage.getItem('InProgress');
    if (this.inprogress == 'Y') {
      (<any>$('#inprogressModal')).modal('show');
      return false;

    } else {
      localStorage.setItem('InProgress', '');
      //alert('Finishing');
    }

    // device is ready
     /*this.player.on('deviceReady', () => {
       console.log('device is ready! again');
     });*/
     console.log("player elm", this.player, this.plugin);
     //this.player.deviceReady();

    //Methdo to active the video recording element
    this.activeVideoElement();

    //Method to show active question
    this.showActiveQuestion(index);

    //Method to switch the video element
    this.switchVideoElement();

    //Now updating the wizard to be an active
    this.moveWizardQuestion(index);

    /*let jumb_btn;
    jumb_btn = document.getElementsByClassName('jumb_btn_' + index)[0];
    console.log("jumb_btn", jumb_btn);*/
    //if (jumb_btn) jumb_btn.click();
    /*setTimeout(function () {
      WizardHandler.wizard().goTo("Q" + index);
    }, 1000);*/

  }


  //Method to check the current active step-- not using at present
  /*currentStep() {
    let a = document.getElementsByClassName('btn-skip-question'), b=[];
    
    for (let i = 0; a.length > i; i++) {

      //if (!a[i].classList.contains("marked")) {
      if (!a[i].hasAttribute('disabled')) {
        var qid = a[i].getAttribute('qcount');
        //b.push(qid);
        this.xyz = Number(qid) - 1;
        console.log(a[i], qid, this.xyz);
        //this.finalizeStep(Number(qid));
        return;
      }
    }

    //this.finalizeStep(Number(this.xyz + 1));
  }*/

  //method to call on next and previous button
  finalizeStep(id) {

    if (id) this.showNextTwoQuestion(id);
  }

  /*ngOnDestroy() {
    //clearing set interval
    if (this.timeinterval && this.moveQue.length) {
      clearInterval(this.timeinterval);
    }
  }*/


  //Method to change the font size of question
  changeFontSize(o) {
    //debugger;
    let elm, allelement, questiontext;
    if (o) elm = o.elm, allelement = o.allelm;
    if (allelement.length) {
      for (let m = 0; allelement.length > m; m++) {
        if (allelement[m].classList.contains("current")) allelement[m].classList.remove("current");
      }
    }

    if (elm) {
      elm.className += ' current';
      questiontext = document.getElementsByClassName('question-text');
      for (let s = 0; questiontext.length > s; s++) {
        if (elm.classList.contains("small-font")) questiontext[s].style.fontSize = "medium";
        if (elm.classList.contains("medium-font")) questiontext[s].style.fontSize = "18px";
        if (elm.classList.contains("large-font")) questiontext[s].style.fontSize = "x-large";
      }
    }
  }

  //method to change font color of question
  changeFontColor(o) {

    let elm, questiontext;
    if (o) elm = o.elm;

    if (elm) {
      questiontext = document.getElementsByClassName('question-text');
      for (let c = 0; questiontext.length > c; c++) {
        if (elm.classList.contains("black")) {
          questiontext[c].style.color = "#333333";
          questiontext[c].style.backgroundColor = "#e5e5e5";
        }
        if (elm.classList.contains("blue")) {
          questiontext[c].style.color = "#fff";
          questiontext[c].style.backgroundColor = "#059EE3";
        }
      }
    }
  }

  //method to count the read question
  readQuestion(e) {
    let target, target_id, next_btnid, qcount;

    if (e && e.target) target = e.target;
    if (target) {
      target_id = target.id;
      next_btnid = target.getAttribute('nextid');

      qcount = target.getAttribute('qcount');
      //localStorage.setItem('RecordQues', qcount);

      if (qcount) {
        this.textarea = document.getElementById(qcount) as HTMLElement;
        this.playSpeechText(this.speech);
      }
    }
  }
  
  //Method to reply the recording
  replayInterviewNow(e, index){
    if(index) {
      //Method to show active question
      this.showActiveQuestion(index);

      //Now updating the wizard to be an active
      this.moveWizardQuestion(index);

      //let video_elm = document.getElementsByTagName('video')[0];
      //let video_elm = document.getElementsByClassName('vjs-tech')[0];
      let video_record_elm = document.getElementById('video_clip1');
      if(video_record_elm && !video_record_elm.classList.contains('-hidden')) video_record_elm.className += ' -hidden';

      let video_elm = document.getElementsByClassName('video_replay')[0];
      let replay = document.getElementsByClassName('replay_'+index)[0];
      let ext;
      //console.log("elm", replay);
      if(video_elm) {
        if(video_elm.classList.contains('-hidden')) video_elm.classList.remove('-hidden');
        this.reviewRecording(e, index, 'record', video_elm, false);
        /*if(replay) ext = replay.getAttribute('extension');
        video_elm.setAttribute('src', `https://sara.webtalkx.com/upload/record_`+this.RefRecordingID+'_'+index+'.'+ext);
        video_elm.setAttribute('controls', 'controls');*/
      }

    }

  }
  
  //Method to stop the video playing
  stopVideoPlayer(recording_player) {
    if(recording_player) recording_player.pause();
  }

  //recordingPlayerModel
  reviewRecording(e, index, type, video_elm, Ispopup) {
    let domainApi, recording_player, req_id, vtype, check_url;

    req_id = this.RefRecordingID;
    vtype = type;
    this.video_url = '';
    video_elm.setAttribute('src', '');

    //recording_player = document.getElementsByClassName('recording_player')[0];
    recording_player = video_elm;
    domainApi = `${environment.domainApi}`;
    //this.video_url = domainApi + vtype +'_'+ req_id+'_'+ index+'_'+ '.mp4';
    //https://stage.webtalkx.com/api/UserVideo/10/2.webm
    //check_url = domainApi+'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    //check_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    check_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ this.UserID +'_'+ index+ '.mp4';
    this.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    if(vtype == 'record') this.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ this.UserID +'_'+ index+ '.mp4';

    /*var xhr = new XMLHttpRequest();
    if(this.video_url) {  
      var url = this.video_url;
      var that = this;
      xhr.open("GET", url, true);    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("completed");
            //that.video_url = domainApi+'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
            that.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ that.UserID +'_'+ index+ '.mp4';
            console.log("autoplay on");
            video_elm.setAttribute('src', that.video_url);
            video_elm.setAttribute('controls', 'controls');
            video_elm.setAttribute('autoplay', 'true');
        } else {
          console.log("recalling");
          xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://stage.webtalkx.com');
          xhr.send();
        }
      };
      xhr.onload = function () {
        console.log("completed2222");
      };
      xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://stage.webtalkx.com');
      xhr.send();

      // Fetch preflight request
      var myHeaders = new Headers();
      //myHeaders.append("X-My-Custom-Header", "some value");
      myHeaders.append('Access-Control-Allow-Origin', 'https://stage.webtalkx.com');
      fetch(url, {
          headers: myHeaders
      }).then(function (response) {
          return response.json();
      }).then(function (json) {
          console.log("json");
      });
    }*/
    /*
    var xhr = new XMLHttpRequest();
    if(check_url) {  
      var url = check_url;
      var that = this;
      xhr.open("GET", url, true);    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //that.video_url = domainApi+'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
            that.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
        } else {
          
          //var url = domainApi +'upload/' + vtype +'_'+ req_id+'_'+ index+ '.webm';
          var url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.webm';

          xhr.open("GET", url, true);    
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              
                //that.video_url = domainApi+'upload/'+ vtype +'_'+ req_id+'_'+ index+ '.webm';
                that.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.webm';
            } else {
             
              //var url = domainApi +'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mkv'; 
              var url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mkv';            
              xhr.open("GET", url, true);    
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                  
                    console.log("json");
                    //that.video_url = domainApi+'upload/'+ vtype +'_'+ req_id+'_'+ index+ '.mkv';
                    that.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mkv';
                } else {
                  console.log('testing3');
                }
              };
              
              xhr.send();
            }
          };
          
          xhr.send();
        }
      };
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Access-Control-Request-Headers', 'X-PINGOTHER, Content-Type');
      xhr.send();
    }*/
   
    //if(recording_player)
    if(Ispopup) {
      (<any>$('#recordingPlayerModel')).modal('show');
      video_elm.setAttribute('autoplay', 'true');
    } else {
      // console.log("autoplay on");
      video_elm.setAttribute('src', this.video_url);
      video_elm.setAttribute('controls', 'controls');
      video_elm.setAttribute('autoplay', 'true');
    }
  }
  
  //Method to open description file
  openDescriptionFile(target, filename) {
    let domainApi = `${environment.domainApi}`;
    var split, ext, url, finalurl;
    split = filename.split('.')
    if(split) ext = split[1];
    if(ext) ext = ext.toLowerCase();
    //let url = domainApi+'upload1/'+filename;
    if(ext == 'pdf') {
      finalurl = domainApi+'UserDocuments/'+filename;  
    } else {
      //url = 'https://docs.google.com/viewer?url=https://stage.webtalkx.com/api/UserDocuments/VAISHNAVIPANDEY.docx';
      url = domainApi+'UserDocuments/'+filename;
      finalurl = 'https://docs.google.com/viewer?url='+url;
    }
    //url = domainApi+'UserDocuments/'+filename; 
    //finalurl = 'https://docs.google.com/viewer?url='+url;
    //console.log(finalurl);
    
     var newwindow = window.open(finalurl,'WebTalkx','height=560,width=340');
     if (window.focus) {newwindow.focus()}
     return false;
    
    //if(filename) window.open(url, '_blank');
  }

  //Method to replay the interview
  replayInterview(e, index) {
    let target, target_id, next_btnid, qcount, extension;

    if (e && e.target) target = e.target;
    this.inprogress = localStorage.getItem('InProgress');
    if (this.inprogress == 'Y') {
      (<any>$('#inprogressModal')).modal('show');
      return false;

    } else {
      localStorage.setItem('InProgress', '');
    }

    if (target) {
      target_id = target.id;
      qcount = target.getAttribute('qcount');


      if (qcount) {
        let mediabox = document.getElementsByClassName('media-box')[0];

        if (mediabox) {
          let child = mediabox.childNodes[1], video, h2 = mediabox.childNodes[0] as HTMLElement;

          if (h2) h2.innerHTML = "Recording status: Recording replay";

          //if (child) video = child.childNodes[0];
          let replay_video_element, recording_video_element

          replay_video_element = document.getElementsByClassName('replay_video_element')[0];
          //recording_video_element = document.getElementsByClassName('recording_video_element')[0];
          if (child) recording_video_element = child.childNodes[0];
          if (recording_video_element && !recording_video_element.classList.contains('-hidden')) recording_video_element.className += ' -hidden';

          if (replay_video_element) {
            if (replay_video_element.classList.contains('-hidden')) replay_video_element.classList.remove('-hidden');

            if (this.browserName != 'safari') {
              extension = '.webm';
            } else {
              extension = '.mp4';
            }

            //replay_video_element.setAttribute('src', this.domainurl + 'uploads/' + this.RefRecordingID + '/' + qcount + '.mp4');
            replay_video_element.setAttribute('src', this.domainurl + 'uploads/' + this.RefRecordingID + '/' + qcount + extension);
            replay_video_element.play();
          }
          /*if (video) {
            //video.src = this.domainurl + '/uploads/' + qcount+ '.mp4';
            video.setAttribute('src', '');
            video.setAttribute('src', this.domainurl + 'uploads/' + this.RefRecordingID + '/' + qcount + '.mp4');
            video.setAttribute('controlsList', 'nodownload');
            video.setAttribute('disablePictureInPicture', 'true');
            video.setAttribute('controls', true);
            video.play();
          }*/
        }
      }
    }

    //Method to show active question
    this.showActiveQuestion(index);

    //Now updating the wizard to be an active
    this.moveWizardQuestion(index);

  }

  //method to count the answered question
  answerQuestion(e, index) {
    let target, target_id, skipbtn, next_btnid, next_qid, startbtn, status_txt, start_btn, readbtn, next_btnelm, re_recording, delete_recording, rRequestid, qcount, c_time, timer, next_ansbtn, qnumber_ele;
    if (e && e.target) target = e.target;
    if (target) {
      target_id = target.id;
      //next_btnid = target.getAttribute('nextid');
      //rRequestid = target.getAttribute('rRequest');
      qcount = target.getAttribute('qcount');
      qnumber_ele = document.getElementsByClassName('qnumber' + qcount)[0];


      //Now changing the answered question color and background
      /*if (qnumber_ele && !qnumber_ele.classList.contains('answered_que')) {
        qnumber_ele.className += ' answered_que';
        if (qnumber_ele.classList.contains('skipped_que')) qnumber_ele.classList.remove('skipped_que');
        
      }*/

      if (next_btnid) {
        //next_btnelm = document.querySelectorAll('button[qcount="' + next_btnid + '"]')[0];
        //next_ansbtn = document.querySelectorAll('button[qcount="' + next_btnid + '"]')[1];

        //Enabling the current skip and answered button
        /*if (next_btnelm) next_btnelm.removeAttribute('disabled');
        if (next_ansbtn) next_ansbtn.removeAttribute('disabled');*/

        /*this.textarea = document.getElementById(next_btnid) as HTMLElement;
        this.playSpeechText(this.speech);*/

        //this.xyz = { stepIndex: Number(next_btnid) - 1 };
        //this.currentqindex = Number(next_btnid);

      }
    }


    if (target_id) {
      /*skipbtn = document.getElementsByClassName('skip_' + target_id)[0];
      if (next_btnelm) next_qid = next_btnelm.id;

      readbtn = document.getElementsByClassName('read_' + target_id)[0];
      if (readbtn) readbtn.setAttribute('disabled', true);
      */

      /*readbtn = document.getElementsByClassName('read_' + target_id);      
      if (readbtn.length > 0) {
        if (readbtn[0]) readbtn[0].setAttribute('disabled', true);
        if (readbtn[1]) readbtn[1].setAttribute('disabled', true);
      }*/

      /*re_recording = document.getElementsByClassName('rerecord_' + target_id)[0];
      if (re_recording) re_recording.removeAttribute('disabled');*/

      delete_recording = document.getElementsByClassName('delete_' + target_id)[0];
      //if (delete_recording) delete_recording.removeAttribute('disabled');

      /*re_recording = document.getElementsByClassName('rerecord_' + target_id);
      if (re_recording.length > 0) {
        if (re_recording[0]) re_recording[0].removeAttribute('disabled');
        if (re_recording[1]) re_recording[1].removeAttribute('disabled');
      }*/

      /*status_txt = document.getElementsByClassName('status_' + target_id)[0];
      if (status_txt) status_txt.innerText = "Video uploading";*/
    }
    //debugger;
    //If recording already started then do not click on start/stop button. this when directly clicking on stop button
    if (qcount) {
      start_btn = document.getElementsByClassName('start_' + qcount)[0];
    }

    if (this.IsRecordingStarted) {

      if (start_btn) {
        start_btn.click();
        if (start_btn) start_btn.setAttribute('disabled', true);
        return false;

      }
    } else {
      this.IsRecordingStarted = false;
      if (start_btn) start_btn.setAttribute('disabled', true);
    }
    //this.IsRecordingStarted = false;

    //Getting the timer current value to set the answered/skip time
    /* = document.getElementById('timer');
    if (timer) c_time = timer.innerText;*/

    if (this.question_length) {
      //if (this.question_length > this.answercount) {
      //this.answercount++;
      //if (this.question_length == this.answercount) {
      //  if (e && e.target) e.target.setAttribute('disabled', true);
      //}
      /*this.answercount++;
      //console.log("sktarget", target, "skipbtn", skipbtn, next_btnelm, next_qid);
      if (target) {
        target.setAttribute('disabled', true);
        target.className += ' marked';
      }
      if (skipbtn) {
        skipbtn.setAttribute('disabled', true);
        skipbtn.className += ' marked';
      }
      if (next_btnid) this.showNextTwoQuestion(Number(next_btnid));*/

      /*var a = document.getElementsByClassName('btn-answer-question');
      for (var i = 0; a.length > i; i++) {

        if (!a[i].hasAttribute('disabled')) {
          var qid = a[i].getAttribute('qcount');

          this.xyz = Number(qid) - 1;
          console.log('ans', this.xyz);
          return false;
        }
      }*/

      /*let a = document.getElementsByClassName('btn-answer-question'), b = [];

      for (let i = 0; a.length > i; i++) {

        //if (!a[i].classList.contains("marked")) {
        if (!a[i].hasAttribute('disabled')) {
          var qid = a[i].getAttribute('qcount');
          //b.push(qid);
          this.xyz = Number(qid) - 1;
          console.log(a[i], qid, this.xyz);
          this.finalizeStep(Number(qid));
          return;
        }
      }*/

      /*this.answerdata.RefRequestID = Number(rRequestid);
      this.answerdata.QuestionID = Number(target_id);
      this.answerdata.AuthorID = 0;
      this.answerdata.NextQuestionID = Number(next_qid);
      this.answerdata.Operation = 1;
      this.answerdata.StartTime = this.starttime;
      this.answerdata.EndTime = c_time;*/
      //this.answerdata.RefRequestID = Number(this.RefRecordingID);
      this.answerdata.RecordingQuestionID = Number(target_id);
      this.answerdata.RecordingStatus = 'Answered';
      this.answerdata.RecordingStartTime = this.starttime || '00:00:01';
      //this.answerdata.RecordingEndTime = c_time;
      this.answerdata.RecordingEndTime = this.starttime || '00:00:01';
      this.answerdata.RecordingAnsScript = null;

      this.starttime = c_time;

      //console.log("a", this.answerdata);
      //Answer store with current time
      return this.http
      .put(`${environment.domainApi}I2BRecordingRequest/UpdateRecordingQuestionStatus`, this.answerdata).subscribe(res=>{
        if (res[0]['ResponseStatus'] == 'Success') {
          //Now getting question status
          //this.IsqueTouched = true;

          //Now getting question status
          this.getQuestionStaus(this.RefRecordingID);

          //Method to switch the video element
          //this.switchVideoElement();
        }
      }); 
    }

    //Now updating the wizard to be an active
    this.moveWizardQuestion(index);
  }

  //Method to switch the video element
  switchVideoElement() {
    let replay_video_element, recording_video_element;
    let mediabox = document.getElementsByClassName('media-box')[0];

    if (mediabox) {
      let child = mediabox.childNodes[1];
      if (child) recording_video_element = child.childNodes[0];
      if (recording_video_element && recording_video_element.classList.contains('-hidden')) recording_video_element.classList.remove('-hidden');
    }

    replay_video_element = document.getElementsByClassName('replay_video_element')[0];
    //recording_video_element = document.getElementsByClassName('recording_video_element')[0];

    if (replay_video_element) {
      if (!replay_video_element.classList.contains('-hidden')) replay_video_element.className += ' -hidden';
      replay_video_element.setAttribute('src', '');
    }
  }

  //Method to select first question
  scrollToFirstPos(e) {

  }

  //method to open the chat box
  openChatBox(chatcontainer) {
    let chatbody = document.getElementById('chat-body');
    if (chatcontainer) {
      if (chatcontainer.classList.contains('-hidden')) chatcontainer.classList.remove('-hidden');
      else chatcontainer.className += ' -hidden';
    }
  }

  openSetting() {
    let setting = document.getElementById('setting');
    if (setting) {
      if (setting.classList.contains('-hidden')) setting.classList.remove('-hidden');
      else setting.className += ' -hidden';
    }
  }


  // Method for checking giver attended or not.
  CheckGiverAttended(): boolean {
    let req_id = Number(localStorage.getItem('RefRequestID'));

    this.http
    .get(`${environment.domainApi}RefRequest/GetRefRequestByID?RefRequestID=` + req_id).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {
        // localStorage.setItem("IsInterviewAttended", res[0]['IsInterviewAttended']);
        if (res[0]['IsInterviewAttended']) {
          this.IsInterviewAttended = true;
        } else {
          this.IsInterviewAttended = false;
        }
      }
    });

    
    return this.IsInterviewAttended;
  }

  //Method to delete the recording
  onDeleteRecording(e, index, RecordingQuestionID) {
    let target, target_id, next_btnid, qcount, ansbtn, startbtn, readbtn, replay, ReRecord;
    this.inprogress = localStorage.getItem('InProgress');
    if (this.inprogress == 'Y') {
      (<any>$('#inprogressModal')).modal('show');
      return false;

    } else {
      localStorage.setItem('InProgress', '');
      //alert('Finishing');
    }

    let video_elm = document.getElementsByClassName('video_replay')[0];
    if(video_elm) (video_elm as HTMLVideoElement).pause();

    this.RecordingQuestionID = RecordingQuestionID;

    if (e && e.target) target = e.target;
    if (target) {
      target_id = target.id;

      qcount = target.getAttribute('qcount');
      if (qcount) this.delete_record = qcount;
      (<any>$('#confirmDeleteModal')).modal('show');
      
    }

    if (index) {
      //Method to show active question
      this.showActiveQuestion(index);

      //Now updating the wizard to be an active
      this.moveWizardQuestion(index);
    }
  }

  //Method to call on re recording
  onReRecording(e, index) {

    let target, target_id, next_btnid, qcount, ansbtn, startbtn, readbtn, replay, ReRecord, delete_recording;

    if (e && e.target) target = e.target;
    this.inprogress = localStorage.getItem('InProgress');
    if (this.inprogress == 'Y') {
      (<any>$('#inprogressModal')).modal('show');
      return false;

    } else {
      localStorage.setItem('InProgress', '');
      //alert('Finishing');
    }

    if (target) {
      target_id = target.id;
      next_btnid = target.getAttribute('nextid');

      qcount = target.getAttribute('qcount');
      localStorage.setItem('RecordQues', qcount);

      if (qcount) {
        replay = document.getElementsByClassName('replay_' + qcount)[0];
        /*replay = document.getElementsByClassName('replay_' + qcount);
        if (replay[0] && !replay[0].classList.contains('-hidden')) {
          replay[0].className += ' -hidden';
        }*/

        //if (replay) replay.setAttribute('disabled', true);

      }

      if (target_id) {
        /*ansbtn = document.getElementsByClassName('answer_' + target_id)[0];
        if (ansbtn) {
          ansbtn.removeAttribute('disabled');
        }
        readbtn = document.getElementsByClassName('read_' + target_id)[0];
        if (readbtn) {
          readbtn.removeAttribute('disabled');
        }*/

        delete_recording = document.getElementsByClassName('delete_' + target_id)[0];
        //if (delete_recording) delete_recording.setAttribute('disabled', true);

        startbtn = document.getElementsByClassName('start_' + qcount)[0];
        if (startbtn) {
          this.IsRecordingStarted = false;
          //startbtn.innerText = 'Start Re-recording';
          startbtn.removeAttribute('disabled');
          //startbtn.click();
          this.IsReRecord = true;
        }
        //this.textarea = document.getElementById(qcount) as HTMLElement;
        //this.playSpeechText(this.speech);
      }

      if (target) {
        if (target.nodeName == 'I') {
          target = target.parentElement;
          target.setAttribute('disabled', true);
        } else {
          target.setAttribute('disabled', true);
        }

        if (target_id) {
          if (target.classList.contains('requestion')) {
            ReRecord = document.getElementsByClassName('rerecord_' + target_id)[0];
            if (ReRecord) ReRecord.setAttribute('disabled', true);
          } /*else {
            ReRecord = document.getElementsByClassName('rerecord_' + target_id)[1];
            if (ReRecord) ReRecord.setAttribute('disabled', true);
          }*/
        }
      }

      //Method to show active question
      this.showActiveQuestion(index);

      //Now updating the wizard to be an active
      this.moveWizardQuestion(index);
      //Method to switch the video element
      this.switchVideoElement();

    }

    /*if (ReRecord) {
      if (ReRecord.classList.contains('-hidden')) {
        ReRecord.classList.remove('-hidden');
      }
      else {
        ReRecord.className += ' -hidden';
      }
    }

    if (ansbtn) {
      console.log("ansbtn", ansbtn);
    }*/
  }

  //method to enable the ans and skip button
  enableAnsSkipBtn(qcount) {
    let skip, ans, read;
    skip = document.getElementsByClassName('btn-skip-question');
    ans = document.getElementsByClassName('btn-answer-question');
    read = document.getElementsByClassName('btn-read-question');

    skip = document.querySelector('.btn-skip-question[qcount="' + qcount + '"]');
    ans = document.querySelector('.btn-answer-question[qcount="' + qcount + '"]');
    read = document.querySelector('.btn-read-question[qcount="' + qcount + '"]');


    //if (skip) skip.removeAttribute('disabled');
    if (skip) skip.setAttribute('disabled', true);
    if (ans) ans.removeAttribute('disabled');
    //if (read) read.removeAttribute('disabled');
    if (read) read.setAttribute('disabled', true);
    /*if (read[1]) read[1].setAttribute('disabled', true);*/
    //this.IsReRecord = false;

    // for (let i = 0; skip.length > i; i++) {
    // }
  }

  
  onStart(e, index) {
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();

    let question_player = document.getElementsByClassName('question_player_'+index)[0];
    if(question_player) (question_player as HTMLVideoElement).pause();
            
    /*if(question_player && !(question_player as HTMLVideoElement).paused) {
      this.playing_error = 'Please stop the question video replay then start the recording.'
      if(question_player) (question_player as HTMLVideoElement).pause();
      return false;
    } else {
      this.playing_error = ''
    }*/
    
    //Methdo to active the video recording element
    this.activeVideoElement();
            
    let video_btn = document.getElementsByClassName('vjs-button vjs-icon-record-start')[0];
    if(video_btn) (video_btn as HTMLButtonElement).click();
    
    let start_btn = document.getElementsByClassName('start_'+index)[0];
    if(start_btn) {
      //start_btn.setAttribute('disabled', 'true');
      
      if(start_btn && !start_btn.classList.contains('-hidden')){
        start_btn.className += ' -hidden';
      }
    }

    let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+index+'"]');
    let save_ans = document.querySelector('.btn-answer-question[qcount="'+index+'"]');

    if(cancel_ans && cancel_ans.classList.contains('-hidden')){
      cancel_ans.classList.remove('-hidden');
    }
    
    if(save_ans && save_ans.classList.contains('-hidden')){
      save_ans.classList.remove('-hidden');
    }

    this.stopTimer = false;
    //this.initTimer();
    this.startTimer();
  }

  //Methdo to active the video recording element
  activeVideoElement(){
    let video_record_elm = document.getElementById('video_clip1');
    if(video_record_elm && video_record_elm.classList.contains('-hidden')) video_record_elm.classList.remove('-hidden');
    
    let video_elm = document.getElementsByClassName('video_replay')[0];
    if(video_elm && !video_elm.classList.contains('-hidden')) video_elm.className += ' -hidden';
  }

  //Method to cancel the answer
  onCancelRecording(index) {
    this.IsRecordingStarted = false;
    this.IsRecordingCanceled = true;
    this.stopTimer = true;
    
    //let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    //(video_btn as HTMLButtonElement).click();
        
    //let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    //(video_stop_btn as HTMLButtonElement).click();
    
    let start_btn = document.getElementsByClassName('start_'+index)[0];
    if(start_btn) {
      //start_btn.removeAttribute('disabled');
      
      if(start_btn && start_btn.classList.contains('-hidden')){
        start_btn.classList.remove('-hidden');
      }
    }
    
    let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+index+'"]');
    let save_ans = document.querySelector('.btn-answer-question[qcount="'+index+'"]');

    if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
      cancel_ans.className += ' -hidden';
    }
    
    if(save_ans && !save_ans.classList.contains('-hidden')){
      save_ans.className += ' -hidden';
    }

    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    //(video_btn as HTMLButtonElement).click();

    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    if(video_stop_btn) (video_stop_btn as HTMLButtonElement).click();

    setTimeout(function(){
      let duration_display = document.getElementsByClassName('vjs-duration-display')[0];
      if(duration_display) duration_display.innerHTML = '00:30';
    }, 500);
  
    //this.ngAfterViewInit();
    //let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    (video_btn as HTMLButtonElement).click();
    
  }
    
  //method to count the skipped question
  skipQuestion(e, index, qindex) {
    //this.initTimerUI();
    //this.InitVariable();
    this.stopTimer = true;
    //setTimeout(function(){
      let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
      //(video_btn as HTMLButtonElement).click();
    //}, 50);

    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    if(video_stop_btn) (video_stop_btn as HTMLButtonElement).click();
    //(video_btn as HTMLButtonElement).click();

    let video_pause_btn = document.getElementsByClassName('vjs-control vjs-button vjs-paused')[0];
    //(video_pause_btn as HTMLButtonElement).click();
    
    //if(this.question_length == Number(qindex)){
      
      /*let finish_btn = document.getElementById('btn-finish-recording');
      if(finish_btn && finish_btn.classList.contains('-hidden')){
        finish_btn.classList.remove('-hidden');
      }*/
            
      let cancel_ans = document.querySelector('#btn-cancel-answer[qcount="'+qindex+'"]');
      let save_ans = document.querySelector('.btn-answer-question[qcount="'+qindex+'"]');
      
      let start_btn = document.getElementsByClassName('start_'+qindex)[0];
      /*if(start_btn && !start_btn.classList.contains('-hidden')) {
        start_btn.className += ' -hidden';
      }*/
      if(start_btn && start_btn.classList.contains('-hidden')){
        start_btn.classList.remove('-hidden');
      }

      if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
        cancel_ans.className += ' -hidden';
      }
      
      if(save_ans && !save_ans.classList.contains('-hidden')){
        save_ans.className += ' -hidden';
      }

      let that = this;

      //setTimeout(function(){
        
        if (that.player) {
          //that.player.dispose();
          //that.player = false;
          //that.Isfinish = true;
          //that.IsSave = false;
          //that._confirmToStop();
          //that.router.navigateByUrl('/I2BApplication/RecordingsCatalogByMe2');
        }
      //}, 100);
    //}

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

    //if(this.question_length != qindex){
      this.answerQuestion(e, qindex);
      
      //Method to show active question
      //this.showActiveQuestion(qindex);
      this.onQuestionLastMove();

      //Now updating the wizard to be an active
      this.moveWizardQuestion(index);
    //} else {
      
      //this.router.navigateByUrl('/SurveyApp/Completed');
    //}

    //this.InitVideoPlugin();
    
  }

  //Method to init the video plugin
  InitVideoPlugin() {
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
        let q_index = localStorage.getItem("QuestionIndex");
        //let usercode = this.final_str;
        let usercode = String(this.RefRecordingID);
        //usercode = 'record_'+usercode + '-' + q_index;
        usercode = 'record_'+usercode + '_' + this.UserID + '_' + q_index;
        const formData: FormData = new FormData();
        var ext =  this.player.recordedData.name.split('.').pop();
        //let file_name = usercode +'.'+ ext;
        //formData.append('file', this.player.recordedData, this.player.recordedData.name);
        //formData.append('file', this.player.recordedData, file_name);
        let file_name = usercode +'.mp4';
        //formData.append('file', this.player.recordedData, file_name);
        formData.append('video-blob', this.player.recordedData);
        formData.append('RefRecordingID', String(this.RefRecordingID));
        formData.append('questionName', String(q_index));
        formData.append('FileName', file_name);
        console.log("data", this.player.recordedData, file_name);
        
        //formData.append('RefRequestId', this.RefRequestId.toString());
        //formData.append('VideoName', usercode);

        //console.log('finished recording: ', this.player.recordedData, this.player.recordedData.name);
        //return false;
        console.log("usercode", usercode);
        
        /*if(this.question_length == Number(q_index)){
          
          //hiding loader after login
          this.appcmp.showLoader = true;
        }*/
        let video_pause_btn = document.getElementsByClassName('vjs-control vjs-button vjs-paused')[0];
        //(video_pause_btn as HTMLButtonElement).click();

        let answer_btn = document.querySelectorAll('.btn-answer-question');
        if(answer_btn.length > 0){
          for(let i =0; i < answer_btn.length; i++){
            if(answer_btn[i] && !answer_btn[i].classList.contains('-hidden')){
              (answer_btn[i] as HTMLButtonElement).click();
            }
          }
        }
        let ques_index = q_index;
        let status_elm = document.getElementsByClassName('status_'+ques_index)[0];
        if(status_elm) status_elm.innerHTML = 'Uploading...';

        //console.log('Player: ', this.player);
        //return false;
        return this.http
          //.post(`https://sara.webtalkx.com/api/upload`, formData).subscribe(res=>{
          .post(`${environment.domainApi}FinalSubmission/PostRecordedAudioVideoInDir`, formData).subscribe(res=>{

            let replay_elm = document.getElementsByClassName('replay_'+ques_index)[0];
            if(replay_elm) {
              replay_elm.removeAttribute('disabled');
              replay_elm.setAttribute('extension', ext);
            }

            let removeRecord = document.getElementsByClassName('removeRecord_' + ques_index)[0];
            if (removeRecord) removeRecord.removeAttribute('disabled');

            let status_elm = document.getElementsByClassName('status_'+ques_index)[0];
            if(status_elm) status_elm.innerHTML = 'Answered';
            
            /*if(this.question_length == Number(q_index)){
              https://sara.webtalkx.com/api/videorecordings
              
              //hiding loader after login
              //this.appcmp.showLoader = false;
              //this.router.navigateByUrl('/SurveyApp/Completed');
            }*/
            //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          });
        
          
      } else {
        let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
        //(video_btn as HTMLButtonElement).click();

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


  //Method to cancel the answer
  // onCancelRecording() {
  //   this.IsRecordingStarted = false;
  // }

  //Method to confimr the rerecording
  _confirmToStart(qcount) {
    let ansbtn;

    localStorage.setItem('RecordQues', qcount);

    //Enabling the answered and skip button
    if (!this.IsRecordingStarted) {
      this.enableAnsSkipBtn(qcount);
      this.IsRecordingStarted = true;
    } else {
      if (qcount) {

        ansbtn = document.querySelector('.btn-answer-question[qcount="' + qcount + '"]');
        //setTimeout(function () {
        this.IsRecordingStarted = false;
        if (ansbtn) ansbtn.click();
        //}, 2000);

      }
    }
  }

  //Method to enable replay icon
  enableReplayIcon() {
    let replay_btn, qcount;

    qcount = localStorage.getItem('RecordQues');
    if (qcount) replay_btn = document.getElementsByClassName('replay_' + qcount)[0];
    if (replay_btn) {
      if (replay_btn.classList.contains('-hidden')) replay_btn.classList.remove('-hidden');
      //localStorage.setItem('RecordQues', '');
    }

  }

  //Method to disable and disable the start button
  _enabledisableStartButton(startbtn, o) {
    if (startbtn) {
      if (o) {
        startbtn.removeAttribute('disabled');
        startbtn.className += ' hands';
      } else {
        startbtn.setAttribute('disabled', true);
        startbtn.classList.remove('hands');
      }
    }
  }

  //Method to enable and disable the pause button
  _enableDisablePauseButton(o) {
    let pause_recording = document.getElementById('pause_recording');
    if (pause_recording) {
      if (o) {
        pause_recording.removeAttribute('disabled');
        pause_recording.className += ' hands';
      } else {
        pause_recording.setAttribute('disabled', 'true');
        pause_recording.classList.remove('hands');
      }
    }
  }

  //Method to enable and disable the pause button
  _enableDisableStopeButton(o) {
    let stop_recording = document.getElementById('stop_recording');
    if (stop_recording) {
      if (o) {
        stop_recording.removeAttribute('disabled');
        stop_recording.className += ' hands';
      } else {
        stop_recording.setAttribute('disabled', 'true');
        stop_recording.classList.remove('hands');
      }
    }
  }

  //Method to finish recording
  onFinish() {
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();

    this.Isfinish = true;
    this.IsSave = false;
    this.inprogress = localStorage.getItem('InProgress');
    this.IsUploading = localStorage.getItem('IsUploading');

    if (this.inprogress == 'Y' || this.IsUploading == 'Y') (<any>$('#inprogressModal')).modal('show');
    //if (this.inprogress == 'Y') (<any>$('#inprogressModal')).modal('show');
    else (<any>$('#confirmModal')).modal('show');
    
  }

  //Method to save recording
  onSave() {
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();

    this.Isfinish = false;
    this.IsSave = true;
    this.inprogress = localStorage.getItem('InProgress');

    if (this.inprogress == 'Y') (<any>$('#inprogressModal')).modal('show');
    else (<any>$('#confirmModal')).modal('show');
  }

  //Method to stop the recording
  _confirmToStop() {

    //showing loader after login
    this.appcmp.showLoader = true;

    if (this.Isfinish) {
      this.appcmp.loadermessage = 'Please wait, recording is being finished...';
      let reqObj: any = {};
      reqObj.AuthorID = this.UserID;
      reqObj.ID = this.RefRecordingID;
      reqObj.FinalStatus = 'Finished';

      //if (this.browserName != 'safari') {
      //  this.ConvertRecordedVideos(this.RefRecordingID);
      //}
      return this.http
        .put(`${environment.domainApi}FinalSubmission/UpdateStatusForFinalSubmissionWebTalkx`, reqObj).subscribe(res=>{
          
          let data = Object.keys(res).length;
          if (data && res[0]['ResponseStatus'] == 'Success') {
            //Now update user status
            this.updateUserStatus();

            this.router.navigateByUrl('/I2BApplication/MyRecordings');
            
            //if (this.browserName != 'safari') {
            //  this.ConvertRecordedVideos(this.RefRecordingID);
            //}

            //this.ConvertRecordedVideos(this.RefRecordingID);
            let catalogoption = localStorage.getItem('CatalogOption');

            /*if (catalogoption == '1') this.router.navigateByUrl('/I2BApplication/RecordingsCatalogByMe');
          // else if (catalogoption == '2') this.router.navigateByUrl('/I2BApplication/RecordingsCatalogFromMe');
            else if (catalogoption == '2') this.router.navigateByUrl('/I2BApplication/Feedback');
            else if (catalogoption == '3') this.router.navigateByUrl('/I2BApplication/RecordingsCatalogForMyReview');
            else this.router.navigateByUrl('/I2BApplication/RecordingsCatalogFromMe');
            */

            //hiding loader after login
            this.appcmp.showLoader = false;

          } else {

            //hiding loader after started
            this.appcmp.showLoader = false;
          }
        });

    } else if (this.IsSave) {
      this.appcmp.loadermessage = 'Please wait, recording is being saved...';

      let reqObj: any = {};
      reqObj.AuthorID = this.UserID;
      reqObj.ID = this.RefRecordingID;
      reqObj.FinalStatus = 'Draft';

      return this.http
        .put(`${environment.domainApi}FinalSubmission/UpdateStatusForFinalSubmissionWebTalkx`, reqObj).subscribe(res=>{
          let data = Object.keys(res).length;

          if (data && res[0]['ResponseStatus'] == 'Success') {
            
            let recordoption = localStorage.getItem('RecordOption');

            /*if (recordoption == '1') this.router.navigateByUrl('/I2BApplication/RequestsByMe');
            else if (recordoption == '2') this.router.navigateByUrl('/I2BApplication/RequestsFromMe');
            else */
            this.router.navigateByUrl('/I2BApplication/RequestsFromMe');
            //hiding loader after login
            this.appcmp.showLoader = false;

          } else {

            //hiding loader after started
            this.appcmp.showLoader = false;

          }
        });
    }
  }

  
  //Method to update the uswer status
  updateUserStatus() {
        
    let reqObj: any = {};
    let participantid = Number(localStorage.getItem('AssignedID'));
    if(participantid == 0) participantid = Number(localStorage.getItem('LoginUserID'));
    
    reqObj.ParticipantID = participantid;
    reqObj.IsRecorded = 1;
    reqObj.AuthorID = this.UserID;
    reqObj.RefRecordingID = this.RefRecordingID;
    //console.log(PublicConsentn);
    
    //return false;
    
    return this.http
    .put(`${environment.domainApi}ParticipantInfo/UpdateParticipantStatus`, reqObj).subscribe(res=>{
      
    });

  }

  //Method to change the public consent
  selectPublicConsent(e, PublicConsent) {
        
    let reqObj: any = {};
    reqObj.RefRecordingID = this.RefRecordingID;
    reqObj.ReplayConsent = (PublicConsent) ? 'Public' : 'webtalkx platform only';
    //console.log(PublicConsentn);
    //return false;
    
    return this.http
    .put(`${environment.domainApi}I2BRecordingRequest/UpdateReplayConsent`, reqObj).subscribe(res=>{
      
    });

  }

  //Method to confirm to delet the recording
  _confirmToDeleteRecording() {
    if (this.delete_record) {

      //hiding loader after login
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      let reqObj: any = {}, record_name;
      reqObj.RefRecordingID = this.RefRecordingID;
      //reqObj.QuestionIndex = this.delete_record + '.mp4';
      //reqObj.QuestionIndex = this.delete_record;
      record_name = 'record_'+this.RefRecordingID+'_'+this.UserID+'_'+this.delete_record+'.mp4';
      reqObj.QuestionIndex = record_name;
      //console.log("reqObj", reqObj);
      let video_elm = document.getElementsByClassName('video_replay')[0];
      if(video_elm) (video_elm as HTMLVideoElement).setAttribute('src', '');

      //return false;
      /*
      return this.http
      .put(`${environment.domainApi}I2BRecordingRequest/DeleteRecording`, reqObj).subscribe(res=>{
        
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          this.alert_message = 'Recording deleted successfully!';
          (<any>$('#confirmMsgModel')).modal('show');

          //now updatign status
          this.UpdateQuestionStatus();
          
          //Methdo to active the video recording element
          this.activeVideoElement();

          let removeRecord = document.getElementsByClassName('removeRecord_' + this.delete_record)[0];
          if (removeRecord) removeRecord.setAttribute('disabled', 'true');

          let replayRecord = document.getElementsByClassName('replay_' + this.delete_record)[0];
          if (replayRecord) replayRecord.setAttribute('disabled', 'true');

          let status = document.getElementsByClassName('status_' + this.RecordingQuestionID)[0];
          if (status) (status as HTMLElement).innerText = 'Not recorded';

          let qnumber = document.getElementsByClassName('qnumber' + this.delete_record)[0];
          //if (qnumber && qnumber.classList.contains('answered_que')) qnumber.classList.remove('answered_que');


          if (this.RecordingQuestionID) {
            let skip = document.getElementsByClassName('skip_' + this.RecordingQuestionID)[0];
            if (skip) {
              skip.removeAttribute('disabled');
            }

            //delete_recording = document.getElementsByClassName('delete_' + target_id)[0];
            //if (delete_recording) delete_recording.setAttribute('disabled', true);

            let startbtn = document.getElementsByClassName('start_' + this.delete_record)[0];
            if (startbtn) {
              startbtn.removeAttribute('disabled');

            }
          }

          this.delete_record = null;
          
          //hiding loader after login
          this.appcmp.showLoader = false;
          //Method to switch the video element
          this.switchVideoElement();

        } else {
          this.alert_message = 'There is some error. Recording is not deleting!';
          (<any>$('#confirmMsgModel')).modal('show');
          //hiding loader after started
          this.appcmp.showLoader = false;

        }
      });
      */
     let that = this;
     setTimeout(function(){
       //hiding loader after login
       that.appcmp.showLoader = false;
       
      let removeRecord = document.getElementsByClassName('removeRecord_' + that.delete_record)[0];
      if (removeRecord) removeRecord.setAttribute('disabled', 'true');

      let replayRecord = document.getElementsByClassName('replay_' + that.delete_record)[0];
      if (replayRecord) replayRecord.setAttribute('disabled', 'true');

      let status = document.getElementsByClassName('status_' + that.RecordingQuestionID)[0];
      if (status) (status as HTMLElement).innerText = 'Not recorded';

      let qnumber = document.getElementsByClassName('qnumber' + that.delete_record)[0];
      //if (qnumber && qnumber.classList.contains('answered_que')) qnumber.classList.remove('answered_que');


      if (that.RecordingQuestionID) {
        let skip = document.getElementsByClassName('skip_' + that.RecordingQuestionID)[0];
        if (skip) {
          skip.removeAttribute('disabled');
        }

        //delete_recording = document.getElementsByClassName('delete_' + target_id)[0];
        //if (delete_recording) delete_recording.setAttribute('disabled', true);

        let startbtn = document.getElementsByClassName('start_' + that.delete_record)[0];
        if (startbtn) {
          startbtn.removeAttribute('disabled');

        }
      }

      that.delete_record = null;

       that.alert_message = 'Recording deleted successfully!';
      (<any>$('#confirmMsgModel')).modal('show');

     }, 1000);
      

      //now updatign status
      this.UpdateQuestionStatus();
      
      //Methdo to active the video recording element
      this.activeVideoElement();
      
      //hiding loader after login
      this.appcmp.showLoader = false;
      //Method to switch the video element
      this.switchVideoElement();
    }
  }

  //Method to update the question status
  UpdateQuestionStatus() {
    let obj: any = {};
    obj.RecordingQuestionID = Number(this.RecordingQuestionID);
    obj.RecordingStatus = 'Not recorded';
    obj.RecordingStartTime = '00:00';
    obj.RecordingEndTime = '00:00';

    //console.log("a", this.answerdata);
    //Answer store with current time
    
    return this.http
    .put(`${environment.domainApi}I2BRecordingRequest/UpdateRecordingQuestionStatus`, obj).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {
        //debugger;
        //Now getting question status
        this.getQuestionStaus(this.RefRecordingID);
      }
    });

  }


  //Method to confirm to convert the recording
  ConvertRecordedVideos(RefRecordingID) {
    if (RefRecordingID) {
      let reqObj: any = {};
      reqObj.recordingFolder = RefRecordingID;

      return this.http
      .put(`${environment.domainApi}RecordRTC/ConvertRecordedFolderVideos`, reqObj).subscribe(res=>{
        
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          let hash = window.location.hash;
          if (hash == "#/I2BApplication/RecordingsCatalogFromMe") {
            window.location.reload();
          }
        } else {
          
        }
      });
    }
  }

  //Method to confirm to convert the recording
  ConvertSingleRecordedVideos() {

    let reqObj: any = {};
    reqObj.recordingFolder = this.RefRecordingID;
    reqObj.questionNumber = 1;
    
    return this.http
    .put(`${environment.domainApi}RecordRTC/ConvertRecordedFile`, reqObj).subscribe(res=>{
      
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {

      } else {

        
      }
    });
  }

  //Method to get the unread notification
  GetUnreadNotificationCount(uid) {

    if (uid) {
      
      return this.http
      .get(`${environment.domainApi}I2BNotifications/GetUnReadNotificationsCount?UserID=` + uid).subscribe(res=>{
        
        if (res["length"] > 0) {

          this.unreaditemcount = res[0]['UnReadCount'];

          //method to show/hide notification icon
          this.enableDisableNotificationIcon(this.unreaditemcount);
        } else {

        }
      });
    }

  }

  //Method to get the unread notification
  GetUnreadMessageCount(uid) {

    if (uid) {
      
      return this.http
      .get(`${environment.domainApi}Messages/GetUnReadMessageCount?UserID=` + uid).subscribe(res=>{
        
        if (res["length"] > 0) {

          this.unreadmsgcount = res[0]['UnReadCount'];

          //method to show/hide notification icon
          this.enableDisableMessageIcon(this.unreadmsgcount);

        } else {

        }
      });
    }

  }


  enableDisableNotificationIcon(unreaditemcount: number) {
    let iconbell = document.getElementsByClassName('icon-bell')[0];

    if (unreaditemcount > 0) {
      if (iconbell && !iconbell.classList.contains('show-count')) {
        iconbell.className += ' show-count';
        iconbell.setAttribute('data-count', String(unreaditemcount));
      }
    } else {
      if (iconbell && iconbell.classList.contains('show-count')) {
        iconbell.classList.remove('show-count');
        iconbell.removeAttribute('data-count');
      }
    }

  }

  enableDisableMessageIcon(unreaditemcount: number) {
    let iconmsg = document.getElementsByClassName('icon-message')[0];

    if (unreaditemcount > 0) {
      if (iconmsg && !iconmsg.classList.contains('show-count')) {
        iconmsg.className += ' show-count';
        iconmsg.setAttribute('data-count', String(unreaditemcount));
      }
    } else {
      if (iconmsg && iconmsg.classList.contains('show-count')) {
        iconmsg.classList.remove('show-count');
        iconmsg.removeAttribute('data-count');
      }
    }

  }


  //open the dialogue
  openDialogue() {
    (<any>$('#exampleModalLong')).modal('show');
  }

  tour() {
    // this.joyrideService.startTour(
    //   { steps: ['firstStep', 'secondStep'] }
    // );
  }
  
  //Method to get the user info like id, name
  getUserInfo(e, id, f_name) {

    //If target is image tag then do not open message popup
    if (e && e.target && !e.target.classList.contains('icon-picture')) {
      this.receiver_id = id;
      this.full_name = f_name;
      //Here it is checking to the loggedIn user
      if (id != this.UserID) {
        (<any>$('#sendmsgmodel')).modal('show');
      } else {
        (<any>$('#messagenotification')).modal('show');
      }
      e.preventDefault();
      e.stopPropagation();

    }
  }

  //Method to send the message to the user
  sendMessage(senderid, receiverid, usertextmsg) {

    let value, content: any = {}, msgcontainer;

    let msgtext_new = this.urlify(usertextmsg.trim());

    content.MessageText = msgtext_new;
    content.SenderID = senderid;
    content.ReceiverID = receiverid;

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Message is being sent...';

    if (usertextmsg) {
      
      return this.http
      .post(`${environment.domainApi}/I2BMessages/InsertMessages`, content).subscribe(res=>{
        this.model.usertextmsg = "";
        if (res[0]['ResponseStatus'] == 'Success') {

          //hiding loader after login
          this.appcmp.showLoader = false;
          this.appcmp.loadermessage = 'Please wait...';
          //this._notificationservice.success("Message has been sent successfully.");

        }
      });
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
