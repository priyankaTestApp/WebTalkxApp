import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgModel, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
//import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import * as Record from 'videojs-record/dist/videojs.record.js';

import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-RecordingRequest',
  templateUrl: './RecordingRequest.component.html',
  styleUrls: ['./RecordingRequest.component.css']
})

export class RecordingRequestComponent implements OnInit {
 // @ViewChild('wizard') public wizardRef;
 @ViewChild('wizard') wizardRef: any;

//  @ViewChild(WizardComponent)
//  public wizard: WizardComponent;

canExitForm :boolean;

isValid=true;
@ViewChild('rDetails') public recordingDetails : NgForm;
  @ViewChild('ManualBlock', { static: false }) manual_div: ElementRef;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>; //BY sp
  
  title: string;
  RecordingTypeValue: string = 'Video';  
  headertext: string = 'Recording Request';  
  SavedQuestionList: any = {};
  form: FormGroup;
  model: any = {};
  finalizeSelectedQu: any = [];
  
  questionList;
  question_length: number = 0;
  IsRecordingStarted: boolean = false;
  IsRecordingCanceled: boolean = false;

  max_fields = 10; //Maximum allowed input fields 
  LoginUserID: number;
  UserID: number;;
  
  RefRecordingID: number;
  
  checkedListQuestion: any = [];
  prev_type:string;
  favouriteQuestion: [];
  
  reviewerteamlist:any = [];
  grouplist:any = [];

  recordingtype:string;
  q_index:number = 1;
  // index to create unique ID for component
  idx = 'clip1';
  public preview = null;
  private config: any;
  private player: any; 
  private plugin: any;
  record_header:string = 'Record Video';
  TotalTime: any;
  AnswerLimitVal: any;
  recordinglimit_list:any = [];
  submissionlimit_list:any = [];
  candidatedoc:string;
  stepCount:number = 0;
  step_one:boolean = true;
  step_two:boolean = true;
  step_three:boolean = true;
  step_four:boolean = true;
  step_five:boolean = true;
  isdocumentUpload: boolean = false;
  iscanddocumentUpload: boolean = false;
  islogoUpload: boolean = false;
  iswelcomePageUpload: boolean = false;
  isdocTypeSelected: boolean = false;
  documentToUpload: File = null;
  logoToUpload: File = null;
  jobdescToUpload: File = null;
  candDocToUpload: File = null;
  welcomepagename:string;
  logoname:string;
  jobdescription:string;
  hiringId:number;
  webTalkxtypeId:number;
  webtalkxtype:string;
  selected_type_id:number;
  record_limitid:number;
  submission_limitid:number;
  reviewteam_id:number;
  surveyid:number;
  surveygrouplist:any = [];
  collectorId:number;
  collector_type:string;
  recordingId:number;
  updateForm:boolean = false;
  video_index:number;
  keyword = 'EmailID';
  templateName:any;
  templateQuestions : any;
  meetingname:string;
  doc_lblname:string;
  manualdata:any = [];
  video_url:string;
  alert_message:string;
  domainApi:string;
  startDateError: string;
  endDateError: string;
  reviewerId:any;
  delete_record: number;
  IsEmailExists:boolean = true;
  isActiveUser:boolean;
  erroruser:string;
  reviewer_email:string;

  FULL_DASH_ARRAY = 283;
  WARNING_THRESHOLD = 120;
  ALERT_THRESHOLD = 40;
  stopTimer = false;

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
  vid_count:number = 0;
  template_err:string;
  templatename:string;
  //@ViewChild('createquestions12') createques_btn:any;

  SampQuestion1 = [
    { "name": "Please introduce yourself and what is your relationship and history with the candidate?" },
    { "name": "How do you know the candidate?" },
    { "name": "Please describe the candidate's character, values and social behavior." },
    { "name": "What was one of the most memorable accomplishments since you have known the candidate?" },
    { "name": "Have you witnessed the candidate in any stressful situation - how did he/she react? Please provide an example." },
    { "name": "Would you trust the candidate with large sums of money, children, or fragile individuals?" },
    { "name": "If you think about the candidate, is there anything that stands out? Can you share any accomplishment or situational experience that is most remarkable?" },
    { "name": "How would you describe the candidate’s reliability and dependability?" },
    { "name": "What is your overall opinion of the subject?" },
    { "name": " What are the subject’s strengths and what are areas you feel the subject can improve?" },
  ];

  SampQuestion2 = [
    { "name": "Please introduce yourself and what is your professional relationship to the candidate and how did it begin?" },
    { "name": "How long did you work with the candidate and what positions did you both hold while your worked with the candidate?" },
    { "name": "What were the candidate’s responsibilities while working at your company and how did these responsibilities change over time?" },
    { "name": "If you had the opportunity, would you re-hire this job candidate? Why?" },
    { "name": "What are the candidate’s biggest strengths and weaknesses?" },
    { "name": "What are the candidate’s professional strengths and how were they an asset for the team and your company?" },
    { "name": "Please tell me what it’s like to work with the job candidate." },
    { "name": "What advice would you give to successfully manage the job candidate?" },
    { "name": "Is there anything else you like to share about the candidate that hasn't been asked?" },
    { "name": "What are the most challenging aspects of the role that the candidate held and the work that the candidate did at your company?" },
    { "name": "How would you describe the candidate’s reliability and dependability?" },
    { "name": "What was one of the candidate’s most memorable accomplishments while working with you?" },
    { "name": "What type of work environment do you think the candidate would be most likely to thrive in, and why?" },
    { "name": "Would you recommend this candidate?" },

  ];

  SampQuestion3 = [
    { "name": "Please introduce yourself and what is your relatioship with the candidate." },
    { "name": "How long did the candidate work for you?" },
    { "name": "What were the candidates job duties and responsibilities?" },
    { "name": "How old was the person the candidate cared for?" },
    { "name": "Were you satisfied with the candidates job performance? Why or why not?" },
    { "name": "Did you feel like you were always informed of what was going on while the candidates was caring for patients?" },
    { "name": "Were they always reachable while they were working for you?" },
    { "name": "Were they punctual, and did that continue to be the case the entire time they worked for you?" },
    { "name": "Does this person work well independently?" },
    { "name": "Did this person show initiative?" },
    { "name": "What were some areas in which they could improve?" },
    { "name": "What was your child’s or relative’s (whomever was cared for) feedback about this person?" },
    { "name": "Tell me one of the great things they used to do with your kids or loved one?" },
    { "name": "Did you get the feeling that this person was enthusiastic and happy about doing this job?" },
    { "name": " What did this person do to keep the person or people in their care active? (Talk to them, read stories, play music, go for walks, etc. This will help you get an idea of what the day-to-day activities might look like." },
    { "name": "What was your favorite thing about working with this person?" },
    { "name": "Is there anything we should know as a future potential employer of this person, either personality-wise or compensation-wise or behaviorally?" },
  ];

  SampQuestion4 = [
    { "name": "Please introduce yourself and provide some background on your relationship with the realtor?" },
    { "name": "What was the purpose of hiring a realtor, and did you make your selection?" },
    { "name": "How well did the realtor market your home? Please provide any examples that stood out." },
    { "name": "Did the realtor work alone or was a team involved. Please describe your experience in either situation." },
    { "name": "How well were you kept informed about progress? How satisfied were you with the realtor's communication?" },
    { "name": "Please describe your experience working with the realtor during the stages of listing, showing and closing?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the realtor?" },
  ];

  SampQuestion5 = [
    { "name": "Please introduce yourself and provide some background on the tenant and the property, incl length of lease agreement and type of property." },
    { "name": "How much was the monthly rent and was rent paid on time and in full?" },
    { "name": "Did the tenant take care of the property? Anything that stood out?" },
    { "name": "How did the tenant communicate with you?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the tenant?" },
    { "name": "Would you rent to this tenant again?" },
  ];

  SampQuestion6 = [
    { "name": "Please introduce yourself and provide some background on your relationship with the financial advisory, how did you get connected? How long have you been a client?" },
    { "name": "Has the advisor been very clear about explaining how he or she gets paid?" },
    { "name": "Does your advisor have discretionary authority, which allows him or her to invest, transfer or otherwise act on your money without prior consent? Or does the advisor seek your approval and understanding before initiating each and every transaction?" },
    { "name": "How would you rate the level of communication? Do you feel you are adequately educated so you can make informed decisions?" },
    { "name": "Is there anything you would change or wish you could improve in your advisory relationship." },
    { "name": "How would you rate the level of communication? Do you feel you are adequately educated so you can make informed decisions?" },
    { "name": "How satisfied have you been with the performance of the advisor?" },
    { "name": "What additional advice do you have in working with the advisor?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the advisor?" },

  ];

  SampQuestion7 = [
    { "name": "Please introduce yourself and provide some background on your relationship with contractor?" },
    { "name": "What kind of work did the contractor do for you?" },
    { "name": "How did you select the contractor and did you check credentials?" },
    { "name": " Did you have a clear idea of what the contractor was going to do?" },
    { "name": "Please describe your experience working with the contractor? How well did the contractor respond to questions or change requests and were you satisfied with the results?" },
    { "name": "How satisfied have you been with regards to staying in budget and meeting the timeline?" },
    { "name": "What additional advice do you have in working with contractor?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the contractor?" },
    { "name": "Would you hire the contractor again?" },
  ];

  SampQuestion8 = [
    { "name": "Please introduce yourself and What is your company’s past and current relationship with service provider?" },
    { "name": "When and why did you decide to contract with service provider? What was your organization hoping to achieve?" },
    { "name": "Please describe the service provider engagement with regards to project scope, team composition onshore and offshore, and roles & responsibilities." },
    { "name": "How long did it take the service provider to complete the engagement?" },
    { "name": "What were your resource requirements for the service provider engagement in terms of people assigned and related time commitment? What tasks were you responsible for completing during the engagement?" },
    { "name": "Did service provider follow a methodology and/or leverage specific accelerators, templates and best practices in support of the project?" },
    { "name": "What was the process to manage scope, time and budget during the project?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the contractor?" },
    { "name": "How did service provider maintain clear communications and effective project management during the engagement lifecycle - and what could have been done better?" },
    { "name": "Please describe your experience during go live and the subsequent support process? How well did service provider respond to help or issue requests and were you satisfied with the results?" },
    { "name": "How satisfied have you been with service provider with regards to meeting milestones, issuing change orders and changing key personal?" },
    { "name": "How well does the solution perform from a technical and functional perspective vs. your expectations?" },
    { "name": "What significant benefits have you realized since the engagement completion? What has the return on investment (ROI) been so far?" },
    { "name": "How flexible has service provider been in terms of handling challenges and conflict situations on the project? Please provide an example." },
    { "name": "Did service provider properly scope the engagement and understand your objectives, needs and preferences?" },
    { "name": "Are the actual service cost inline with what you planned for in the beginning of the engagement?" },
    { "name": "Would you hire the contractor again?" },
    { "name": "How satisfied are you with the speed of the engagement and did the total time spent meet your initial expectations?" },
    { "name": " Was the team delivering your project the same as proposed during contracting, and did the team meet your expectations in terms of skill, experience and flexibility?" },
    { "name": "What additional advice do you have in working with service provider?" },
    { "name": "If there was one thing you could have changed about service provider in the performance of the engagement, what would it be?" },
    { "name": " One a scale of 1 – 10, with 10 being the highest, how satisfied are you with service provider as your vendor?" },
  ];

  SampQuestion9 = [
    { "name": "Please introduce yourself and when and why did you decide to look for software provided by the vendor? What was your organization hoping to achieve?" },
    { "name": "What other vendor products did you consider and how did you conduct the software selection process?" },
    { "name": " Why did you decide to go with the software vendor and which modules of the vendor's software plaform  incl. software version did you choose to buy?" },
    { "name": "How long has your organization been using the software, with how many users and in which geographies?" },
    { "name": "Please describe the software implementation project with regards to implementation scope, team composition and roles & responsibilities. How long did it take to implement the system?" },
    { "name": " What were your resource requirements for the implementation (e.g. time, people, etc)? What tasks were you responsible for completing during the implementation?" },
    { "name": "How well did the vendor's implementation team understand your industry and your specific business needs?" },
    { "name": "How accurately did the vendor's implementation team translate your requirements into the solution design? How was that achieved?" },
    { "name": "How did the vendor maintain clear communications and effective project management during the implementation lifecycle? What could the vendor have done better?" },
    { "name": "Have you done any custom development or modifications, to enhance the standard functionality of the software? If yes, why and how?" },
    { "name": "How well did the vendor build and test the system? Did you experience any surprises or what could the vendor have done better?" },
    { "name": "How did the software provider team prepare your user communty from a change management and training perspective? What feedback have you gotten from your users?" },
    { "name": "Please describe your experience during go live and the subsequent support process? How well did the vendor respond to help or issue requests and were you satisfied with the results?" },
    { "name": "How satisfied have you been with the software provider with regards to: staying in budget, issuing change orders, meeting milestone and changing key personal?" },
    { "name": "How well does the system perform vs. your expectations - from a technical and functional perspective? Are there any workarounds to use that you did not know about beforehand?" },
    { "name": " How much time, resources and expertise does it take your organisation to manage the software system?" },
    { "name": "What significant benefits have you realized since implementing the system? What has the return on investment (ROI) been so far?" },
    { "name": " What would you do differently with regards to software selection, implementation or support?" },
    { "name": "What additional advice do you have in working with the software provider?" },
    { "name": "If there was one thing you could have changed about the vendor in the performance of the engagement, what would it be?" },
    { "name": "On a scale of 1 – 10, with 10 being the highest, how satisfied are you with the software provider as your vendor?" },
  ];
  
  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent, private route: ActivatedRoute) {
    //Recording request
    this.title = appcmp.title + " | Recording request";
    
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }
    
    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizefilterDialog();
    };

    //this.masterSelected = false;
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
          maxLength: 300,
          videoMimeType: "video/mp4"
        }
      }
    };
  }

  ngOnInit() {
    //console.log("aa", this.createques_btn);
    //Added below code to updatee the title
    this.titleService.setTitle(this.title);
    
    this.TotalTime = "00:00:00";

    //On page load method
    this.OnPageLoad();
    this.surveyCmp.showNavigation = true;
    this.domainApi = `${environment.domainApi}`;    
   
  }

  isUnSavedData(){
   return this.recordingDetails.dirty;
  }
  
  //method to check start date
  CheckStartDate(startDate) {
    let endDate;
    endDate = this.model.EndDate;
    if (startDate > endDate) {
      this.startDateError = 'Start date should be less than from End date.'
      this.endDateError = '';
    } else {
      this.endDateError = '';
      this.startDateError = '';
    }
  }


  CheckEndDate(endDate) {
    let startDate;
    startDate = this.model.StartDate;
    if ( endDate < startDate) {
      this.endDateError = 'End date should be greater than from Start date.'
      this.startDateError = '';
    } else {
      this.startDateError = '';
      this.endDateError = '';
    }
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

  
  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e){
    // do something when input is focused
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.reviewerteamlist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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
        //formData.append('file', this.player.recordedData, this.player.recordedData.name);
        console.log('finished recording: ', this.player.recordedData, this.player.recordedData.name);
        let q_index = localStorage.getItem("QuestionIndex");
                
        let usercode = 'request_'+this.recordingId + '_' + q_index;
        var ext =  this.player.recordedData.name.split('.').pop();
        //let file_name = usercode +'.'+ ext;
        let file_name = usercode +'.mp4';
        //formData.append('file', this.player.recordedData, file_name);
        formData.append('video-blob', this.player.recordedData);
        formData.append('RefRecordingID', String(this.recordingId));
        formData.append('questionName', String(q_index));
        formData.append('FileName', file_name);
        
        let ques_index = q_index;

        console.log('Player: ', this.player, file_name);
        let status_elms = document.getElementsByClassName('status_'+ques_index)[0];
        if(status_elms) status_elms.innerHTML = 'Uploading...';
                                
        //return false;
        return this.http
          //.post(`${environment.api}upload`, formData).subscribe(res=>{
          .post(`${environment.domainApi}FinalSubmission/PostRecordedAudioVideoInDir`, formData).subscribe(res=>{
            
            let replay_elm = document.getElementsByClassName('replay_'+ques_index)[0];
            if(replay_elm) {
              replay_elm.removeAttribute('disabled');
              replay_elm.setAttribute('extension', ext);
            }
            let removeRecord = document.getElementsByClassName('removeRecord_' + ques_index)[0];
            if (removeRecord) removeRecord.removeAttribute('disabled');

            let status_elm = document.getElementsByClassName('status_'+ques_index)[0];
            if(status_elm) status_elm.innerHTML = 'Recorded';
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

  /*ngDoCheck() {
    console.log('I am from ngAfterViewChecked() and my order::::' + this.player);
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
      console.log('device is ready! here');
    });
  }*/

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
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

  //Method to enable the template question section
  enableBtnAndCont(target, createquesbtn, templatequesbtn, create_question_cont, template_question_cont) {
    if(target.classList.contains('btn-primary')) return false;
        
    if(createquesbtn && createquesbtn.classList.contains('btn-primary')){
      createquesbtn.classList.remove('btn-primary');
      
      if(create_question_cont && !create_question_cont.classList.contains('-hidden')){
        create_question_cont.className += ' -hidden';
      }
    } else if(createquesbtn && !createquesbtn.classList.contains('btn-primary')){
      createquesbtn.className += ' btn-primary';
      
      if(create_question_cont && create_question_cont.classList.contains('-hidden')){
        create_question_cont.classList.remove('-hidden');
      }

    }

    if(templatequesbtn && !templatequesbtn.classList.contains('btn-primary')){
      templatequesbtn.className += ' btn-primary';

      if(template_question_cont && template_question_cont.classList.contains('-hidden')){
        template_question_cont.classList.remove('-hidden');
      }

      //Now getting template name
      this.getTemplateName();

    } else if(templatequesbtn && templatequesbtn.classList.contains('btn-primary')){
      templatequesbtn.classList.remove('btn-primary');

      if(template_question_cont && !template_question_cont.classList.contains('-hidden')){
        template_question_cont.className += ' -hidden';
      }

    }
  }

  //Method to select the webtalkx type
  selectWebtalkxType(element, type) {
    let webtalkx_type = document.getElementsByClassName('webtalkx_type');
    
    if(webtalkx_type) {
      for(let i = 0; i < webtalkx_type.length; i++){
        if(webtalkx_type[i] && webtalkx_type[i].classList.contains('active-block')) {
          webtalkx_type[i].classList.remove('active-block');
          webtalkx_type[i].classList.remove('bg-blue');
        }
      }
    }

    //if selected block is not equal to the previous selected block then reset everything
    if(this.prev_type != type) {
      this.model.HireRecording = null;
      this.model.ReferenceRecording = null;
      this.model.SurveyGroupRecording = null;
      this.model.GeneralRecording = null;

      //If group or project created on second step but we moved back and selected the different block then reset and allow to create new or select existing from dropdown
      this.surveyid = null;
      this.hiringId = null;
      this.step_two = true;
      this.step_one = true;
    }
    
    if(element && !element.classList.contains('active-block')) element.className += ' active-block bg-blue';

    this.prev_type = type;
    this.webtalkxtype = type;

    if(type == 'Compliance') {
      this.selected_type_id = 1;
      this.meetingname = 'Compliance';
      this.doc_lblname = 'Upload Job Description';
    }
    if(type == 'Employee Survey') {
      this.selected_type_id = 2;
      this.meetingname = 'Employee Survey';
    }
    if(type == 'Hiring') {
      this.selected_type_id = 3;
      this.meetingname = 'Hiring';
      this.doc_lblname = 'Upload Job Description';
    }
    if(type == 'Market Research') {
      this.selected_type_id = 4;
      this.meetingname = 'Market Research';
      //this.doc_lblname = 'Upload Research Briefing Document'
    }
    if(type == 'Reference') {
      this.selected_type_id = 5;
      this.meetingname = 'Reference';
      this.doc_lblname = 'Upload Reference Case Study Document';
    }
    
    if(type == 'Security') {
      this.selected_type_id = 6;
      this.meetingname = 'Security';
      this.doc_lblname = 'Upload Security Briefing Document'
    }
    if(type == 'Vendor Management') {
      this.selected_type_id = 7;
      this.meetingname = 'Vendor Management';
      this.doc_lblname = 'Upload Vendor Management Description';
    }
   
    if(type == 'Offline Meeting') {
      this.selected_type_id = 8;
      this.meetingname = 'Offline Meeting';
      this.doc_lblname = 'Upload Meeting Briefing Document'
    }

    //Now get the group or project list
    this.getGroupProjectList(type);

    //Method to select the recording type
    this.selectRecordingType(type);

  }

  //Method to select the recording type
  selectRecordingType(record_type:string){
    this.recordingtype = record_type;
    
    //Now to get the reviewer team list
    this.getReviewerTeamList();
    
    //Now get the submission limit list
    this.getSubmissionList();

    let mul_part_type = document.getElementById('ParticipantType2');
    let single_part_type = document.getElementById('ParticipantType1');

    if(record_type == 'Group Recording'){
      
      if(mul_part_type) mul_part_type.removeAttribute('disabled');

      //Now to get the reviewer team list
      /*this.getReviewerTeamList();
      
      //Now get the submission limit list
      this.getSubmissionList();
      
      //Now get the submission limit list
      this.getRecordingList();*/
    } else {
      if(mul_part_type) mul_part_type.setAttribute('disabled', 'true');

      if(this.webtalkxtype == 'Employee Survey' || this.webtalkxtype == 'Market Research') {
        if(single_part_type) single_part_type.setAttribute('disabled', 'true');
        if(mul_part_type) mul_part_type.removeAttribute('disabled');
      } else {
        if(mul_part_type) mul_part_type.setAttribute('disabled', 'true');
        if(single_part_type) single_part_type.removeAttribute('disabled');
        this.model.ParticipantType = 'Single Participant';
      }
      
    }
    
  }

  //Method to select group survey
  selectSurveyRecordingType(record_type:string){
    this.recordingtype = "Group Survey";

  }

  //Method to select collector
  selectCollector(target, name) {
    this.collector_type = name;
    let collector_container = document.querySelectorAll('.collector-content-container');

    if(collector_container.length > 0) {
      for(let i = 0; i < collector_container.length; i++){
        if(collector_container[i] && collector_container[i].classList.contains('active-block')) {
          collector_container[i].classList.remove('active-block');
          collector_container[i].classList.remove('bg-blue');
        }
      }
    }
    if(target && !target.classList.contains('active-block')) target.className += ' active-block bg-blue';

    if(name){
      let weblink_cont = document.getElementsByClassName('weblink_cont')[0];
      let socialmedia_cont = document.getElementsByClassName('socialmedia_cont')[0];
      let manualentry_cont = document.getElementsByClassName('manualentry_cont')[0];
      let api_cont = document.getElementsByClassName('api_cont')[0];

      if(name.trim() == 'Weblink') {
        if(weblink_cont && weblink_cont.classList.contains('-hidden')) weblink_cont.classList.remove('-hidden');
        if(socialmedia_cont && !socialmedia_cont.classList.contains('-hidden')) socialmedia_cont.className += ' -hidden';
        if(manualentry_cont && !manualentry_cont.classList.contains('-hidden')) manualentry_cont.className += ' -hidden';
        if(api_cont && !api_cont.classList.contains('-hidden')) api_cont.className += ' -hidden';
      
      } else if(name.trim() == 'Social') {
        if(weblink_cont && !weblink_cont.classList.contains('-hidden')) weblink_cont.className += ' -hidden';
        if(socialmedia_cont && socialmedia_cont.classList.contains('-hidden')) socialmedia_cont.classList.remove('-hidden');
        if(manualentry_cont && !manualentry_cont.classList.contains('-hidden')) manualentry_cont.className += ' -hidden';
        if(api_cont && !api_cont.classList.contains('-hidden')) api_cont.className += ' -hidden';
      
      } else if(name.trim() == 'Manual') {
        if(weblink_cont && !weblink_cont.classList.contains('-hidden')) weblink_cont.className += ' -hidden';
        if(manualentry_cont && manualentry_cont.classList.contains('-hidden')) manualentry_cont.classList.remove('-hidden');
        if(socialmedia_cont && !socialmedia_cont.classList.contains('-hidden')) socialmedia_cont.className += ' -hidden';
        if(api_cont && !api_cont.classList.contains('-hidden')) api_cont.className += ' -hidden';
      
      } else if(name.trim() == 'API') {
        if(weblink_cont && !weblink_cont.classList.contains('-hidden')) weblink_cont.className += ' -hidden';
        if(manualentry_cont && !manualentry_cont.classList.contains('-hidden')) manualentry_cont.className += ' -hidden';
        if(socialmedia_cont && !socialmedia_cont.classList.contains('-hidden')) socialmedia_cont.className += ' -hidden';
        if(api_cont && api_cont.classList.contains('-hidden')) api_cont.classList.remove('-hidden');
      }
       
    }
  }

  //Method to execute on page load
  OnPageLoad() {
    //this.model.RecordingType = null;
    this.model.ReplayConsent = null;
    this.model.QuestionnaireCategory = null;
    this.model.ExistingGroup = null;
    this.model.RecordingLimit = null;
    this.model.ReviewTeam = null;
    this.model.AnswerLimit = null;
    this.model.SubmissionLimit = null;
    this.model.ReviewTeam = null;
    this.model.ParticipantType = 'Single Participant';

    let fullname = localStorage.getItem('LoginFullName');

    this.model.Manager = fullname;
    
    //this.model.SurveyGroupRecording = 'Group Recording';
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    this.route.params.subscribe(routeParams => {
      //console.log('routeParams 1', routeParams);
      //console.log('UserID', routeParams.id);
      if (routeParams && routeParams.id) {
        //localStorage.setItem('RefRecordingID', routeParams.id);
        let rid = routeParams.id;

        this.RefRecordingID = rid;

        //Now getting recording details
        //if (this.RefRecordingID) this.getRecordingDetails(this.RefRecordingID);
      }
    });
    
    //Method to set the dialog height as per the window height
    this.resizefilterDialog();

    //Method to get the my question list
    if (this.RefRecordingID) this.GetMyQuestions(this.RefRecordingID);

    //Method to get the recording list
    this.GetMySavedQuestionsByUser()

    //Now create 3 text box for question
    this.createQuestionTextBox();

  }

  //Method to create only 3 question text box
  createQuestionTextBox() {
    //It will create only if no ref recording id available else not
    if (!this.RefRecordingID) {
      setTimeout(function () {
        // let add_fields = document.getElementsByClassName('add_fields')[0];
        // if (add_fields) {
        //   (add_fields as HTMLButtonElement).click();
        //   (add_fields as HTMLButtonElement).click();
        // }
        var addNewQuestions = document.getElementsByClassName('addNewQuestions')[0];

        if(addNewQuestions) {
          (addNewQuestions as HTMLButtonElement).click();
          (addNewQuestions as HTMLButtonElement).click();
          (addNewQuestions as HTMLButtonElement).click();
        }
      }, 500);
    }
  }

  
  //Method to rerecord question
  //onReRecordQuestion(QuestionID, index) {
    
    //Method to show active question
    //this.showActiveQuestion(index);

    //Method to switch the video element
    //this.switchVideoElement();

    //Now updating the wizard to be an active
    //this.moveWizardQuestion(index);

    /*let jumb_btn;
    jumb_btn = document.getElementsByClassName('jumb_btn_' + index)[0];
    console.log("jumb_btn", jumb_btn);*/
    //if (jumb_btn) jumb_btn.click();
    /*setTimeout(function () {
      WizardHandler.wizard().goTo("Q" + index);
    }, 1000);*/

  //}
  
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
          }
          if (navQue && !navQue.classList.contains('active_data')) {
            //console.log("aw_wizard_elm", aw_wizard_elm);
            navQue.className += ' active_data';
          }
        }

      }
    }
  }

  // Method for get all recording details by ID
  /*getRecordingDetails(ids: number) {

    let recObj: any = {};
    recObj.RefRecordingID = ids;
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Please wait, fetching recording details...';
    
    return this.http
    .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestByID`, recObj).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {
        this.model = {
          Instructions: res[0]['Instructions'],
          ReplayConsent: (res[0]['ReplayConsent'] == 'Platform') ? true : false,
          GiverFirstName: res[0]['GiverFirstName'],
          GiverSecondName: res[0]['GiverSecondName'],
          GiverEmailID: res[0]['GiverEmailID'],
          GiverLinkedIn: res[0]['GiverLinkedIn'],
          RecordingTitle: res[0]['RecordingTitle'],
          Purpose: res[0]['Purpose'],
          RelationShipType: res[0]['RelationShipType'],
          WorkTogetherAt: res[0]['WorkTogetherAt'],
          WorkStartDate: res[0]['WorkStartDate'],
          WorkEndDate: res[0]['WorkEndDate'],
          GiverJobTitle: res[0]['GiverJobTitle'],
          OwnJobTitle: res[0]['OwnJobTitle'],
          QuestionnaireCategory: res[0]['QuestionnaireCategory'],
          IsDraft: res[0]['IsDraft'],
          Title: res[0]['Title']
        }

        if (res[0]['GiverLinkedIn'] && (res[0]['GiverLinkedIn'].indexOf('https') == -1 || res[0]['GiverLinkedIn'].indexOf('http') == -1)) {
          this.model.GiverLinkedIn = 'https://' + res[0]['GiverLinkedIn'];
        }

        //this.savebtn = 'Update Draft';
        //this.IsUpdate = true;
        //hiding loader after login
        this.appcmp.showLoader = false;

        localStorage.removeItem('RefRecordingID');
      }
    });
  }*/

  onSubmit(form: NgModel) {
    if(form && form.value) {
      this.updateForm = true;
console.log ('This is a main recording form-----',form)
     return false;
      this.insertAndUpdateFormData(form, "Y");
    }
  }

  //Method to insert and update the recording details
  insertAndUpdateFormData(form, mode){
    
    if (form && form.value) {
      let formValObj:any = {};
                        
      formValObj.WebTalkxTypeID = this.selected_type_id || null;
      formValObj.ProjectName = form.value.ProjectName || null;
      formValObj.MeetingName = form.value.MeetingName || null;
      formValObj.JobDescription = this.jobdescription || form.value.descriptionfile || null;
      formValObj.StartDate = form.value.StartDate || "2021-01-01" || null;
      formValObj.EndDate = form.value.EndDate || "2021-02-02" || null;
      formValObj.Organisation = form.value.Organization || null;
      formValObj.Manager = form.value.Manager || null;
      formValObj.ReviewTeamID = this.reviewteam_id || form.value.ReviewTeam || null;
      formValObj.WelcomeMessage = form.value.WelcomeMessage || null;
      formValObj.Description = form.value.Description || null;
      formValObj.Documents = this.candidatedoc || form.value.candidatedocument || null;
      formValObj.KeepSurveyAnonymous = form.value.IsSurveyAnonymous || null;
      formValObj.SubmissionLimitID = form.value.SubmissionLimit || null;
      formValObj.CustomWelcomePage = this.welcomepagename || form.value.CustomWelcome || null;
      formValObj.UploadLogo = this.logoname || form.value.UploadLogo || null;
      formValObj.IntroVideo = form.value.IsIntroMessage || null;
      formValObj.AuthorID = this.UserID;
      formValObj.WebTalkxRecordingType = this.recordingtype;
      formValObj.ParticipantType = form.value.ParticipantType;
      formValObj.RPAEnable = form.value.IsRPAEnable;
      formValObj.SkipEnable = form.value.IsSkipQuestion;
      formValObj.GroupRecordingID = 0;         
      
      if(mode == 'Y' && this.recordingId) {

        formValObj.ID = this.recordingId;
        this.appcmp.showLoader = true;

        if(this.updateForm) {
          formValObj.FinalStatus = 'Open';
          this.appcmp.loadermessage = 'Please wait, recording request is being send...';
        }
                
        //console.log("formn", form.value);
        let formObj:any = {}, participant;
        formObj = form.value;
        participant = form.value.ParticipantType;
        return false;
        return this.http
        .put(`${environment.domainStageApi}FinalSubmission/UpdateFinalSubmissionDetails`, formValObj).subscribe(res=>{
            let data = Object.keys(res).length;
            if (data && res[0]['ResponseStatus'] == 'Success') {
              //this.step_one = false;
                          
              //Now if update form is true means final submission
              if(this.updateForm){
                this.updateForm = false;
              
                //Method to insert the questions
                //this.InsertRecordingQuestion(this.recordingId);

                //Method to sent invitation to the selected reviewer
                this.sentInvitaionToReviewer()
                
                //call to create the giver
                let surObj:any = {};
                /*if(participant == 'Multiple Participant') this.giverCreation(surObj, this.recordingId, participant);
                else if (participant == 'Single Participant') this.giverCreation(formObj, this.recordingId, participant);*/
                if(formObj.ParticipantType == 'Multiple Participant') this.insertParticipant(surObj, this.recordingId, participant);
                else if (formObj.ParticipantType == 'Single Participant') this.insertParticipant(formObj, this.recordingId, participant);
                              
                if(this.iscanddocumentUpload) this.uploadFile(this.candDocToUpload);
                if(this.isdocumentUpload) this.uploadFile(this.jobdescToUpload);

                if(this.islogoUpload) this.uploadFile(this.logoToUpload);
                if(this.iswelcomePageUpload) this.uploadFile(this.documentToUpload);
              }
           }
        });
      } else {
                
        //formValObj.FinalStatus = 'Draft';
        formValObj.FinalStatus = 'Saved Draft';
        
        //hiding loader after login
        //this.appcmp.showLoader = false;
        //this.appcmp.showLoader = true;
        //this.appcmp.loadermessage = 'Please wait, recording request is being saved...';
        //console.log("formn", form.value);
return false
        return this.http
          .post(`${environment.domainStageApi}FinalSubmission/InsertFinalSubmissionDetails`, formValObj).subscribe(res=>{
            let data = Object.keys(res).length;
            if (data && res[0]['ResponseStatus'] == 'Success') {
            //this.step_one = false;
            this.recordingId = res[0]['ID'];
          }
        });
      }
    }
  }

  //Method to sent invitation to the selected reviewer
  sentInvitaionToReviewer() {
    let reviewer = this.reviewerId;
    let title = this.model.ProjectName || this.model.MeetingName;
    let msg = this.model.WelcomeMessage || null;
    
    if(reviewer && reviewer.length) {
      for(let i = 0; i < reviewer.length; i++) {

        let data = {
          AssignedByID: this.UserID,
          AssignedTitle: title,
          AssignedToID: reviewer[i],
          RefRecordingID: this.recordingId,
          SentMessage: msg
        };
        //method to assign the request
        this.assignRequest(data)
        
      }
    }
  }

  //method to assign the request
  assignRequest(data){

    console.log("d", data);
    //return false;
    
    return this.http
    .post(`${environment.domainStageApi}/I2BRecordingRequest/AssignedRequestToReviewer`, data).subscribe(res => {
      let data = Object.keys(res).length;
       if (data && res[0]['ResponseStatus'] == 'Success') {
        
       }
    });
  }

  //method to save the giver
  giverCreation(giverObj, length) {
    var len = length, refRequestId = this.recordingId;

    const giverData = {
      FirstName: giverObj.FirstName,
      LastName: giverObj.LastName,
      EmailID: giverObj.EmailID,
      LinkedIn: giverObj.LinkedIn || null,
      UserID: giverObj.AuthorID,
      RefRecordingID: giverObj.RefRecordingID || null
    }

    var email = giverObj.EmailID;

    //Method to insert the questions
    this.InsertRecordingQuestion(this.recordingId, email);

    return this.http
    .post(`${environment.domainApi}I2B_Users/InsertGiverCreation`, giverData).subscribe(res=>{
      
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        
        //Now redirect on request by me page
        //this.router.navigateByUrl('/I2BApplication/RequestsByMe');
        
        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.success("Recording Request has been saved.");
      } else {

        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.error(GlobalVariable.TechnicalError);
      }
    });
          
    /*return this.http
    .post(`${environment.domainApi}ParticipantInfo/InsertParticipantInfo`, participantData).subscribe(res=>{
      
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          let ParticipantLength = localStorage.getItem('ParticipantLength');

          if(ParticipantLength && (Number(ParticipantLength)-1) == len) {
            //Now redirect on request by me page
            this.router.navigateByUrl('/I2BApplication/RequestsByMe');
            
            //hiding loader after started
            this.appcmp.showLoader = false;
          }

          //this._notificationservice.success("Recording Request has been saved.");
        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.error(GlobalVariable.TechnicalError);
        }
    });*/
    
    //this.appcmp.showLoader = true;
    /*if(participant == 'Multiple Participant') { 
      var lastname_row = document.getElementsByClassName('lastname_row');
      var firstname_row = document.getElementsByClassName('firstname_row');
      var phonenumber_row = document.getElementsByClassName('phonenumber_row');
      var linkedin_row = document.getElementsByClassName('linkedin_row');
      var email_row = document.getElementsByClassName('email_row');
      var maxlength = email_row.length, looplength:number;
          
      if (firstname_row.length > 0) {
        for (let j = 0; j < firstname_row.length; j++) {
          let firstname, lastname, linkedin, phonenumber, email;

          if (firstname_row[j] || lastname_row[j] || linkedin_row[j] || email_row[j]) {
            
            firstname = (firstname_row[j] as HTMLInputElement).value;
            lastname = (lastname_row[j] as HTMLInputElement).value;
            linkedin = (linkedin_row[j] as HTMLInputElement).value;
            phonenumber = (phonenumber_row[j] as HTMLInputElement).value;
            email = (email_row[j] as HTMLInputElement).value;
            
            if(firstname_row) {
              const giverData = {
                FirstName: firstname || null,
                LastName: lastname || null,
                EmailID: email || null,
                LinkedIn: linkedin || null,
                VendorID: this.UserID,
                RefRecordingID: refRequestId || null
              }
              console.log("giverData", giverData);
              looplength = j;
                                 
              return this.http
              .post(`${environment.domainApi}I2B_Users/InsertGiverCreation`, giverData).subscribe(res=>{
                if(maxlength == looplength) {
                  let data = Object.keys(res).length;
                  if (data && res[0]['ResponseStatus'] == 'Success') {
                    
                    //Now redirect on request by me page
                    this.router.navigateByUrl('/I2BApplication/RequestsByMe');
                    
                    //hiding loader after started
                    this.appcmp.showLoader = false;

                    //this._notificationservice.success("Recording Request has been saved.");
                  } else {

                    //hiding loader after started
                    this.appcmp.showLoader = false;

                    //this._notificationservice.error(GlobalVariable.TechnicalError);
                  }
                }
              });
            }
          }
        }
      }
    } else if (participant == 'Single Participant') {
      
      const giverData = {
        FirstName: giverObj.FirstName,
        LastName: giverObj.LastName,
        EmailID: giverObj.HiringEmailId,
        LinkedIn: giverObj.LinkedinProfileLink || null,
        VendorID: this.UserID,
        RefRecordingID: refRequestId || null
      }

      return this.http
      .post(`${environment.domainApi}I2B_Users/InsertGiverCreation`, giverData).subscribe(res=>{
        
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          
          //Now redirect on request by me page
          this.router.navigateByUrl('/I2BApplication/RequestsByMe');
          
          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.success("Recording Request has been saved.");
        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.error(GlobalVariable.TechnicalError);
        }
      });
      
    }*/
    
  }
  
  //method to save the giver
  insertParticipant(participantObj, refRequestId, participant) {

    //this.appcmp.showLoader = true;
    if(participant == 'Multiple Participant') { 
      /*var lastname_row = document.getElementsByClassName('lastname_row');
      var firstname_row = document.getElementsByClassName('firstname_row');
      var phonenumber_row = document.getElementsByClassName('phonenumber_row');
      var linkedin_row = document.getElementsByClassName('linkedin_row');
      var email_row = document.getElementsByClassName('email_row');
      var maxlength = email_row.length, looplength:number;*/
      var maxlength = this.manualdata.length, looplength:number;

      if(this.manualdata.length > 0) {
          for (let j = 0; j < this.manualdata.length; j++) {
            
            var firstname = this.manualdata[j]['FirstName'];
            var lastname = this.manualdata[j]['LastName'];
            var email = this.manualdata[j]['Email'];
            var linkedin = this.manualdata[j]['LinkedIn'];
            var phonenumber = this.manualdata[j]['PhoneNumber'];

            var participantData = {
              FirstName: firstname || null,
              LastName: lastname || null,
              EmailID: email || null,
              LinkedIn: linkedin || null,
              PhoneNumber: phonenumber || null,
              Documents:this.candidatedoc || null,
              AuthorID: this.UserID,
              RefRecordingID: this.recordingId || null
            }

            console.log("giverData", participantData);
            localStorage.setItem('ParticipantLength', String(j));
            looplength = j;
            /*return false;*/
            this.addParticipant(participantData, j);
            //Create participant as giver
            this.giverCreation(participantData, j);
          }
        }
          
      /*if (firstname_row.length > 0) {
        for (let j = 0; j < firstname_row.length; j++) {
          let firstname, lastname, linkedin, phonenumber, email;

          if (firstname_row[j] || lastname_row[j] || linkedin_row[j] || email_row[j]) {
            
            firstname = (firstname_row[j] as HTMLInputElement).value;
            lastname = (lastname_row[j] as HTMLInputElement).value;
            linkedin = (linkedin_row[j] as HTMLInputElement).value;
            phonenumber = (phonenumber_row[j] as HTMLInputElement).value;
            email = (email_row[j] as HTMLInputElement).value;
            
            if(firstname_row) {
              
              const participantData = {
                FirstName: firstname || null,
                LastName: lastname || null,
                EmailID: email || null,
                LinkedIn: linkedin || null,
                PhoneNumber: phonenumber || null,
                Documents:this.candidatedoc || null,
                AuthorID: this.UserID,
                RefRecordingID: refRequestId || null
              }

              console.log("giverData", participantData);
              looplength = j;
                                  
              return this.http
              .post(`${environment.domainApi}ParticipantInfo/InsertParticipantInfo`, participantData).subscribe(res=>{
                //if(maxlength == looplength) {
                  let data = Object.keys(res).length;
                  if (data && res[0]['ResponseStatus'] == 'Success') {
                    
                    //Now redirect on request by me page
                    this.router.navigateByUrl('/I2BApplication/RequestsByMe');
                    
                    //hiding loader after started
                    this.appcmp.showLoader = false;

                    //this._notificationservice.success("Recording Request has been saved.");
                  } else {

                    //hiding loader after started
                    this.appcmp.showLoader = false;

                    //this._notificationservice.error(GlobalVariable.TechnicalError);
                  }
                //}
              });
            }
          }
        }
      }*/
    } else if (participant == 'Single Participant') {
      
      const participantData = {
        FirstName: participantObj.FirstName,
        LastName: participantObj.LastName,
        EmailID: participantObj.EmailId,
        LinkedIn: participantObj.LinkedinProfileLink || null,
        PhoneNumber: participantObj.PhoneNumber || null,
        Documents:this.candidatedoc || participantObj.candidatedocument || null,
        AuthorID: this.UserID,
        RefRecordingID: refRequestId || null
      }
      //Create participant as giver
      var l = 0;
      this.giverCreation(participantData, 0);
        
      return this.http
      .post(`${environment.domainApi}ParticipantInfo/InsertParticipantInfo`, participantData).subscribe(res=>{
        
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          
          //Now redirect on request by me page
          this.router.navigateByUrl('/I2BApplication/RequestsByMe');
          
          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.success("Recording Request has been saved.");
        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.error(GlobalVariable.TechnicalError);
        }
      });
      
    }
    
  }

  //Method to add participants
  addParticipant(participantData, length) {
    var len = length;
          
    return this.http
    .post(`${environment.domainApi}ParticipantInfo/InsertParticipantInfo`, participantData).subscribe(res=>{
      
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          let ParticipantLength = localStorage.getItem('ParticipantLength');

          if(ParticipantLength && (Number(ParticipantLength)-1) == len) {
            //Now redirect on request by me page
            this.router.navigateByUrl('/I2BApplication/RequestsByMe');
            
            //hiding loader after started
            this.appcmp.showLoader = false;
          }

          //this._notificationservice.success("Recording Request has been saved.");
        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.error(GlobalVariable.TechnicalError);
        }
    });
  }
  
  //method to save the giver
  uploadFile(filedata) {
    //this.appcmp.showLoader = true;
    const formData: FormData = new FormData();
    if (filedata) {
      var finename = (filedata && filedata.name) ? filedata.name.replace(/ /g,'') : null;
      //formData.append('file', filedata, filedata.name);

      //formData.append('file', filedata, finename);
      formData.append('UserDocuments',filedata, finename);
          
      return this.http
      //.post(`https://sara.webtalkx.com/api/upload1`, formData).subscribe(res=>{
      .post(`${environment.domainApi}FinalSubmission/UploadUserDocuments`, formData).subscribe(res=>{
        /*
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          
          //Now redirect on request by me page
          this.router.navigateByUrl('/I2BApplication/RequestsByMe');
          
          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.success("Recording Request has been saved.");
        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

          //this._notificationservice.error(GlobalVariable.TechnicalError);
        }*/
      });
    }
  }


  //Method to identify the selcted tab
  enableTab(tab, tabcontent) {
    let target, t_attr;

    if (tab) t_attr = tab.getAttribute('href');

    if (t_attr == '#AllQuestions') {


    } else if (t_attr == '#FavQuestions') {
      this.GetMySavedQuestionsByUser(true);

    }
  }

  //Method to update the request as draft
  saveRequestAsDraft(refRequestId) {

    let reqObj: any = {};
    reqObj.RefRecordingID = refRequestId;
    //reqObj.RecordingStatus = 'Draft';
    reqObj.RecordingStatus = 'Saved Draft';
    
    return this.http
    .put(`${environment.domainApi}I2BRecordingRequest/UpdateRecordingStatus`, reqObj).subscribe(res=>{
      
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        //this.router.navigateByUrl('/I2BApplication/OpenReferenceRequests');
        this.router.navigateByUrl('/I2BApplication/RequestsByMe');

        //hiding loader after started
        this.appcmp.showLoader = false;

        //this._notificationservice.success("Recording Request has been saved.");
      } else {

        //hiding loader after started
        this.appcmp.showLoader = false;

        //this._notificationservice.error(GlobalVariable.TechnicalError);
      }
    });

  }

  //Method to insert the question
  InsertRecordingQuestion(id, email) {
    let emailid = email;
    if (id) {

      let ques_Obj: any = {}, i = 0;
      var selected_question = document.querySelectorAll('.selected_question');
      var answer_limit = document.querySelectorAll('.AnswerLimit');
      
      //if (Object.keys(this.checkedListBookmark).length > 0) {
      //for (let Bookmark of this.checkedListBookmark) {
      if (selected_question.length > 0) {
        for (let j = 0; j < selected_question.length; j++) {
          let value, q_id, answer_limit_val;

          if (selected_question[j]) {
            //if (selected_question[j].nodeName == 'TEXTAREA' && (selected_question[j] as HTMLTextAreaElement).value && (selected_question[j] as HTMLTextAreaElement).value.trim()) {
            let isDisabled = (selected_question[j] as HTMLTextAreaElement).hasAttribute('disabled');  
            if (selected_question[j].nodeName == 'TEXTAREA' && ((selected_question[j] as HTMLTextAreaElement).value || isDisabled)) {
              if(answer_limit && answer_limit[j]) {
                answer_limit_val = (answer_limit[j] as HTMLSelectElement).value;
              }
              /*if (sort_question[i] && (sort_question[i] as HTMLElement).innerText && (sort_question[i] as HTMLElement).innerText.trim()) {
                value = (sort_question[i] as HTMLElement).innerText.trim();*/
              //console.log((selected_question[j] as HTMLTextAreaElement).value);

              //console.log(a.hasAttribute('disabled'));
              if(isDisabled) {
                value = j + 1;
              } else {
                value = (selected_question[j] as HTMLTextAreaElement).value;
              }
              
              q_id = selected_question[j].getAttribute('question_id');

              ques_Obj.RefRecordingID = id;
              ques_Obj.QuestionText = value;
              ques_Obj.QuestionOrder = j + 1;
              ques_Obj.AnswerLimit = answer_limit_val ? answer_limit_val.trim() : '';
              ques_Obj.RecordQuestion = isDisabled;
              ques_Obj.EmailID = emailid || null;

              if (q_id) {
                ques_Obj.RecordingQuestionID = q_id;
                //Method to update the question
                this.updateOldQuestion(ques_Obj);
              } else {
                //console.log("ques_Obj", ques_Obj);
                //Method to insert the question
                this.insertNewQuestion(ques_Obj);
              }

            }
          }

        }
      }

    }
  }

  //Method to insert the question
  insertNewQuestion(ques_Obj) {
    
    return this.http
    .post(`${environment.domainApi}I2BRecordingRequest/InsertRecordingQuestions`, ques_Obj).subscribe(res=>{
      
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {

        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.success("Recording question has been inserted.");
      } else {

        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.error(GlobalVariable.TechnicalError);
      }
    });
  }

  //Method to update the old question
  updateOldQuestion(ques_Obj) {
    
    return this.http
    .put(`${environment.domainApi}I2BRecordingRequest/UpdateRecordingRequestQuestions`, ques_Obj).subscribe(res=>{
      
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {

        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.success("Recording question has been inserted.");
      } else {

        //hiding loader after started
        //this.appcmp.showLoader = false;

        //this._notificationservice.error(GlobalVariable.TechnicalError);
      }
    });
  }

  //Method to get the group or project list
  getGroupProjectList(type) {

    let obj:any = {};
    obj.WebtalkxType = type;
    obj.UserId = this.UserID;

    if(type == 'Survey') {
      return this.http
      .get(`${environment.domainStageApi}Survey/GetSurveyDetailsByType?WebTalkxType=`+type).subscribe(res=>{
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          this.surveygrouplist = res;
        } else {
          this.surveygrouplist = [];
          this.model.ExistingGroup = null;
        }
      });
    } else {
      
      return this.http
      .get(`${environment.domainStageApi}Hiring/GetProjectNames?WebTalkxType=`+type).subscribe(res=>{
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          this.grouplist = res;
        } else {
          this.grouplist = [];
          this.model.ExistingGroup = null;
        }
      });
    }

  }
  
  //Method to get the reviewer team list
  getReviewerTeamList() {
    let userObj:any = {};
    userObj.UserID = this.UserID;

    return this.http
    //.get(`${environment.domainStageApi}ReviewTeam/GetReviewTeamMembers?AuthorID=`+ this.UserID).subscribe(res=>{
      .post(`${environment.domainStageApi}I2B_Users/GetAllReviewer`, userObj).subscribe(res=>{
      

      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        this.reviewerteamlist = res;
        
      } else {
        this.reviewerteamlist = [];
      }
    });
  }
  
  //Method to open popup to add new review team member
  openReviewPopup(form) {
    this.erroruser = "";
    //this.rewerUserform = form;
    form.reset();

    (<any>$('#AddTeamPopup')).modal('show');
  }

  //Method to add the new team member
  /*postReviewTeam () {

    let reviewerdata = {
      EmailID: this.model.ReviewerEmail,
      FirstName: this.model.ReviewerFirstName,
      LastName: this.model.ReviewerLastName,
      AuthorID: this.UserID
    };
    
    return this.http
      .post(`${environment.domainStageApi}/ReviewTeam/InsertReviewTeamMember`, reviewerdata).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          
          //Now create the reviewer
          this.createReviewer(reviewerdata);

          //alert('Added Successfully!');
          this.model.ReviewerEmail = '';
          this.model.ReviewerFirstName = '';
          this.model.ReviewerLastName = '';
          //this.alert_message = 'Team member added successfully!';

          //Now update the dropdown list
          this.getReviewerTeamList();

          //(<any>$('#confirmMsgModel')).modal('show');
        }
      });
  }*/
  
  //Method to add the new team member
  createReviewer() {

    let data = {
      EmailID: this.model.ReviewerEmail || null,
      FirstName: this.model.ReviewerFirstName || null,
      LastName: this.model.ReviewerLastName || null,
      UserID: this.UserID
    };
        
    return this.http
      .post(`${environment.domainStageApi}/I2B_Users/InsertReviewerDetails`, data).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          this.model.ReviewerEmail = '';
          this.model.ReviewerFirstName = '';
          this.model.ReviewerLastName = '';
          
          //Now update the dropdown list
          this.getReviewerTeamList();  
        }
      });
  }

  //Now get the submission limit list
  getSubmissionList() {
    
    return this.http
    .get(`${environment.domainStageApi}HiringRecordingLimit/GetHiringRecordingLimit`).subscribe(res=>{
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        this.submissionlimit_list = res;
      } else {
        this.submissionlimit_list = [];
      }
    });
  }
  
  //Now get the recording limit list
  getRecordingList() {
    
    return this.http
    .get(`${environment.domainStageApi}IndividualRecordingLimit/GetIndividualRecordingLimit`).subscribe(res=>{
      let data = Object.keys(res).length;
      if (data && res[0]['ResponseStatus'] == 'Success') {
        this.recordinglimit_list = res;
      } else {
        this.recordinglimit_list = [];
      }
    });
  }

  //Method to reset the field value. only those field's value will reset on which user existing.
  HeaderOnSteps(model: any, stepcount: number, btn_name) {
        
        // if(btn_name == 'Next' && model.valid){
        // this.canExitForm = false;
        // }else if(btn_name == 'Back'){
        //   this.canExitForm = true;
        // }

    if (stepcount == 1) {
      this.headertext = 'Recording Request';
      
    } else if (stepcount == 2) {
      //Scrolling window on top at initial
      window.scroll(0, 0);
      
      if(this.prev_type == 'Hiring') this.headertext = 'Hiring';
      else if(this.prev_type == 'Reference') this.headertext = 'Reference';
      else if(this.prev_type == 'Offline') this.headertext = 'Offline';
      else if(this.prev_type == 'Compliance') this.headertext = 'Compliance';
      //else if(this.prev_type == 'Market Research') this.headertext = 'Market Research';
      else if(this.prev_type == 'Security') this.headertext = 'Security';
      else if(this.prev_type == 'Vendor Management') this.headertext = 'Vendor Management';
      else if(this.prev_type == 'Employee Survey' || this.prev_type == 'Market Research') {
        //Now to get the reviewer team list
        this.getReviewerTeamList();
        
        //Now get the submission limit list
        this.getSubmissionList();
        
        //Now get the recording limit list
        //this.getRecordingList();

        if(this.prev_type == 'Employee Survey') this.headertext = 'Employee Survey';
        if(this.prev_type == 'Market Research') this.headertext = 'Market Research';
        this.recordingtype = "Group Survey";
        this.model.ParticipantType = 'Multiple Participant';
      }
      
      //this.stepCount
      //Now saving the first step
      if((!this.step_one && this.webTalkxtypeId && btn_name == 'Next')) {
        //this.firstStepUpdate(model);
      } else if(this.step_one) {
        //this.firstStepSave(model);
      }
      

    } else if (stepcount == 3) {
      //Scrolling window on top at initial
      window.scroll(0, 0);
      //console.log('3', this.model.ParticipantType);
      this.headertext = 'Add Participant';
      //this.model.ParticipantType = 'Single Participant';
      if (this.model.ParticipantType == 'Multiple Participant') {
        this.manual_div.nativeElement.click();
        setTimeout(() => {
          
          this.getManualBlock(this.model.ParticipantType)
          //console.log(this.manualBlock_elm.nativeElement.innerText);
        }, 1000);
      }
     

    } else if (stepcount == 4) {
      //now pause video playing
      this.pauseVideoPlay();

      //console.log('4', this.model.ParticipantType);
      //Scrolling window on top at initial
      window.scroll(0, 0);
      this.headertext = 'Add Questions';
      //this.stepCount++;
      var addNewQuestions = document.getElementById('selected_question');
      var recordQuestions = document.getElementById('RecordQuestions');


      /*if(this.stepCount == 1){
        //var addNewQuestions = document.getElementsByClassName('addNewQuestions')[0];

        //if(addNewQuestions) {
          //(addNewQuestions as HTMLButtonElement).click();
          //(addNewQuestions as HTMLButtonElement).click();
          //(addNewQuestions as HTMLButtonElement).click();
        //}
      }*/

      //Now calculate the multiple participant
      this.drawMultipleParticipant();
      

    } else if (stepcount == 5){
      //console.log('5', this.model.ParticipantType);
      //Scrolling window on top at initial
      window.scroll(0, 0);
      this.headertext = 'Welcome Message';
      //debugger 
      // if((!model.IsIntroMessage || model.IsIntroMessage == undefined) && this.vid_count == 0){
      //   let  currentStep = this.wizardRef.model.currentStepIndex;
      //   //this.wizardRef.goToStep(6);
      //   this.wizardRef.model.navigationMode.goToStep(6)
      //  // this.wizard.goToStep(currentStep + 4)
      // }else{
      //   // this.wizard.goToStep(stepcount + 2)
      //   this.wizardRef.goToStep(5);

      // }


      //Now saving the second step
      if((!this.step_two && (this.hiringId || this.surveyid) && btn_name == 'Next')) {
        this.secondStepUpdate(model);
      } else if(this.step_two) {
        this.secondStepSave(model);
      }
            
      this.stepCount++;

      //this.saveDraft = false;
      //Now darw the selected question
      this.drawSelectedQuestion();

      //Active first question list
      this.activeFirstQuestionList();
           
      //Now saving the second step
      if((!this.step_four && this.collectorId && btn_name == 'Next')) {
        //this.fourthStepUpdate(model);
      } else if(this.step_two) {
        //this.fourthStepSave(model);
      }
      
      if(this.vid_count == 1 || this.model.IsIntroMessage) {
        let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
        (video_btn as HTMLButtonElement).click();
      }

    } else if (stepcount == 6){
      //now pause video playing
      this.pauseVideoPlay();

     // console.log('6', this.model.ParticipantType);
     //Scrolling window on top at initial
      window.scroll(0, 0);
     
      //Now fetching reviewer name
      this.getReviewerEmail();

      this.model.SurveyGroupRecording = 'Group Recording';
      this.headertext = 'Summary';
    }
  }

  BackToSteps(form,stepCount,btn_name){
    this.canExitForm = true;
  }



  getManualBlock(val) {
    if (val == 'Multiple Participant') {

      this.manual_div.nativeElement.click();
    }
  }

  //Methdo to pause video playing
  pauseVideoPlay() {
    let video_elm = document.getElementsByClassName('video_replay')[0];
    if(video_elm) (video_elm as HTMLVideoElement).pause();
  }

  //Method to get the reviewer email
  getReviewerEmail() {
    let label_val = document.getElementsByClassName('ng-value-label');
    let email:any = [];
    
    if(label_val && label_val.length > 0) {
      for (let i = 0; i < label_val.length; i++) {
        let val = (label_val[i] as HTMLSpanElement).innerHTML;
        if(val) email.push(val);
      }
      this.reviewer_email = email.toString();
      
    } else {
      email= [];
      this.reviewer_email = '';
    }
    
  }

  //Method to draw multiple participant
  drawMultipleParticipant(){
    
    var lastname_row = document.getElementsByClassName('lastname_row');
    var firstname_row = document.getElementsByClassName('firstname_row');
    var phonenumber_row = document.getElementsByClassName('phonenumber_row');
    var linkedin_row = document.getElementsByClassName('linkedin_row');
    var email_row = document.getElementsByClassName('email_row');
    this.manualdata = [];
        
    if (firstname_row.length > 0) {
      for (let j = 0; j < firstname_row.length; j++) {
        let firstname, lastname, linkedin, phonenumber, email;

        if (firstname_row[j] || lastname_row[j] || linkedin_row[j] || email_row[j]) {
          
          firstname = (firstname_row[j] as HTMLInputElement).value;
          lastname = (lastname_row[j] as HTMLInputElement).value;
          linkedin = (linkedin_row[j] as HTMLInputElement).value;
          phonenumber = (phonenumber_row[j] as HTMLInputElement).value;
          email = (email_row[j] as HTMLInputElement).value;

          var dataObj:any = {};
          dataObj = {
            FirstName: firstname,
            LastName:lastname,
            LinkedIn:linkedin,
            PhoneNumber:phonenumber,
            Email:email
          }
          this.manualdata.push(dataObj);
        }
      }
      console.log("manualdata", this.manualdata);
    }
  }

  //Method to active first selected question
  activeFirstQuestionList() {
    setTimeout(function(){
      let question_elem = document.getElementsByClassName('question_elem');

      for(var i = 0; i < question_elem.length; i++) {
        //if(question_elem[0]) (question_elem[0] as HTMLElement).click();

        if(question_elem[i] && i != 0) {
          console.log(i,"i", question_elem[i]);
          question_elem[i].classList.remove('active_data');
        } else {
          console.log(i,"i2", question_elem[i]);
          (question_elem[i] as HTMLElement).click();
        }
      }
    }, 500);
    
  }

  //Method to select the group or project from dropdown
  selectGroupOrProject(e, type) {
    let target, index, targetid, val;

    target = (e && e.target) ? e.target : null;
    index = (target) ? target.selectedIndex : null;
    targetid = Number(target.options[index].id);
    val = target.value;

    console.log("aa", target, index, targetid, val);

    //getting next button to move forward after selecting value from dropdown
    let gostep_second = document.getElementsByClassName('gostep_second')[0];
    if(gostep_second) (gostep_second as HTMLButtonElement).click();
    
    // Method to get the details based on project name
    this.getProjectDetails(val, type);

  }

  //Method to select the submission limit from dropdown
  selectSubmissionLimit(e, submissionLimit) {
    let target, index, val;

    target = (e && e.target) ? e.target : null;
    index = (target) ? target.selectedIndex : null;
    this.submission_limitid = Number(target.options[index].id);
    val = target.value;
  }
  
  //Method to select the submission limit from dropdown
  selectRecordingLimit(e, recordLimit) {
    let target, index, val;

    target = (e && e.target) ? e.target : null;
    index = (target) ? target.selectedIndex : null;
    this.record_limitid = Number(target.options[index].id);
    val = target.value;
  }
  
  //Method to select the submission limit from dropdown
  selectReviewTeam(e, recordLimit) {
    let target, index, val;

    /*target = (e && e.target) ? e.target : null;
    index = (target) ? target.selectedIndex : null;
    this.reviewteam_id = Number(target.options[index].id);
    val = target.value;
    */

    target = (e && e.target) ? e.target : null;
    val = e;
    this.reviewerId = e;
    this.reviewteam_id = val.toString();

    //console.log(this.reviewteam_id, e, "tar", target);
    //debugger

  }
    
  // Method to get the details based on project name
  getProjectDetails(val, type) {

    if(type == 'Employee Survey' || type == 'Market Research') {
      
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait, fetching group or project details...';
      
      return this.http
      .get(`${environment.domainStageApi}Survey/GetSurveyDetailsByTypeAndProject?WebTalkxType=`+this.webtalkxtype+`&ProjectName=`+val).subscribe(res=>{
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          console.log("res", res);

          this.model = {
            SurveyTitle: res[0]['SurveyTitle'],
            KeepSurveyAnonymous: res[0]['IsSurveyAnonymous'],
            SurveyStartDate: res[0]['SurveyStartDate'],
            SurveyEndDate: res[0]['SurveyEndDate'],
            SurveySubmissionLimit: res[0]['SubmissionLimit'],
            WelcomeMessage: res[0]['WelcomeMessage'],
            Description: res[0]['Description'],
            IsIntroMessage: res[0]['SponsorMessageRequired'],
            UploadLogo: res[0]['UploadLogo'],
            SurveyReviewTeam: res[0]['SurveyReviewTeam'],
            CustomWelcomePage: res[0]['CustomWelcomePage'],
            IndividualRecordingLimit: res[0]['RecordingLimit']
          }
          this.logoUpload = res[0]['UploadLogo'];
          this.welcomepagename = res[0]['CustomWelcomePage'];
          this.surveyid = res[0]['SurveyID'];
                
          //hiding loader after login
          this.appcmp.showLoader = false;
          
        } else {
          
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });
    } else {
      
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait, fetching group or project details...';
      
      return this.http
      .get(`${environment.domainStageApi}Hiring/GetHiringDetailsByProjectNameAndType?WebTalkxType=`+this.webtalkxtype+`&ProjectName=`+val).subscribe(res=>{
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          console.log("res", res);

          /*this.model = {
            HiringProjectName: res[0]['ProjectName'],
            JobDescription: res[0]['JobDescription'],
            HiringStartDate: res[0]['HiringStartDate'],
            HiringEndDate: res[0]['HiringEndDate'],
            HiringOrganization: res[0]['Organisation'],
            Manager: res[0]['Manager'],
            HiringReviewTeam: res[0]['ReviewTeam'],
            WelcomeMessage: res[0]['WelcomeMessage'],
            Description: res[0]['Description'],
            HiringEmailId: res[0]['EmailID'],
            FirstName: res[0]['FirstName'],
            LastName: res[0]['LastName'],
            HiringRecordingLimit: res[0]['RecordingLimit'],
            PhoneNumber: res[0]['PhoneNumber'],
            LinkedinProfileLink: res[0]['LinkedinProfileLink'],
            Documents: res[0]['Documents'],
            IsIntroMessage: res[0]['SponsorMessageRequired']
          }*/

          this.candidatedoc = res[0]['Documents'];
          this.jobdescription = res[0]['JobDescription'];
          this.hiringId = res[0]['HiringID'];
          //debugger;
          /*this.model.HireRecording = null;
          this.model.ReferenceRecording = null;
          this.model.SurveyGroupRecording = null;
          this.model.GeneralRecording = null;*/
          
          //hiding loader after login
          this.appcmp.showLoader = false;
          
        }
      });
    }

  }
  
  // Method to save the first step
  secondStepSave(form) {

    let formval = form;
    
    //Now inserting the other details
    this.insertAndUpdateFormData(formval, "N");   
    
  }

  //Method to update the steps
  secondStepUpdate(form) {
    
    let formval = form;
    
    //Now inserting the other details
    this.insertAndUpdateFormData(formval, "Y");
    
  }
  
  //Method to select image to upload
  welcomePageUpload(e, file: FileList) {
    
    if (file) {
      this.documentToUpload = file.item(0);
      this.iswelcomePageUpload = true;
      
      this.welcomepagename = (this.documentToUpload && this.documentToUpload.name) ? this.documentToUpload.name.replace(/ /g,'') : null;
      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {

    }
      reader.readAsDataURL(this.documentToUpload);
              
    }
  }
  
  //Method to select image to upload
  logoUpload(e, file: FileList) {
        
    if (file) {
      this.logoToUpload = file.item(0);
      this.islogoUpload = true;
      
      this.logoname = (this.logoToUpload && this.logoToUpload.name) ? this.logoToUpload.name.replace(/ /g,'') : null;
      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {

    }
      reader.readAsDataURL(this.logoToUpload);
    }
  }
  
  //Method to select image to upload
  documentUpload(e, file: FileList) {
    
    if (file) {
      this.jobdescToUpload = file.item(0);
      this.isdocumentUpload = true;
      this.jobdescription = (this.jobdescToUpload && this.jobdescToUpload.name) ? this.jobdescToUpload.name.replace(/ /g,'') : null;
      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {

    }
      reader.readAsDataURL(this.jobdescToUpload);
    }
  }
  
  //Method to select image to upload
  candidateDocumentUpload(e, file: FileList) {
    
    if (file) {
      this.candDocToUpload = file.item(0);
      this.iscanddocumentUpload = true;
      this.candidatedoc = (this.candDocToUpload && this.candDocToUpload.name) ? this.candDocToUpload.name.replace(/ /g,'') : null;
      //Show image preview
      let reader = new FileReader();
      reader.onload = (event: any) => {

      }
      
      reader.readAsDataURL(this.candDocToUpload);
    }
  }


  // Clear function for multi stepss form 
  clearForm(form, stepcount: number) {
    
    if (stepcount == 1) {
      this.model.HireRecording = null;
      this.model.ReferenceRecording = null;
      this.model.SurveyGroupRecording = null;
      this.model.GeneralRecording = null;

      //If group or project created on second step but we moved back and selected the different block then reset and allow to create new or select existing from dropdown
      this.surveyid = null;
      this.hiringId = null;
      this.step_two = true;
      this.step_one = true;

    } else if (stepcount == 2) {
            
      //If group or project created on second step but we moved back and selected the different block then reset and allow to create new or select existing from dropdown
      this.surveyid = null;
      this.hiringId = null;
      this.step_two = true;
      this.step_one = true;

      this.model = {
        MeetingName: null,
        KeepSurveyAnonymous: null,
        StartDate: null,
        EndDate: null,
        SurveySubmissionLimit: null,
        WelcomeMessage: null,
        Description: null,
        IntroVideo: null,
        UploadLogo: null,
        ReviewTeam: null,
        CustomWelcomePage: null,
        IndividualRecordingLimit: null,
        ProjectName: null,
        JobDescription: null,
        Organization: null,
        Manager: null,
        EmailId: null,
        FirstName: null,
        LastName: null,
        RecordingLimit: null,
        PhoneNumber: null,
        LinkedinProfileLink: null,
        Documents: null
      }

      this.logoUpload = null;
      this.welcomepagename = null;
      this.surveyid = null;
      this.candidatedoc = null;
      this.jobdescription = null;
      this.hiringId = null;

    }
  }

  //Method to sort the list of question
  sortListQuestion() {

    if (this.finalizeSelectedQu.length > 0) this.finalizeSelectedQu = [];

    let selected_question = document.querySelectorAll('.selected_question');

    //this.startsort = true;
    if (selected_question.length > 0) {
      let value, obj, isDisabled;
      for (let i = 0; i < selected_question.length; i++) {
        /*if (selected_question[i] && (selected_question[i] as HTMLTextAreaElement).value && (selected_question[i] as HTMLTextAreaElement).value.trim()) {
          isDisabled = (selected_question[i] as HTMLTextAreaElement).hasAttribute('disabled');

          value = (selected_question[i] as HTMLTextAreaElement).value.trim();
          obj = {Value:value, IsDasbled: isDisabled};
            
          if (value || isDisabled) this.checkedListQuestion.push(obj);
          //value = (selected_question[i] as HTMLTextAreaElement).value.trim();
          //if (value) this.checkedListQuestion.push(value);
        }*/
        if (selected_question[i]) {
          isDisabled = (selected_question[i] as HTMLTextAreaElement).hasAttribute('disabled');
          if(isDisabled){
            obj = {Value:i+1, IsDisabled: isDisabled};
            
            this.finalizeSelectedQu.push(obj);
          } else if ((selected_question[i] as HTMLTextAreaElement).value && (selected_question[i] as HTMLTextAreaElement).value.trim()) {
            isDisabled = (selected_question[i] as HTMLTextAreaElement).hasAttribute('disabled');
            value = (selected_question[i] as HTMLTextAreaElement).value.trim();
            obj = {Value:value, IsDisabled: isDisabled};
            
            //if (value) this.finalizeSelectedQu.push(value);
            if (value || isDisabled) this.checkedListQuestion.push(obj);
          }
        }
      }
    }

    /*if (sort_question.length > 0) {
      let value;
      for (let i = 0; i < sort_question.length; i++) {
        if (sort_question[i] && (sort_question[i] as HTMLElement).innerText && (sort_question[i] as HTMLElement).innerText.trim()) {
          value = (sort_question[i] as HTMLElement).innerText.trim();
          if (value) this.checkedListQuestion.push(value);
        }
      }
    }*/
  }

  //Method to draw the selected question
  drawSelectedQuestion() {

    if (this.finalizeSelectedQu.length > 0) this.finalizeSelectedQu = [];

    let selected_question = document.querySelectorAll('.selected_question');
    let sort_question = document.querySelectorAll('.sort_question');

    if (this.checkedListQuestion.length > 0) {
      //if (this.checkedListQuestion.length > 0) this.checkedListQuestion = [];
      if (sort_question.length > 0) {
        let value;
        for (let i = 0; i < sort_question.length; i++) {
          if (sort_question[i] && (sort_question[i] as HTMLElement).innerText && (sort_question[i] as HTMLElement).innerText.trim()) {
            //var a = document.getElementsByClassName('question_2')[0];
            //console.log(a.hasAttribute('disabled'));
            value = (sort_question[i] as HTMLElement).innerText.trim();
            if (value) this.finalizeSelectedQu.push(value);
          }
        }
      }
      //this.finalizeSelectedQu.push(this.checkedListQuestion);
    } else {
      if (selected_question.length > 0) {
        let value, isDisabled, obj:any = {};
        this.vid_count = 0;
        for (let i = 0; i < selected_question.length; i++) {
          if (selected_question[i]) {
            isDisabled = (selected_question[i] as HTMLTextAreaElement).hasAttribute('disabled');
            if(isDisabled){
              obj = {Value:i+1, IsDisabled: isDisabled};
              this.vid_count = 1;
              
              this.finalizeSelectedQu.push(obj);
            } else if ((selected_question[i] as HTMLTextAreaElement).value && (selected_question[i] as HTMLTextAreaElement).value.trim()) {
              isDisabled = (selected_question[i] as HTMLTextAreaElement).hasAttribute('disabled');
              value = (selected_question[i] as HTMLTextAreaElement).value.trim();
              obj = {Value:value, IsDisabled: isDisabled};
              
              //if (value) this.finalizeSelectedQu.push(value);
              if (value || isDisabled) this.finalizeSelectedQu.push(obj);
            }
          }
        }
      }
    }
    console.log("finalizeSelectedQu", this.finalizeSelectedQu);
    //Now initialization the timer
    this.initTimerUI();
    /*if (sort_question.length > 0) {
      let value;
      for (let i = 0; i < sort_question.length; i++) {
        if (sort_question[i] && (sort_question[i] as HTMLElement).innerText && (sort_question[i] as HTMLElement).innerText.trim()) {
          value = (sort_question[i] as HTMLElement).innerText.trim();
          if (value) this.checkedListQuestion.push(value);
        }
      }
    }*/

  }

  //drop question method
  //onQuestionDrop(event: CdkDragDrop<string[]>) {
  //  /*moveItemInArray(this.finalizeSelectedQu, event.previousIndex, event.currentIndex);
  //  this.finalizeSelectedQu.forEach((question, index) => {
  //    question = index + 1;
  //  });*/
  //  moveItemInArray(this.checkedListQuestion, event.previousIndex, event.currentIndex);
  //  this.checkedListQuestion.forEach((question, index) => {
  //    question = index + 1;
  //  });
  //}

  //Method to save the selected question
  SaveSelectedQuestion(model, form: NgModel) {
    //this.saveDraft = true;
    this.onSubmit(form);
  }

  //Method to add the additional question field dynamically
  addQuestion(event) {
    event.preventDefault();

    // Finding total number of elements added
    let element = document.getElementsByClassName("element"), last_element;
    let total_element = element.length;
    //let dynamic_text = document.getElementById('Question_1');
    last_element = element[total_element - 1];
    /*if (total_element > 1) {
      last_element = (dynamic_text as HTMLElement).previousSibling;
    } else {
      last_element = dynamic_text;
    }*/

    /*if (this.lastid) {
      last_element = dynamic_text[dynamic_text.length - 1];
    } else {
      last_element = element[total_element - 1];
    }*/

    if (total_element == 0) {
      last_element = document.getElementsByClassName('more_que_cont')[0];
    }

    let addfields = document.getElementsByClassName("add_fields")[0];

    // last <div> with element class id
    //let lastid = last_element.getAttribute("id"), split_id, nextindex;
    let lastid, split_id, nextindex;
    if (last_element && !last_element.classList.contains('more_que_cont')) {
      lastid = last_element.getAttribute("id")
    } else {
      lastid = 'Question_0';
    }
    //this.lastid = last_element.getAttribute("id");
    //let split_id, nextindex;

    if (lastid) {
      split_id = lastid.split("_");
      nextindex = Number(split_id[1]) + 1;
    }

    if (total_element >= 9) {
      addfields.setAttribute("disabled", "true");
    }


    //Check maximum allowed input fields
    if (total_element < this.max_fields) {

      //add input field but check before container is available or not
      //last_element
      if (last_element) {
        //last_element.insertAdjacentHTML('afterend', "<div class='element' id='Question_" + nextindex + "'><input class='txtBoxBig col-md- ml-1 my-3 form-textbox-border add-more-question' type='text' name='Question_" + nextindex + "' id='Question_" + nextindex + "' placeholder='Please enter question...' style='width:96%;' /><button id='remove_" + nextindex + "' class='remove_field btn-danger remove-icon' style='margin-bottom:-4px;border-radius:4px;'>x</button></div>");
        //last_element.insertAdjacentHTML('afterend', "<div class='element extra_container my-3' style='display:flex;align-items: center;' id='Question_" + nextindex + "'><textarea class='txtBoxBig textbox-border form-group selected_question p-1 add_extra_question m-0 add-more-question' name='Question_" + nextindex + "' id='Question_" + nextindex + "' placeholder='Enter your question' style='width:90%;margin: 0px 15px !important;border: 1px solid #cccccc !important;'></textarea><button id='remove_" + nextindex + "' class='remove_field btn-danger remove-icon' style='margin-bottom:-4px;border-radius:4px;'>x</button></div>");
        //dynamic_text.insertAdjacentHTML('beforebegin', "<div class='element dynamic_text extra_container my-3' style='display:flex;align-items: center;' id='Question_" + nextindex + "'><textarea class='txtBoxBig textbox-border form-group selected_question p-1 add_extra_question m-0 add-more-question' name='Question_" + nextindex + "' id='Question_" + nextindex + "' placeholder='Enter your question' style='width:90%;margin: 0px 15px !important;border: 1px solid #cccccc !important;'></textarea><button type='button' id='remove_" + nextindex + "' class='remove_field btn-danger remove-icon' style='margin-bottom:-4px;border-radius:4px;'>x</button></div>");
        if (last_element && last_element.classList.contains('more_que_cont')) {
          last_element.innerHTML = "<div class='element dynamic_text extra_container my-3' style='display:flex;align-items: center;' id='Question_" + nextindex + "'><textarea class='txtBoxBig abc textbox-border form-group selected_question p-1 add_extra_question m-0 add-more-question' name='Question_" + nextindex + "' id='Question_" + nextindex + "' placeholder='Enter your question' style='width:90%;margin: 0px 15px !important;border: 1px solid #cccccc !important;'></textarea><button type='button' id='remove_" + nextindex + "' class='remove_field btn-danger remove-icon' style='margin-bottom:-4px;border-radius:4px;'>x</button></div>";
        } else {
          last_element.insertAdjacentHTML('afterend', "<div class='element dynamic_text extra_container my-3' style='display:flex;align-items: center;' id='Question_" + nextindex + "'><textarea class='txtBoxBig abc textbox-border form-group selected_question p-1 add_extra_question m-0 add-more-question' name='Question_" + nextindex + "' id='Question_" + nextindex + "' placeholder='Enter your question' style='width:90%;margin: 0px 15px !important;border: 1px solid #cccccc !important;'></textarea><button type='button' id='remove_" + nextindex + "' class='remove_field btn-danger remove-icon' style='margin-bottom:-4px;border-radius:4px;'>x</button></div>");
        }

        //last_element.insertBefore(newItem, last_element.childNodes[0]);
        let remove_el = document.getElementsByClassName('remove_field');
        //let addmorequestion = document.getElementsByClassName('abc');

        //Adding event hadler on cross icon
        /*for (let m = 0; m < addmorequestion.length; m++) {
          addmorequestion[m].addEventListener('blur', this.sortQuestion.bind(this));
        }*/

        //Adding event hadler on cross icon
        for (let m = 0; m < remove_el.length; m++) {
          remove_el[m].addEventListener('click', this.removeQuestionField.bind(this));
        }
      }
    }
  }

  //Method to remove the addition question field
  removeQuestionField(event) {
    let id = event.target.parentElement.id, deleteindex, split_id, target, q_id;
    let addfields = document.getElementsByClassName("add_fields")[0];
    addfields.removeAttribute("disabled");

    target = event.target;
    if (target) q_id = target.getAttribute('question_id');

    if (id) {
      split_id = id.split("_");
      deleteindex = split_id[1];
    }

    // Remove <div> with id
    let elementto_remove = document.getElementById("Question_" + deleteindex);
    //Method to remove the notes
    if (q_id) this.QuestionRemove(q_id)

    if (elementto_remove) elementto_remove.remove();

  }

  //Method to remove the text area
  removeTextAreaField(cls) {
    let deleteindex;

    if (cls) {
      deleteindex = cls;

      // Remove <div> with id
      let elementto_remove = document.getElementById("Question_" + deleteindex);
      if (elementto_remove) elementto_remove.remove();
    }
  }

  //Method to start sorting
  sortQuestion() {
    this.checkedListQuestion = [];
    //Now darw the selected question
    this.sortListQuestion();
  }

  //Method to get the recording list
  GetMyQuestions(rid) {

    if (rid) {
      let ReferenveObj: any = {};
      ReferenveObj.RefRecordingID = rid;
      
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        if (res["length"] > 0) {
          this.question_length = res["length"];
          let add_fields = document.getElementsByClassName('add_fields')[0];

          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionList = res;

            if (this.question_length > 0) {

              for (let i = 0; i < this.question_length; i++) {

                if (add_fields) {
                  (add_fields as HTMLButtonElement).click();

                  let selected_question = document.querySelectorAll('.selected_question');
                  let remove_icon = document.querySelectorAll('.remove-icon');

                  if (selected_question[i]) {
                    if (selected_question[i].nodeName == 'TEXTAREA') {
                      //console.log((selected_question[j] as HTMLTextAreaElement).value);
                      selected_question[i].setAttribute('question_id', res[i]['RecordingQuestionID']);
                      remove_icon[i].setAttribute('question_id', res[i]['RecordingQuestionID']);
                      (selected_question[i] as HTMLTextAreaElement).value = res[i]['QuestionText'];

                    }
                  }
                }
              }
            } else {

              if (add_fields) {
                (add_fields as HTMLButtonElement).click();
                (add_fields as HTMLButtonElement).click();
              }
            }
          } else {

            if (add_fields) {
              (add_fields as HTMLButtonElement).click();
              (add_fields as HTMLButtonElement).click();
            }
          }
        }
      });

    }
  }

  //Method to get the recording list
  GetMySavedQuestionsByUser(getFav?) {

    let reqObj: any = {};
    reqObj.UserID = this.UserID;

    if (getFav) reqObj.MyFavorite = true;
    
    return this.http
    .post(`${environment.domainApi}I2BRecordingRequest/GetUserQuestionnare`, reqObj).subscribe(res=>{
      if (res["length"] > 0) {
        //this.question_length = res["length"];
        if (res[0]['ResponseStatus'] == 'Success') {

          this.SavedQuestionList = res;

          //Now getting those data which has my favorite is true
          let data_filter = this.SavedQuestionList.filter(element => element.MyFavorite == true)

          if (data_filter.length > 0) {
            this.favouriteQuestion = data_filter;
          } else {
            this.favouriteQuestion = [];
          }
          
          //Now initiating data table
          this.loadDataTable();
          
          //hiding loader
          //this.appcmp.showLoader = false;
        } else {

          this.SavedQuestionList = [];

          //hiding loader
          //this.appcmp.showLoader = false;
        }
      } else {
        this.SavedQuestionList = [];

        //hiding loader
        this.appcmp.showLoader = false;
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
          this.GetMySavedQuestionsByUser(true);
          this.appcmp.showLoader = false;
        }
      });
      // this.dtOptions = {
      //   "order": [[2, "desc"]],
      // };
    }
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


  //Method to remove the notes
  QuestionRemove(id) {
    if (id) {
      let QuestionObj: any = {};
      QuestionObj.RecordingQuestionID = id;

      //hiding loader after login
      /*this.appcmp.showLoader = true;
      this.appcmp.loadermessage = "Question is being removed...";*/      

      return this.http
      .put(`${environment.domainApi}I2BRecordingRequest/DeleteQuestionFromUserQuestionnare`, QuestionObj).subscribe(res=>{
        if (res[0]['ResponseStatus'] == 'Success') {
          this.GetMySavedQuestionsByUser(true);
          this.appcmp.showLoader = false;
        }
      });
    }
  }

  getFavQuestion() {
    this.favouriteQuestion = this.SavedQuestionList.filter((value, index) => {
      return value.isChecked
    });
  }

  fetchCheckedIDs() {
    //this.checkedIDs = []
    this.SavedQuestionList.forEach((value, index) => {
      if (value.isChecked) {
        //this.checkedIDs.push(value.id);
        //console.log(this.checkedIDs)
      }
    });
  }

  changeSelection() {
    this.getFavQuestion();
  }

  //Method to check the existing email id
  onEmailEnter(email) {

    if (email != "") {
      /*let emailObj: any = {};
      emailObj.Email = email;*/
      return this.http
      .get(`${environment.domainStageApi}I2B_Users/CheckUserEmail?Email=` + email).subscribe(res=>{
        //Check length
        let data = Object.keys(res).length;
        if (data > 0) {
          //If success then set few values into the local storage as per the logged persona
          if (res[0]['ResponseStatus'] == 'Success') {
            this.isActiveUser = res[0]['IsActive'];

            this.getUserByEmail(email);

            if (this.isActiveUser) this.erroruser = "This email has been already registered in webtalkx. You can add this user in your network by clicking the add button.";
            else this.erroruser = "";

          } else {
            this.erroruser = "";
            this.isActiveUser = res[0]['IsActive'];
          }
        }
      });
    } else {
      this.erroruser = "";
      this.isActiveUser = false;
    }
  }

  //Method to fetch the User details by email id
  getUserByEmail(Email) {
   
    let obj: any = {};
    obj.EmailID = Email;
    if (Email && Email.length > 3 && Email.indexOf('@') > -1) {
      return this.http
        .post(`${environment.domainApi}I2B_Users/GetUserDetailsByEmail`, obj).subscribe(res=>{
          if (res[0]['ResponseStatus'] == 'Success') {
            if (res && res["length"] > 0) {
              let userdata = res;
              if (res[0]['EmailID'] === Email) {
                this.model.FirstName = res[0]['FirstName'];
                this.model.LastName = res[0]['LastName'];
                this.model.LinkedinProfileLink = res[0]['LinkedIn'];
                if(this.isActiveUser) {
                  this.model.ReviewerFirstName = res[0]['FirstName'];
                  this.model.ReviewerLastName = res[0]['LastName'];
                }

              } else {
                this.model.FirstName = '';
                this.model.LastName = '';
                this.model.LinkedinProfileLink = '';
                if(this.isActiveUser) {
                  this.model.ReviewerFirstName = '';
                  this.model.ReviewerLastName = '';
                }
              }
            }
          } else {
            this.model.FirstName = '';
            this.model.LastName = '';
            this.model.LinkedinProfileLink = '';
            if(this.isActiveUser) {
              this.model.ReviewerFirstName = '';
              this.model.ReviewerLastName = '';
            }
          }
      });
    } else {
      this.model.FirstName = '';
      this.model.LastName = '';
      this.model.LinkedinProfileLink = '';
      if(this.isActiveUser) {
        this.model.ReviewerFirstName = '';
        this.model.ReviewerLastName = '';
      }
    }
  }

  //Method to fetch the User details by email id
  checkUserByEmail(Email) {
   
    let obj: any = {};
    obj.EmailID = Email;
    if (Email && Email.length > 3 && Email.indexOf('@') > -1) {
      return this.http
        .post(`${environment.domainApi}I2B_Users/GetUserDetailsByEmail`, obj).subscribe(res=>{
          if (res[0]['ResponseStatus'] == 'Success') {
            if (res && res["length"] > 0) {
              let userdata = res;
              if (res[0]['EmailID'] === Email) {
                //this.model.FirstName = res[0]['FirstName'];
                this.IsEmailExists = false;
               /* this.isActiveUser = res[0]['IsActive'];

                this.getUserByEmail(Email);

                if (this.isActiveUser) this.erroruser = "This email has been already registered in webtalkx. You can add this user in your network by clicking the add button.";
                else this.erroruser = "";*/
                

              } else {
                
                this.IsEmailExists = true;
                /*this.erroruser = "";
                this.isActiveUser = res[0]['IsActive'];*/
                
              }
            }
          } else {
            
            this.IsEmailExists = true;
           /* this.erroruser = "";
            this.isActiveUser = false;*/
            
          }
      });
    } else {
      
      this.IsEmailExists = true;
      /*this.erroruser = "";
      this.isActiveUser = false;*/
      
    }
  }

  //Method to clear the filed
  clearField() {
    this.model.ReviewerEmail = '';
    this.model.ReviewerFirstName = '';
    this.model.ReviewerLastName = '';
  }

  copyQuestionAcc(i, sampleInpt, elm) {
    var copyText = sampleInpt;

    /* Select the text field */
    copyText.focus();
    copyText.select();
    
    document.execCommand("copy");
    //this._notificationservice.success("Copied to Clipboard.");
  }

  //function is used for add/remove new more fields dynamically
  AddNewQuestions() {
    var max_fields_limit = 10;
    var q_index = 1;
    var min_limit = 0;
    var question_cont = document.getElementsByClassName('question_cont');

    if(question_cont && question_cont.length < 10) {
      var html = '', a = '1 min', b = '2 min', c = '3 min', d = '5 min';

      if(this.webtalkxtype == 'Employee Survey' || this.webtalkxtype == 'Market Research') {
        a = '1 min', b = '2 min', c = '3 min', d = '5 min';
      }
      
      html += '<div class="input-group question_cont question_index_'+this.q_index+' mt-2">';
      html += '<div class="col-md-9 "><div class="form-group mb-1"><textarea class="form-control form-control-user font-13 resize-none selected_question question_'+this.q_index+'" id="question'+this.q_index+'" index="'+this.q_index+'" placeholder="Enter your question" name = "WelcomeMessage"></textarea></div></div>'
      html += '<div class="col-md-2"><div class="form-group"><select name="AnswerLimit" id="AnswerLimit" class="font-13 form-control AnswerLimit text-blue"><option class="text-blue font-weight-bold" value =" ' + a + ' "> ' + a + ' </option><option class="text-blue font-weight-bold"  value="' + b + '">' + b + '</option><option class="text-blue font-weight-bold"  value="' + c + '">' + c + '</option><option class="text-blue font-weight-bold"  value="' + d + '">' + d + '</option></select></div></div>';
      html += '<div class="col-md-1"><button type="button" name="remove" class="remove btn btn-sm p-0"><i class="fas fa-trash text-red border-0"></i></button></div>';
      html += '<div class="col-md-12"><div class="form-group"><div class="custom-control custom-checkbox d-flex"><input type="checkbox" class="custom-control-input RecordQuestion" index="'+this.q_index+'" id="RecordQuestion'+this.q_index+'"><label class="custom-control-label RecordQuestionLbl" for="RecordQuestion'+this.q_index+'" name="RecordQuestion'+this.q_index+'">Record Question</label><div class="i-block card-dots-button catalog-info a ml-2" title="Click here to get more information."><i class="fa fa-info-circle btn_blue font-16"></i></div></div></div></div></div>'
        
      $('.row.question-section').append(html);
      this.q_index++;
    }
    
    const that = this;

    $(document).on('click', '.remove', function () {
      $(this).parent().parent().remove();
      that.toatalTimeCalculation();
    });

    $(document).on('keyup', '.selected_question', function() {
      let index = $(this).attr('index');
      let val = $(this).val();
      let lbl = $('[id="RecordQuestion'+index+'"]')[0];
      
      if(val && lbl) {
        lbl.setAttribute('disabled', 'true');
      } else {
        
        lbl.removeAttribute('disabled');
      }
    })

    
    $(document).on('change', '.RecordQuestion', function () {
      //console.log($(this).attr('index'));
      let index = $(this).attr('index');
      let check_val = $(this)[0].checked;
      console.log("index",index, check_val);
      //let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
      //if(video_btn) (video_btn as HTMLButtonElement).click();

      that.enableRecordQuestion(index, check_val);
    });

    // $(document).on('click', '.RecordQuestion', function () {
      
    // });

    $(document).on('change', '.AnswerLimit', function () {
      that.toatalTimeCalculation();
    });

    that.toatalTimeCalculation();
  }

  ChangeValue(RecordingType, event) { }

  //Method to enable the recording question
  enableRecordQuestion(qindex, check_val){
    console.log(qindex, "checkbox");
    this.record_header = 'Record Question';

    var q_textarea = document.getElementsByClassName('question_'+qindex)[0];
    var txtarea_val = (q_textarea as HTMLTextAreaElement).value;

    if(q_textarea) {
      if(check_val && !txtarea_val) {
        (q_textarea as HTMLTextAreaElement).value = '';
        q_textarea.setAttribute('disabled', String(check_val));
      }
      else q_textarea.removeAttribute('disabled');
    }
            
    //Added hack to open model to show the company details
    //(<any>$('#RecordingQuestionModal')).modal('show');

  }

  onRecordIntro($event){
    this.record_header = 'Record Introduction Message';
    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    if(video_btn) (video_btn as HTMLButtonElement).click();
        
    //Added hack to open model to show the company details
    (<any>$('#RecordingQuestionModal')).modal('show');
  }

  
  //function is used for add/remove new more fields dynamically
  AddManualRow() {

    var html = '';
    
    html += '<div class="input-group row_entry_cont row_index_1 mt-2">';
    html += '<div class="col-md-2 "><div class="form-group mb-1"><input class="form-control form-control-user font-13 row_index_1 firstname_row" id="firstname_row" placeholder="First Name" name="FirstName"></div></div>'
    html += '<div class="col-md-2"><div class="form-group"><input class="form-control form-control-user font-13 row_index_1 lastname_row" id="lastname_row" placeholder="Last Name" name="LastName"></div></div>';
    html += '<div class="col-md-3"><div class="form-group"><input class="form-control form-control-user font-13 row_index_1 email_row" id="email_row" placeholder="Email Id" name="EmailId"></div></div>';
    html += '<div class="col-md-2"><div class="form-group"><input class="form-control form-control-user font-13 row_index_1 linkedin_row" id="linkedin_row" placeholder="LinkedIn" name="LinkedIn"></div></div>';
    html += '<div class="col-md-2"><div class="form-group"><input class="form-control form-control-user font-13 row_index_1 phonenumber_row" id="phonenumber_row" placeholder="PhoneNumber" name="PhoneNumber"></div></div>';
    html += '<div class="col-md-1"><button type="button" name="remove_row" class="remove_row btn btn-sm"><i class="fas fa-trash text-red border-0"></i></button></div></div>';
      
    $('.row.manual_entry_section').append(html);
    
    $(document).on('click', '.remove_row', function () {
      $(this).parent().parent().remove();
    });
  }

  //Method to reply the recording
  replayInterview(e, index){
    
    if(index) {
      let video_elm = document.getElementsByTagName('video')[0];
      let replay = document.getElementsByClassName('replay_'+index)[0];
      let ext;
      //console.log("elm", replay);
      if(video_elm) {
        if(replay) ext = replay.getAttribute('extension');
        //video_elm.setAttribute('src', `https://sara.webtalkx.com/upload/request_`+this.recordingId+'_'+index+'.'+ext);
        video_elm.setAttribute('src', this.domainApi+'UserVideo/'+ this.recordingId +'/request_'+ this.recordingId +'_'+ index+ '.mp4');
        video_elm.setAttribute('controls', 'controls');
      }
    }

  }

  //Method to init the selected items
  selectToInitRecording(index){
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();

    let question_player = document.getElementsByClassName('question_player_'+index)[0];
    if(question_player) (question_player as HTMLVideoElement).pause();
    
    //console.log(index);
    //Methdo to active the video recording element
    this.activeVideoElement();
    
    this.video_index = index;
    //localStorage.setItem('QuestionIndex', String(index));
    //Now active the selected question
    this.showActiveQuestion(index);

    let status = document.getElementsByClassName('status_'+index)[0], sts_val;
    if(status) sts_val = status.innerHTML;
    
    let start_btn = document.getElementsByClassName('start_intro')[0];
    if(start_btn) {      
      if(sts_val && sts_val.trim() == 'Not recorded') {
        if(start_btn.classList.contains('invisible')){
          start_btn.classList.remove('invisible');
        }
        //start_btn.removeAttribute('disabled');
      } else if(sts_val && sts_val.trim() == 'Recorded') {
        if(!start_btn.classList.contains('invisible')){
          start_btn.className += ' invisible';
        }
        //start_btn.setAttribute('disabled', 'true');
      }
    }
  }

  //Method to start the recording
  onStart(e) {
    let video_replay = document.getElementsByClassName('video_replay')[0];
    if(video_replay) (video_replay as HTMLVideoElement).pause();
    
    //Methdo to active the video recording element
    this.activeVideoElement();

    var active_el = document.getElementsByClassName("question_elem active_data")[0], index;
    if(active_el) index = active_el.getAttribute('id');
    if(index) localStorage.setItem('QuestionIndex', String(index));
    
    let video_btn = document.getElementsByClassName('vjs-button vjs-icon-record-start')[0];
    if(video_btn) (video_btn as HTMLButtonElement).click();

    let video_elm = document.getElementsByTagName('video')[0];
    if(video_elm) video_elm.removeAttribute('controls');
    
    let start_btn = document.getElementsByClassName('start_intro')[0];
    if(start_btn) {
      //start_btn.setAttribute('disabled', 'true');
      
      if(!start_btn.classList.contains('invisible')){
        start_btn.className += ' invisible';
      }
    }

    let cancel_ans = document.querySelector('#btn-cancel-answer');
    let save_ans = document.querySelector('.btn-answer-question');

    if(cancel_ans && cancel_ans.classList.contains('-hidden')){
      cancel_ans.classList.remove('-hidden');
    }
    
    if(save_ans && save_ans.classList.contains('-hidden')){
      save_ans.classList.remove('-hidden');
    }
    this.IsRecordingStarted = true;
    
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
  onCancelIntroduction() {
    this.IsRecordingStarted = false;
    this.IsRecordingCanceled = true;
    this.stopTimer = true;
    
    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    //(video_btn as HTMLButtonElement).click();
    //this.ngAfterViewInit();
    
    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    (video_stop_btn as HTMLButtonElement).click();
    
    let start_btn = document.getElementsByClassName('start_intro')[0];
    if(start_btn) {
      //start_btn.removeAttribute('disabled');
      if(start_btn && start_btn.classList.contains('invisible')){
        start_btn.classList.remove('invisible');
      }
    }
    
    let cancel_ans = document.querySelector('#btn-cancel-answer');
    let save_ans = document.querySelector('.btn-answer-question');

    if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
      cancel_ans.className += ' -hidden';
    }
    
    if(save_ans && !save_ans.classList.contains('-hidden')){
      save_ans.className += ' -hidden';
    }
  }
    
  //method to count the skipped question
  saveIntroduction(e) {
    this.stopTimer = true;
    
    let video_stop_btn = document.getElementsByClassName('vjs-control vjs-button vjs-icon-record-stop')[0];
    if(video_stop_btn) (video_stop_btn as HTMLButtonElement).click();

    let video_btn = document.getElementsByClassName('vjs-device-button vjs-control')[0];
    //if(video_btn) (video_btn as HTMLButtonElement).click();
          
    let cancel_ans = document.querySelector('#btn-cancel-answer');
    let save_ans = document.querySelector('.btn-answer-question');
    
    /*let start_btn = document.getElementsByClassName('start_intro')[0];
    //if(start_btn) start_btn.removeAttribute('disabled');
    if(start_btn && start_btn.classList.contains('invisible')) {
      start_btn.classList.remove('invisible');
      //start_btn.className += ' -hidden';
    }*/

    if(cancel_ans && !cancel_ans.classList.contains('-hidden')){
      cancel_ans.className += ' -hidden';
    }
    
    if(save_ans && !save_ans.classList.contains('-hidden')){
      save_ans.className += ' -hidden';
    }
    
    this.IsRecordingStarted = false;
    //Added hack to open model to show the company details
    (<any>$('#RecordingQuestionModal')).modal('hide');
    
    var list = document.getElementsByClassName("question_elem");
    for (var i =0; i < list.length; i++) {
        var active_el = document.getElementsByClassName("question_elem active_data")[0];
        if(active_el == list[i]) {
          //console.log(list[i+1]);
          //if(list[i+1]) (list[i+1] as HTMLElement).click();
          if(active_el && active_el.classList.contains('active_data') && list[i+1]) active_el.classList.remove('active_data');
          if(list[i+1]) {
            let start_btn = document.getElementsByClassName('start_intro')[0];
            //if(start_btn) start_btn.removeAttribute('disabled');
            list[i+1].className += ' active_data';

            //get the current active element then get the id of that element
            let cur_elm = list[i+1], index;
            if(cur_elm) index = cur_elm.id;

            //based on id get the status element and check the status
            let status_elm = document.getElementsByClassName('status_'+index)[0];
            let status = (status_elm) ? status_elm.innerHTML : '';

            if(start_btn && start_btn.classList.contains('invisible')) {
              //If status of the element is not recorded then only enable the start recording button
              if(status && status == 'Not recorded') start_btn.classList.remove('invisible');
              //start_btn.className += ' -hidden';
            }
          }
          break;
        }
    }
    
  }

  //Method to close the model
  closeModal(){
    if(this.IsRecordingStarted) return false;
    //Added hack to open model to show the company details
    (<any>$('#RecordingQuestionModal')).modal('hide');
  }

  //method to calculate time and covert to total seconds into hours,minutes,second format
  toatalTimeCalculation() {
    let TimeValue:number=0, Ans_Limit, Welcome_Msg;

    Welcome_Msg = document.getElementsByClassName('WelcomeMessage');
    
    Ans_Limit = document.getElementsByClassName('AnswerLimit');

    //console.log(Ans_Limit);

    if (Ans_Limit.length > 0) {
      for (let i = 0; i < Ans_Limit.length; i++) {
       
        if (Ans_Limit[i]) {
          let val = Ans_Limit[i].value.replace("sec", "");
          //TimeValue += Number(Ans_Limit[i].value.replace("sec", ""));
          TimeValue += Number(val);
        }
        //console.log(TimeValue);
        if (TimeValue) {
          //we are converting time
          let totalSeconds = TimeValue;
          let hours = Math.floor(totalSeconds / 3600).toString();
          totalSeconds %= 3600;
          let minutes = Math.floor(totalSeconds / 60).toString();
          let seconds = (totalSeconds % 60).toString();

          //this is to add zero at the starting of time
          minutes = String(minutes).padStart(2, "0");
          hours = String(hours).padStart(2, "0");
          seconds = String(seconds).padStart(2, "0");
          this.TotalTime =  hours + ' : ' + minutes + ' : ' + seconds;

        } else {
         

        }


      }
    }
  }

  
  //methos to update time on Onchange
  updateAnswerTime(event,answerLimit) {
    let TimeValue: any = 0, target, AnswerLimitVal;

    if (event && event.target) target = event.target;
    //if (event) this.model.AnswerLimit = event.target.options[event.target.selectedIndex].value;
    //this.AnswerLimitVal = this.model.AnswerLimit.replace("sec", "");
   
    this.toatalTimeCalculation();

  }
  
  
   //method to save template questions
   saveTemplateQuestion(){
    
    let ques_Obj: any = {}, i = 0;
    var selected_question = document.querySelectorAll('.selected_question');
    var answer_limit = document.querySelectorAll('.AnswerLimit');
    
    if (selected_question.length > 0) {
      for (let j = 0; j < selected_question.length; j++) {
        let value, q_id, answer_limit_val;

        if (selected_question[j]) {
          let isDisabled = (selected_question[j] as HTMLTextAreaElement).hasAttribute('disabled');
          
          if (selected_question[j].nodeName == 'TEXTAREA' && ((selected_question[j] as HTMLTextAreaElement).value || isDisabled)) {
            this.template_err = '';
            if(answer_limit && answer_limit[j]) {
              answer_limit_val = (answer_limit[j] as HTMLSelectElement).value;
            }
            
            if(isDisabled) {
              //value = j + 1;
              value = 'Video.mp4';
            } else {
              value = (selected_question[j] as HTMLTextAreaElement).value;
            }
            
            ques_Obj.QuestionText = value;
            ques_Obj.QuestionOrder = j + 1;
            ques_Obj.AnswerLimit = answer_limit_val ? answer_limit_val.trim() : '';

            //Now insert template
            this.insertTemplateQuestion(ques_Obj);

          } else {
            this.template_err = 'Please enter the question in the text box before adding a template.';
          }
        }

      }
    }
  }

  //Method to insert template
  insertTemplateQuestion(ques_Obj) {
    let data = {
      QuestionText: ques_Obj.QuestionText,
      AnswerLimit: ques_Obj.AnswerLimit,
      TemplateName: this.model.TemplateName,
      UserID: this.UserID
    };

    if(this.model.TemplateName){
      return this.http
        .post(`${environment.domainStageApi}/I2BUserQuestionTemplate/InsertTemplateQuestion`, data).subscribe(res => {
          let data = Object.keys(res).length;
          if (data && res[0]['ResponseStatus'] == 'Success') {
            //alert('Added Successfully!');
            this.alert_message = 'Template added successfully!';
            (<any>$('#confirmMsgModel')).modal('show');
          }
        });
      }
  }

   //method to get template name
  getTemplateName(){
   
    let data = {   
      UserID: this.UserID
    };
    //show loader
    this.appcmp.showLoader = true;
   
    return this.http
      .post(`${environment.domainStageApi}/I2BUserQuestionTemplate/GetUserTemplateNames`, data).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          //alert('Recieved Successfully!');
          this.templateName = res;
          //hiding loader after login
          this.appcmp.showLoader = false;
        } else {
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });
      
  }

  //method to get template questions
  getTemplateQuestions(templaltename, key){
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading template questions...';
       
    let data = {   
      UserID: this.UserID,
      TemplateName: templaltename.TemplateName || templaltename,
    };

    let key_val = key;
   
    return this.http
      .post(`${environment.domainStageApi}/I2BUserQuestionTemplate/GetUserTemplateQuestions`, data).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
         
          if(key_val == "Y") {
            this.templateQuestions = res;
            this.appcmp.showLoader = false;
          }
          else {
            this.assignTemplateQuestion(res);
          }
        }
      });
      
  }

  //Method to add the template question
  addTemplateQuestion(){
    let TemplateName = this.templatename;
    //this.removeFields();

    
      //Now fetching the template question to copy onthe text area
      if(TemplateName) {
        this.getTemplateQuestions(TemplateName, "N");
        //now clear the selection
        this.model.TemplateQues = "";
        this.templatename = "";
      
        //now getting the create button and triggering 
        let createquestions = document.querySelector('#createquestions');
        if(createquestions) (createquestions as HTMLButtonElement).click();
      }
    
  }

  //methdo to remove the files
  removeFields() {
    let remove = document.querySelectorAll('.remove');
    for (let i = 0; i < remove.length; i++) {

      if (remove[i]) {
        if(remove[i]) (remove[i] as HTMLButtonElement).click();
      }
    }
  }

  //Method to assigne template question
  assignTemplateQuestion(respose) {
    let res = respose;
    //setTimeout(function(){
      if (res["length"] > 0) {
        this.question_length = res["length"];
        let add_fields = document.getElementsByClassName('addNewQuestions')[0];

        if (res[0]['ResponseStatus'] == 'Success') {
          this.questionList = res;
          //this.model.TemplateName = res[0]['TemplateName'];

          if (this.question_length > 0) {

            for (let i = 0; i < this.question_length; i++) {

              if (add_fields) {
                (add_fields as HTMLButtonElement).click();

                let selected_question = document.querySelectorAll('.selected_question');
                let remove_icon = document.querySelectorAll('.remove');
                let answer_limit = document.querySelectorAll('.AnswerLimit');
                // let RecordQuestion = document.querySelectorAll('[name="RecordQuestion'+(i+1)+'"]');
                // let Recordinput = document.querySelectorAll('#RecordQuestion'+(i+1));
                let RecordQuestion = document.querySelectorAll('.RecordQuestionLbl');
                let Recordinput = document.querySelectorAll('.RecordQuestion');
              
                if (selected_question[i]) {
                  
                  (selected_question[i] as HTMLInputElement).value = '';
                  (selected_question[i] as HTMLInputElement).focus();
                }
                if(Recordinput[i] && (Recordinput[i] as HTMLInputElement).checked) if(RecordQuestion[i]) (RecordQuestion[i] as HTMLLabelElement).click();
                
                if(res[i]['QuestionText'] == "Video.mp4"){
                  if(RecordQuestion[i]) (RecordQuestion[i] as HTMLLabelElement).click();
                  console.log("RecordQuestion", RecordQuestion[i]);
                }
                else if (selected_question[i]) {
                  if (selected_question[i].nodeName == 'TEXTAREA') {
                    //console.log((selected_question[j] as HTMLTextAreaElement).value);
                    //selected_question[i].setAttribute('question_id', res[i]['TemplateQuestionID']);
                    //remove_icon[i].setAttribute('question_id', res[i]['TemplateQuestionID']);
                    (selected_question[i] as HTMLTextAreaElement).value = res[i]['QuestionText'];
                    //(answer_limit[i] as HTMLSelectElement).value = res[i]['AnswerLimit'];

                  }
                }
                this.appcmp.showLoader = false;
              }
            }
          } else {

            if (add_fields) {
              (add_fields as HTMLButtonElement).click();
              (add_fields as HTMLButtonElement).click();
            }
            this.appcmp.showLoader = false;
          }
        } else {

          if (add_fields) {
            (add_fields as HTMLButtonElement).click();
            (add_fields as HTMLButtonElement).click();
          }
          this.appcmp.showLoader = false;
        }
      } else {
        this.appcmp.showLoader = false;
      }
    //},1000);
  }

  //Copy template
  selectTemplate(TemplateName) {
    this.templatename = TemplateName;
    //Now fetching the template question to copy onthe text area
    //this.getTemplateQuestions(TemplateName, "N");
    
  }
    
  //Method to reply the recording
  replayInterviewNow(e, index){
    e.preventDefault();
    e.stopPropagation();
    
    if(index) {
      //let video_elm = document.getElementsByTagName('video')[0];
      let replay = document.getElementsByClassName('replay_'+index)[0];
      let ext;

      //Method to show active question
      this.showActiveQuestion(index);

      let start_btn = document.getElementsByClassName('start_intro')[0];
      if(start_btn) {
        //start_btn.setAttribute('disabled', 'true');
        
        if(!start_btn.classList.contains('invisible')){
          start_btn.className += ' invisible';
        }
      }
      
      //Methdo to active the video recording element
      let video_record_elm = document.getElementById('video_clip1');
      if(video_record_elm && !video_record_elm.classList.contains('-hidden')) video_record_elm.className += ' -hidden';

      let video_elm = document.getElementsByClassName('video_replay')[0];

      if(video_elm) {
        if(video_elm.classList.contains('-hidden')) video_elm.classList.remove('-hidden');

        //if(replay) ext = replay.getAttribute('extension');
        //video_elm.setAttribute('src', 'https://sara.webtalkx.com/upload/request_'+this.recordingId+'_'+index+'.'+ext);
        video_elm.setAttribute('src', this.domainApi+'UserVideo/'+ this.recordingId +'/request_'+ this.recordingId +'_'+ index+ '.mp4');
        //check_url = this.domainApi+'UserVideo/'+ this.recordingId +'/request_'_'+ this.recordingId +'_'+ index+ '.'+ext;
        //video_elm.setAttribute('controls', 'controls');
        (video_elm as HTMLVideoElement).play();
      }
    }
   
  }
  
  //Method to stop the video playing
  stopVideoPlayer(recording_player) {
    if(recording_player) recording_player.pause();
  }
  
  
  //Method to delete the recording
  onDeleteRecording(e, index) {
    let target, target_id, next_btnid, qcount, ansbtn, startbtn, readbtn, replay, ReRecord;
    /*this.inprogress = localStorage.getItem('InProgress');
    if (this.inprogress == 'Y') {
      (<any>$('#inprogressModal')).modal('show');
      return false;

    } else {
      localStorage.setItem('InProgress', '');
      //alert('Finishing');
    }*/
    let video_elm = document.getElementsByClassName('video_replay')[0];
    if(video_elm) (video_elm as HTMLVideoElement).pause();

    
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
      //this.moveWizardQuestion(index);
    }
  }
  
  //Method to confirm to delet the recording
  _confirmToDeleteRecording() {
    console.log("indexing", this.delete_record);
    if (this.delete_record) {

      //hiding loader after login
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';

      let reqObj: any = {}, record_name;
      record_name = 'request_'+this.recordingId+'_'+this.delete_record+'.mp4';
      reqObj.RefRecordingID = this.recordingId;
      reqObj.QuestionIndex = record_name;
      
      let video_elm = document.getElementsByClassName('video_replay')[0];
      if(video_elm) (video_elm as HTMLVideoElement).setAttribute('src', '');

      let that = this;
      setTimeout(function(){
        //hiding loader after login
        that.appcmp.showLoader = false;
        
        //Method to active the video element
        that.activeVideoElement();

        let removeRecord = document.getElementsByClassName('removeRecord_' + that.delete_record)[0];
        if (removeRecord) removeRecord.setAttribute('disabled', 'true');

        let replayRecord = document.getElementsByClassName('replay_' + that.delete_record)[0];
        if (replayRecord) replayRecord.setAttribute('disabled', 'true');

        let status = document.getElementsByClassName('status_' + that.delete_record)[0];
        if (status) (status as HTMLElement).innerText = 'Not recorded';

        let qnumber = document.getElementsByClassName('qnumber' + that.delete_record)[0];
        //if (qnumber && qnumber.classList.contains('answered_que')) qnumber.classList.remove('answered_que');

        let start_btn = document.getElementsByClassName('start_intro')[0];
        if(start_btn) {
            //start_btn.removeAttribute('disabled');
            if(start_btn.classList.contains('invisible')){
              start_btn.classList.remove('invisible');
            }
        }

      }, 1000);
      
      /*
      return this.http
      .put(`${environment.domainApi}I2BRecordingRequest/DeleteRecording`, reqObj).subscribe(res=>{
        
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {

          //now updatign status
          //this.UpdateQuestionStatus();
          //Method to active the video element
          this.activeVideoElement();

          let removeRecord = document.getElementsByClassName('removeRecord_' + this.delete_record)[0];
          if (removeRecord) removeRecord.setAttribute('disabled', 'true');

          let replayRecord = document.getElementsByClassName('replay_' + this.delete_record)[0];
          if (replayRecord) replayRecord.setAttribute('disabled', 'true');

          let status = document.getElementsByClassName('status_' + this.delete_record)[0];
          if (status) (status as HTMLElement).innerText = 'Not recorded';

          let qnumber = document.getElementsByClassName('qnumber' + this.delete_record)[0];
          //if (qnumber && qnumber.classList.contains('answered_que')) qnumber.classList.remove('answered_que');

          this.delete_record = null;
          
          //hiding loader after login
          this.appcmp.showLoader = false;
          //Method to switch the video element
          //this.switchVideoElement();

        } else {

          //hiding loader after started
          this.appcmp.showLoader = false;

        }
      });*/
    }
  }

  //recordingPlayerModel
  reviewRecordingVideo(e, index, type) {
    let domainApi, recording_player, req_id, vtype, check_url;

    req_id = this.recordingId;
    vtype = type;
    this.video_url = '';

    recording_player = document.getElementsByClassName('recording_player')[0];
    domainApi = `${environment.domainApi}`;
    //this.video_url = domainApi + vtype +'_'+ req_id+'_'+ index+'_'+ '.mp4';
    //https://stage.webtalkx.com/api/UserVideo/10/2.webm
    //check_url = domainApi+'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    check_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    this.video_url = domainApi+'UserVideo/'+ req_id+'/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
     
    /*var xhr = new XMLHttpRequest();
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
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
      xhr.send();
    }*/
   
    //if(recording_player)
    (<any>$('#recordingPlayerModel')).modal('show');
  }
  
  //method to get template questions
  deleteTemplate(templaltename){
    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Template is being removed...";

    let data = {   
      UserID: this.UserID,
      TemplateName: templaltename,
    };
   
    return this.http
      .put(`${environment.domainStageApi}/I2BUserQuestionTemplate/DeleteUserTemplate`, data).subscribe(res => {
        let data = Object.keys(res).length;
        if (data && res[0]['ResponseStatus'] == 'Success') {
          //Now getting template name
          this.getTemplateName();
        }
      });
      
  }


  /*popitup() {
     var url = 'https://docs.google.com/viewer?url=https://stage.webtalkx.com/api/UserDocuments/VAISHNAVIPANDEY.docx';

     var newwindow=window.open(url,'VAISHNAVIPANDEY.docx','height=560,width=340');
     if (window.focus) {newwindow.focus()}
     return false;
    //(<any>$('#docModel')).modal('show');
  }*/

}


