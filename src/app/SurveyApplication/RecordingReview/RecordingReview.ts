import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
//import { I2BApplicationRecordingReviewService } from './shared/RecordingReview.service';
import { URL } from 'url';
import { Title } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { GlobalVariable } from '../../globals';
//import { NotificationService } from '../../toastr-notification/toastr-notification.service';
//import { CommonService } from '../../CommonService/commonfunction.service';
import Speech from 'speak-tts';
//import { JoyrideService } from 'ngx-joyride';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-recordingreview',
  templateUrl: './RecordingReview.html',
  styleUrls: ['./RecordingReview.css']
})

export class RecordingReviewComponent implements OnInit {
  @Input() rating: number=0;
  @Input() itemId: number;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
  inputName: string;
  rate: any = {}
  starRating = 1.5
  title: string;
  model: any = {}
  requestername: string;
  companyname: string;
  sessionid: string;
  tokenid: string;
  RefRequestID: number;
  qlist: number;
  form: FormGroup;
  VideoSource: string;
  ArchiveID: string;
  VideoURL: string;
  EngagementName: string;
  speech;
  noteslist: any = {};
  updatenotes: boolean = false;
  notesbtn: string = "Add";
  IsSkipped: boolean = false;
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
  rated: boolean = false;
  candidateDoc:string;
  JobDescription:string;
  WelcomePageRequired:boolean = false;

  vendor_Org: string;
  engagment_type: string;
  engagment_category: string;
  softwarevendor: string;
  itsoftware: string;
  engagment_other: string;

  Global: boolean;
  Offshore: boolean;
  Onshore: boolean;
  FixedCost: boolean;
  RiskShare: boolean;
  Multilanguage: boolean;
  ScheduleDT: string;
  ScheduleTime: string;
  RestrictedUseCheck: boolean;
  timeinterval;
  answerEndTime;
  answerStartTime;
  ans;
  timeintervals;
  questionscript: string = 'No script available.';
  searchkeyword: string;
  review_video;
  endtime;
  starttime;

  SharedBookmarklist: any = {};
  SharedNoteslist: any = {};

  book_currenttime: number;
  q_req_id: number;
  arrowicon: string = "fa-chevron-right";
  NotesObj: any;
  msgtxt: string;
  vendorname: string;
  EngagementsName: string;
  givername: string;
  ReviewerCount: number;
  ReferenceCustomer: string;
  video_url: string
  stan_rate: number;
  CommeNt: string;
  RejeCT: string;
  aPPROVE: string;
  bOOKmARK: string;
  reFResh: string;
  Cloud: boolean;
  Mobile: boolean;

  isDefault: boolean = false;

  comments: Comment[];
  textarea;
  voice_text: string;
  Isresume: boolean = true;
  IsReRecord: boolean = false;
  IsRecordingStarted: boolean = false;
  Isfinish: boolean;
  IsSave: boolean;
  ratingClicked: number;
  itemIdRatingClicked: string;
  ReviewerID: number;

  finalRate: number;
  read_btn;

  //array of object of rating
  items = [{ 'rating': 0 }];

  addForm: FormGroup;
  defaultrate: number;
  UserID: number;
  valuationScore: number;
  ValuationComment: string;
  ValuationScorePoints: number;
  ValuationPointWeight: number;
  ValuationPointScore: number;
  ValuationType: number;
  res: any;
  paraText: any;
  whichTab: number = 1;
  refGiverid: number;
  vendorID: number;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  valuationCode: number = 2;
  timeintervalvideo;
  videourl: string;
  r_requestid: number;
  domain_url: string;
  Is_approved: boolean;
  Is_rejected: boolean;
  interviewer: string;
  intLinkedInURL: string;
  venLinkedIn: string;
  givLinkedIn: string;
  requesterName: string;
  recording_title: string;

  ReplayCount: number = 0;
  hitcount: number = 0;
  ReqId: number;
  // introJS = introJs();
  RefRecordingID: number;
  questionList;
  search_questionList;
  question_length: number = 0;
  requesterId: number;
  role: number;
  IsVideoStart: boolean = false;

  IsFirstScriptLoad: boolean = false;
  transcriptQuestion;
  firstinterval;
  recordingName:string;
  recrdtype:string;
  testrecord:string;
  
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num9: number;

  total: number = 0;

  multi: number = 0;
  multi1: number = 0;
  multi2: number = 0;
  multi3: number = 0;
  multi4: number = 0;
  multiSum: number = 0;

  num5: number;
  num6: number;
  num7: number;
  num8: number;
  num10: number;
  sum: number = 0;
  n_len: number = 0;
  b_len: number = 0;
  assignedId:number;
  currentRating= 2;
  txtRateValue = 0;
  

  constructor(private http: HttpClient, private router: Router, public sanitizer: DomSanitizer, private titleService: Title, private appcmp: AppComponent) {
    this.title = appcmp.title + " | Recording replay";
    /*if (localStorage.getItem('ReviewerUserID') == "" || localStorage.getItem('ReviewerUserID') == null) {
      this.router.navigateByUrl('/userlogin');
    }*/

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      this.getvideoElementHeight();
    };
  }

  // Method for calling host js file.
  public highlightScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/tokbox/HighlightScript.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  // Page init method.
  ngOnInit() {
    //Added below code to update the title
    this.titleService.setTitle(this.title);
    this.EngagementName = localStorage.getItem('EngagementName');
    this.RefRecordingID = Number(localStorage.getItem('RefRecordingID'));
    this.recordingName = String(localStorage.getItem('RecordingName'));
    this.recrdtype = localStorage.getItem('English');
    this.testrecord = localStorage.getItem('TestRecord');
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    this.requesterName = localStorage.getItem('requesterName');
    this.requesterId = Number(localStorage.getItem('requesterId'));
    this.assignedId = Number(localStorage.getItem('AssignedID'));

    //this.getRequestDetails();

    //calling to get the all interview question
    this.getQuestion(this.RefRecordingID);

    //this.GetRecordingDetails();
    //this.getAllQuestionsScript(this.RefRecordingID);

    //Method to get the all notes
    this.getMyNotes();

    this.GetRecordingHeadline(this.RefRecordingID);
    //this.GetRecordingDetails(this.RefRecordingID);
    this.q_req_id = this.RefRecordingID;
    this.domain_url = `${environment.domainApi}`;
    
    //getting all bookmark and notes
    /*this.getBookmarkAndNotes();
    this.GetSharedBookmarks();
    this.GetSharedNotes();*/

    //Now updating the reply count
    /*this.updateTheReplayCount();*/


    //using interval to get the length of element
    this.timeinterval = setInterval(() => {
      this.getvideoElementHeight();
    }, 50);

    //this.Notcopytext();


    this.sender_id = Number(localStorage.getItem('LoginUserID'));
    this.role = Number(localStorage.getItem('RoleCheck'));

    //check the length
    //this.checkTextLength(false);

    //Scrolling window on top at initial
    window.scroll(0, 0);

    //introJS method for start the tour
    //this.startSteps();

    this._initSpeech();

    //setTimeout(() => {
    //  this.tour();

    //},2000)
    //opening modal popUp for rating
    this.EnableRatingTab();

  }


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
        rate: 0.8,
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

  stopSpeechText(speech) {
    speech.end();
  }

  onPauseRecording() {
    /*if (this.Isresume) {
      this.pauseSpeechText(this.speech);
      this.Isresume = false;
    } else {
      this.resumeSpeechText(this.speech);
      this.Isresume = true;
    }*/
    this.pauseSpeechText(this.speech);

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
        //text: this.textarea.innerText,
        text: this.voice_text,
        queue: false,
        listeners: {
          onstart: () => {
            console.log("Start utterance");

            if (this.review_video) {
              this.review_video.pause();
            }
            //Method to set Pause to all if any
            //this.setPauseText(false);
          },
          onend: () => {
            console.log("End utterance");
            //if (this.read_btn) this.read_btn.removeAttribute('disabled');
            //Method to set Pause to all if any
            this.setPauseText(true);

            if (this.review_video.paused) {
              this.review_video.play();
            }
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


  //introJS method for start the tour
  //startSteps(): void {
  //  this.introJS
  //    .setOptions({
  //      steps: [
  //        {
  //          element: '#casestudyArrow',
  //          intro: 'Click on arrow to expand the case study.'
  //        }, {
  //          element: '#searchInputTab',
  //          intro: 'Click here to search.'
  //        },
  //        {
  //          element: '#bookmarkTabIntro',
  //          intro: 'Click here to view bookmarks.'
  //        },
  //        {
  //          element: '#TranscriptContainer',
  //          intro: 'Scroll down to view the transcript.'
  //        }
  //      ],
  //      hidePrev: true,
  //      hideNext: false
  //    })
  //    .start();
  //}

  //Method to get the recording headlines
  GetRecordingHeadline(reqid) {
    let refObj: any = {};
    let id = localStorage.getItem('AssignedID');
    refObj.RefRecordingID = reqid;
    refObj.GiverID = (id) ? Number(id) : null;
        
    return this.http
    .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestUserDetails`, refObj).subscribe(res=>{
      let data = Object.keys(res).length;
      if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
        this.vendorname = res[0]['RequesterName'];
        this.givername = res[0]['GiverName'];
        this.refGiverid = res[0]['GiverID'];
        this.vendorID = res[0]['RequesterID'];
        this.interviewer = res[0]['Interviewer'];
        this.ReviewerID = res[0]['ReviewerID'];
        this.recording_title = res[0]['AssignedTitle'] || res[0]['ProjectName'] || res[0]['MeetingName'];

        this.candidateDoc = res[0]['Documents'];
        this.JobDescription = res[0]['JobDescription'];
        this.WelcomePageRequired = res[0]['IntroVideo'];

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

  //Method to get recording details
  GetRecordingDetails(reqid) {
    let refObj: any = {};
    refObj.RefRecordingID = reqid;
    refObj.AssignedToID = this.UserID;
    
    return this.http
    .post(`${environment.domainApi}I2BRecordingRequest/GetAssignedRequestDetails`, refObj).subscribe(res=>{
      let data = Object.keys(res).length;
      if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
      
        this.recording_title = res[0]['AssignedTitle'] || res[0]['Title'];
      }
    });

  }


  //method to get the all the question
  getQuestion(rid) {
    //this.RefRequestID
    if (rid) {
      let ReferenveObj: any = {};
      let email = localStorage.getItem('AssignedEmail');
      ReferenveObj.RefRecordingID = rid; 
      ReferenveObj.EmailID = email;
     
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        
        if (res["length"] > 0) {
          this.question_length = res["length"];
          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionList = res;
            this.search_questionList = res;
            this._initSpeech();

            //Now getting the all script
            //this.getAllQuestionsScript(this.RefRecordingID, email);

            //Now update the question index
            this.setQuestionIndex();
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


  //Method to set question index
  setQuestionIndex() {
    let rid = this.RefRecordingID, queId;
    //this.highlightScript();
    setTimeout(function () {
      //let question_text = document.getElementsByClassName('question-text');
      let question_search = document.getElementsByClassName('question_search');

      let question_text = document.getElementsByClassName('question_div');
      
      if (question_text.length > 0) {
        for (var i = 0; i < question_text.length; i++) {
          question_text[0].className += ' active_data';
          if(question_text[i].innerHTML.indexOf('Frage') < 0) question_text[i].insertBefore(document.createTextNode('Q' + (i + 1) + '. '), question_text[i].firstChild);

          //question_search[i].insertBefore(document.createTextNode('Question ' + (i + 1) + ': '), question_search[i].firstChild);
          //this.IsFirstScriptLoad = true;
          //queId = (question_text[0] as HTMLElement).getAttribute('queid');
          //(question_text[0] as HTMLElement).click();
          //if (rid && queId) this.getQuestionScript(rid, queId);

          
        }
        
      }
     
    }, 500);
        
    //using interval to get the length of element
    this.firstinterval = setInterval(() => {
      let Que_elm = document.getElementsByClassName('question_div active_data')[0];
      if (Que_elm) {
        
        if (this.firstinterval) clearInterval(this.firstinterval);
        if (Que_elm) queId = (Que_elm as HTMLElement).getAttribute('queid');

        //Getting firstscript based on id
        console.log(rid, queId);
        if (rid && queId) this.getQuestionScript(rid, queId);
      }
      
    }, 100);
    
  }


  /*GetRecordingDetails() {
    this.RefRequestID = Number(localStorage.getItem('RefRequestID'));

    this.recordingcatalogservice.GetRecordingDetails(this.RefRequestID).subscribe(res => {
      if (res[0]['ResponseStatus'] == 'Success') {
        this.videourl = res[0]['URL'];
        this.r_requestid = res[0]['RefRequestID'];
        this.Is_approved = res[0]['IsReviewerApproved'];
        this.Is_rejected = res[0]['IsReviewerRejected'];

        this.engagment_category = res[0]['EngagementCategory'];

        this.engagment_category = this.engagment_category.replace(/&amp;/gi, '&');

        //this.video_url = this.domain_url + this.videourl;
        this.video_url = this.videourl;
        
        //using interval to get the length of element
        this.timeintervalvideo = setInterval(() => {
          //getting video element
          this.review_video = document.getElementById('review_video');

          if (this.review_video) {
            if (this.timeintervalvideo) clearInterval(this.timeintervalvideo);
            
            if (this.review_video.paused) {
              this.review_video.play();
            }
          }
        }, 100);
      }
    },
      (error: HttpErrorResponse) => {
        this._notificationservice.error(GlobalVariable.TechnicalError);
      });

  }*/

  //Methid to select the question and draw the script
  selectQuestionAndScript(qid, RefReqId, element, index, q_status, RecordingStatus, type) {
    let starttime;
    if (RecordingStatus == 'Skipped') this.IsSkipped = true;

    /*this.IsVideoStart = false;
    let playallbtn = document.getElementById('playall-button');
    if (playallbtn) {
      playallbtn.innerText = 'Play All with Question';
      if (playallbtn.classList.contains('btn-danger')) {
        playallbtn.classList.remove('btn-danger');
      }
      playallbtn.className += ' btn-primary';
    }*/
 
    //removing the already selcted question
    this.removeSelectedQuestion(type);

    //highlight the active question
    if (element) {
      element.className += ' active_data';
      if (element.firstElementChild) element.firstElementChild.className += ' active_data';
    }

    this.review_video = document.getElementById('review_video');
    if (this.review_video) {
      
      if (this.recrdtype.trim() == 'lindtupload') {
        var ext =  this.recordingName.split('.').pop();
        var b = this.recordingName.split('-');
        var final_url = b[0] +'-'+ b[1] +'-'+ b[2] +'-'+ b[3]+'-' + index + '.' + ext;
        let URL = 'https://linappcardtest.azurewebsites.net/'+ this.recrdtype+'/'+final_url;
        this.review_video.setAttribute('src', URL);
      } else if (this.recrdtype.trim() == 'upload') {
        var ext =  this.recordingName.split('.').pop();
        var b = this.recordingName.split('-');
        var final_url = b[0] +'-'+ b[1] +'-'+ b[2] +'-'+ b[3]+'-' + index + '.' + ext;
        let URL = 'https://sara.webtalkx.com/'+ this.recrdtype+'/'+final_url;
        this.review_video.setAttribute('src', URL);
      } else {
        //let URL = 'https://sara.webtalkx.com/upload/record_'+ this.RefRecordingID+'_'+index+'.webm';
        let id = localStorage.getItem('AssignedID');
        let URL = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+id+'_'+index+'.mp4';
        this.review_video.setAttribute('src', URL);
      }
      /*
      let url = this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.mp4';
      let vid_obj: any = {};

      vid_obj.RefRecordingID = this.RefRecordingID;
      vid_obj.FileName = index + '.mp4';

      if (vid_obj) {
        
        return this.http
        .post(`${environment.domainApi}/RecordRTC/CheckMP4Videos`, vid_obj).subscribe(res=>{
          
          //getting response object's key data length 
          let data = Object.keys(res).length;

          if (res[0]['ResponseStatus'] == 'Success' && res[0]['Message'] == 'Is Exist') {
            this.review_video.setAttribute('src', this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.mp4');
                        
            //Method to set Pause to all if any
            this.setPauseText(true);
            if (this.review_video && this.review_video.paused) this.review_video.play();
            this.speech.cancel();
          } else {
            vid_obj.FileName = index + '.webm';

            if (vid_obj) {
              
              return this.http
              .post(`${environment.domainApi}/RecordRTC/CheckMP4Videos`, vid_obj).subscribe(res=>{
                
                //getting response object's key data length 
                let data = Object.keys(res).length;

                if (res[0]['ResponseStatus'] == 'Success' && res[0]['Message'] == 'Is Exist') {
                  this.review_video.setAttribute('src', this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.webm');

                  //Method to set Pause to all if any
                  this.setPauseText(true);
                  if (this.review_video && this.review_video.paused) this.review_video.play();

                  this.speech.cancel();
                } else {
                  if (RecordingStatus == 'Skipped') {
                    this.IsSkipped = true;
                    //this._notificationservice.info("Recording is not available for this question. Question was skipped during the recording.");
                  }
                  else {
                    this.IsSkipped = false;
                    //this._notificationservice.info("Please wait, recorded video is not available yet.");
                  }
                  //(<any>$('#inprogressModal')).modal('show');

                }
              });
            }

          }
        });
      }*/
    }

    //Now getting the script
    this.getQuestionScript(RefReqId, qid);
  }

  //Method to play and move video
  playAndMoveVideo(starttime) {
    if (this.review_video && starttime) {
      let timeinsec;
      //if (this.review_video.readyState >= 2) {
      timeinsec = this.convertInSecond(starttime);
      this.review_video.currentTime = timeinsec;

      this.review_video = document.getElementById('review_video');
      if (this.review_video.play) this.review_video.play();

      //}
    }
  }

  //Method to convert the time in second
  convertInSecond(hms) {
    /*let parts = input.split('.'),
      minutes = +parts[0],
      seconds = +parts[1];
    return (minutes * 60 + seconds).toFixed(2);*/
    //let hms = '00:07:34';   // your input string
    /*let t = hms.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    let seconds = (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
    return seconds;*/
    let p = hms.split(':'), s = 0, m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
  }

  //Method to remove the selected question
  removeSelectedQuestion(type) {
    
    let questiontext;
    let q_status = document.getElementsByClassName('q_status');

    if (type == 'search') questiontext = document.getElementsByClassName('question_search');
    if (type == 'question') questiontext = document.getElementsByClassName('question-text');

    if (questiontext && questiontext.length) {
      for (let i = 0; i < questiontext.length; i++) {
        if (questiontext[i].classList.contains('active_data')) questiontext[i].classList.remove('active_data');
      }
    }
    if (q_status.length && type == 'question') {
      for (let i = 0; i < q_status.length; i++) {
        if (q_status[i] && q_status[i].classList.contains('active_data')) q_status[i].classList.remove('active_data');
      }
    }
  }

  //Method to search the comments and notes
  keywordSearch(e, type) {

    let target, rid;
    if (e && e.target) target = e.target;

    rid = this.RefRecordingID;
    //Now removing selected question
    this.removeSelectedQuestion(type);
    //updating script
    //this.updatingScript();

    /*let transcript = document.getElementsByClassName('transcript')[0], searchpara;
    if (transcript) {
      searchpara = transcript.innerHTML;
      searchpara = searchpara.toString();

      //Method to highlight the answer text which was searched
      //this.highlightText(searchpara);
    }*/
    if (target.value && target.value.length >= 3) {
      
      this.searchkeyword = target.value;
      //this.highlight(this.searchkeyword);
        
      return this.http
      .get(`${environment.domainApi}I2BRecordingRequest/SearchResult?SearchText=` + target.value + '&RefRequestID=' + rid).subscribe(res=>{
          
        if (res[0]['ResponseStatus'] == 'Success') {
          let SearchResultInQ = res[0]['SearchResultInQ'], qid, SearchResultInComment, bid;
          let bookmarkheader = document.getElementById('bookmark-header');
          SearchResultInComment = res[0]['SearchResultInComment'];
          //this.highlight(this.searchkeyword);
          if (SearchResultInQ.length > 0) {
            //hiding no content text
            this.noContentAvailable(true);
            //hiding previous searched question
            this.hideSearchedQuestion();
            
            if (SearchResultInQ) qid = SearchResultInQ.split(',');

            for (var i = 0; i < qid.length; i++) {
              var el = document.getElementById(qid[i]);
              if (el && el.classList.contains("-hidden")) {
                el.classList.remove('-hidden');
              }
            }
          }

          if (SearchResultInComment.length > 0) {
            //hiding no content text
            this.noContentAvailable(true);
            //hiding previous searched bookmark
            this.hideSearchedBookmark();

            if (SearchResultInComment) bid = SearchResultInComment.split(',');

            for (var j = 0; j < bid.length; j++) {
              var el = document.getElementById(bid[j]);
              if (el && el.classList.contains("-hidden")) {
                el.classList.remove('-hidden');
                if (bookmarkheader && bookmarkheader.classList.contains('-hidden')) bookmarkheader.classList.remove('-hidden');
              }
            }
          }

        } else if (res[0]['ResponseStatus'] == 'Failed') {
          //hiding previous searched question
          this.hideSearchedQuestion();
          //if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);

          //showing no content text
          this.noContentAvailable(false);
        }
      });

    } else if (target.value == "") {
      //clearing search box if no keyword
      this.clearSearch();
      this.searchkeyword = '';
      let Que_elm = document.getElementsByClassName('question_div active_data')[0], queId;
      if (Que_elm) queId = (Que_elm as HTMLElement).getAttribute('queid');
      if (queId) this.getQuestionScript(this.RefRecordingID, queId);
    }
  }

  //Method to clear the search box
  clearSearch() {
    //using interval to get the length of element
    this.timeintervals = setInterval(() => {
      //clear input will check the value till blank
      this.clearInput();
      
    }, 100);

  }

  clearInput() {
    
    let searchquestion = (<HTMLInputElement>document.getElementsByClassName('search-question')[0]), searchquestion_val;
    if (searchquestion) searchquestion_val = searchquestion.value;

    if (searchquestion_val == "") {
      if (this.timeintervals) clearInterval(this.timeintervals);

      //showing no content text
      this.noContentAvailable(false);

      //then getting all script
      //if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);
      //if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);
      let Que_elm = document.getElementsByClassName('question_div active_data')[0], queId;
      if (Que_elm) queId = (Que_elm as HTMLElement).getAttribute('queid');
      if (queId) this.getQuestionScript(this.RefRecordingID, queId);
      //updating script
      //this.updatingScript();
      //this.getQuestionScript(this.RefRecordingID, quesID);

      //Method to hide the already searched and active question
      this.hideSearchedQuestion();

      //hiding previous searched bookmark
      this.hideSearchedBookmark();

      //removing selected question
      this.removeSelectedQuestion('search');

      //this.highlight('');

      //Method to highlight the answer text which was searched
      //this.highlightText(searchpara);
    }
  }

  //Method to update the script
  updatingScript() {
    let Que_elm = document.getElementsByClassName('highlighter'), queId;
    //if (Que_elm) queId = (Que_elm as HTMLElement).getAttribute('queid');
    //if (queId) this.getQuestionScript(this.RefRecordingID, queId);
    if (Que_elm.length) {
      for (var i = 0; i < Que_elm.length; i++) {
        if (Que_elm[i]) {
          Que_elm[i].classList.remove('highlighter');
        }
      }
    }
  }

  //Method to hide/show the 'no content available' text
  noContentAvailable(o) {
    let no_data = document.getElementsByClassName('no-data')[0];
    if (no_data) {
      if (o && !no_data.classList.contains('-hidden')) no_data.className += ' -hidden';
      if (!o && no_data.classList.contains('-hidden')) no_data.classList.remove('-hidden');
    }
  }

  //Method to hide the already searched and active question
  hideSearchedQuestion() {
    let search_qu = document.getElementsByClassName('search_qu');
    if (search_qu.length) {
      for (var i = 0; i < search_qu.length; i++) {
        if (!search_qu[i].classList.contains('-hidden')) {
          search_qu[i].className += ' -hidden';
        }
      }
    }
  }

  //Method to hide the already searched and active question
  hideSearchedBookmark() {
    let search_book = document.getElementsByClassName('search_book');
    let bookmarkheader = document.getElementById('bookmark-header');
    if (search_book.length) {
      for (var i = 0; i < search_book.length; i++) {
        if (!search_book[i].classList.contains('-hidden')) {
          search_book[i].className += ' -hidden';
          if (bookmarkheader && !bookmarkheader.classList.contains('-hidden')) bookmarkheader.className += ' -hidden';
        }
      }
    }
  }

  //Method to convert the text into regular expression into the searched text and return
  toRegExp(text) {
    return new RegExp(text, 'g');
  }

  //Method to embedd the span tag into the searched text and return
  toSpan(text, className) {
    return '<span class="' + className + '">' + text + '</span>';
    //return '<mark>' + text + '</mark>';
  }

  //Method to highlight the answer text which was searched
  highlightText(searchpara) {
    let text = this.searchkeyword;
    if (text) {
      let pattern = new RegExp("(" + text + ")", "gi");
      let new_text = searchpara.replace(pattern, "<span class='highlighter'>" + text + "</span>");
      document.getElementsByClassName('transcript')[0].innerHTML = new_text;
    }
  }

  //Method to calculate the video elemnt height and set the questionaier section height
  getvideoElementHeight() {
    let video_tag, video_tagheight, tabcontent, searchscroll, searchscroll_height, control_notes;
    video_tag = document.getElementsByClassName('video-tag')[0];
    searchscroll = document.getElementsByClassName('searchscroll')[0];
    control_notes = document.getElementById('control_notes');

    if (video_tag) {
      if (this.timeinterval) clearInterval(this.timeinterval);
      tabcontent = document.getElementsByClassName('tab-content')[0];

      if (video_tag) video_tagheight = video_tag.clientHeight;
      if (video_tagheight) video_tagheight = video_tagheight - 102;
      if (tabcontent && video_tagheight) tabcontent.setAttribute('style', 'height: ' + video_tagheight + 'px');
      searchscroll_height = video_tagheight - 70;

      if (searchscroll) searchscroll.setAttribute('style', 'height: ' + searchscroll_height + 'px');
      if (control_notes) control_notes.setAttribute('style', 'height: ' + searchscroll_height + 'px');
    }
  }

  //Method to collapse the case study dropdown
  onCollapsed() {
    let target;
    let o = document.getElementById('collapse1');

    //if (o) {
    //  if (o.classList.contains('show')) {
    //    this.arrowicon = 'fa-chevron-right';
    //    setTimeout(function () {
    //      o.classList.remove('show');
    //    }, 500);
    //  } else {
    //    this.arrowicon = 'fa-chevron-down';
    //    o.className += ' show';
    //  }
    //}
    if (o) {
      if (o.classList.contains('show')) {
        this.arrowicon = 'fa-chevron-right';
      } else {
        this.arrowicon = 'fa-chevron-down';
      }
    }
  }

  //Method to get the all questions script
  getAllQuestionsScript(qid, email) {
    
    if (qid) {
        
      return this.http
      //.get(`${environment.domainApi}RequesterRecording/GetRecodingScriptByRefRequestID?RefRequestID=` + qid).subscribe(res=>{
      .get(`${environment.domainApi}I2BRecordingRequest/GetQuestionByRefIDEmailID?RefRecordingID=` + qid + `&EmailID=` + email).subscribe(res=>{
          //getting response object's key data length 
          let data = Object.keys(res).length;
          //getting transcript element
          let transcript = document.getElementsByClassName('transcript')[0];
          if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
            //this.questionscript = res[0]['RecordingScript'];
            this.questionscript = res[0]['QuesAns'];
            
            if (transcript && this.questionscript) {
              transcript.innerHTML = this.questionscript;


            }
            else if (transcript) transcript.innerHTML = "Script not available.";
          } else {
            if (transcript) transcript.innerHTML = "Script not available.";
          }
      });

    }
  }

  //Method getting video current time
  getVideoCurrentTime(e, review_video) {
    let target;
    if (e && e.target) target = e.target;
    this.review_video = review_video;

    this.starttime = this.review_video.currentTime;

    let reviewCommentModal = document.getElementById('reviewCommentModal');
    if (reviewCommentModal) {
      reviewCommentModal.style.display = 'block';
    }
  }

  //Method while using review comment
  AddReviewComment(target, val) {
    //When Adding review then getting end time
    this.endtime = this.review_video.currentTime;

    //hiding modal
    if (target) target.style.display = 'none';

    //clearing text area
    this.model.CommentText = "";

  }

  closeModal(target) {
    if (target) target.style.display = 'none';
  }

  // Function for get request details.
  getRequestDetails() {
    this.RefRequestID = Number(localStorage.getItem('RefRequestID'));
    
    return this.http
    .get(`${environment.domainApi}RefRequest/GetRefRequestByID?RefRequestID=` + this.RefRequestID).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {
        this.companyname = res[0]['RequesterBusiness'];
        this.EngagementName = res[0]['EngagementName'];
        this.requestername = res[0]['RequesterName'];

        this.AccountManager = res[0]['AccountManager'];
        this.EngagementTitle = res[0]['EngagementTitle'];
        this.EngagementChallange = res[0]['EngagementChallange'];
        this.EngagementSolution = res[0]['EngagementSolution'];
        this.EngagementResult = res[0]['EngagementResult'];
        this.RefRequestID = res[0]['RefRequestID'];
        this.RequesterID = res[0]['RequesterID'];
        this.EngagementAreaName = res[0]['EngagementAreaName'];
        this.IndustryName = res[0]['IndustryName'];
        this.SubIndustryName = res[0]['SubIndustryName'];

        //Added this to draw the engagment area details
        this.vendor_Org = res[0]['AccountManagerCompany'];
        this.engagment_type = res[0]['EngagementType'];
        this.engagment_category = res[0]['EngagementCategorys'];
        this.softwarevendor = res[0]['EngagementTypeVendor'];
        this.itsoftware = res[0]['ITSoftware'];
        this.engagment_other = res[0]['EngagementTypeOther'];

        this.EngagementDateFrom = String(res[0]['StrEngagementDateFrom']).split('T')[0];
        this.EngagementDateTo = String(res[0]['StrEngagementDateTo']).split('T')[0];
        this.Range = res[0]['Range'];
        if (res[0]['IsInterviewScheduled'] == true) {
          this.ScheduleDT = String(res[0]['ScheduledInterviewDate']).split('T')[0];
          this.ScheduleTime = String(res[0]['ScheduledInterviewDate']).split('T')[1];
          this.RestrictedUseCheck = res[0]['RestrictedUse'];
          if (res[0]['ReferenceTypeName'] == "") {
            this.ReferenceTypeName = "Video";
          } else { this.ReferenceTypeName = res[0]['ReferenceTypeName']; }
        }
      }
    });

  }

  onSubmit() {
    //showing loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Recording request is being accepted...';

    this.model.RefRequestID = Number(localStorage.getItem('RefRequestID'));
    this.model.ReviewerID = localStorage.getItem('ReviewerUserID');
    this.model.AuthorID = localStorage.getItem('ReviewerUserID');
    this.model.IsApproved = true;
    this.model.ApprovalDT = new Date().toLocaleDateString();

    return this.http
    .put(`${environment.domainApi}RefRequestReviewer/UpdateRefRequestReviewerApproval`, this.model).subscribe(res=>{
      
      if (res[0]['ResponseStatus'] == 'Success') {
        setTimeout(() => {
          this.router.navigateByUrl('/reviewer/reviewercatalog');
          //hiding loader after login
          this.appcmp.showLoader = false;
          //this._notificationservice.success("Recording request accepted.");
        }, 2000);

      }
    });

  }

  // Method for add comment in req recording.
  AddComment() {
    let comment_obj: any = {};

    comment_obj.RefRequestID = Number(localStorage.getItem('RefRecordingID'));
    comment_obj.CommentBy = this.UserID;
    comment_obj.CommentText = this.model.CommentText;
      
    return this.http
    .post(`${environment.domainApi}Comments/InsertComments`, comment_obj).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {
        //this._notificationservice.success("Comment has been saved successfully.");
      } else {
        //this._notificationservice.error("Error: Comment has not been saved. Please try again.");
      }
    });
  }


  //Method will gets call on comment button click
  onComment() {
    //this.review_video = document.getElementById('review_video');

    //this.starttime = this.review_video.currentTime;
    //console.log(this.review_video, this.starttime);
  }


  //Method to convert seconds in minute
  secondsToMinutes(time) {
    if (time) {
      let m = Math.floor(time / 60);
      let s = Math.floor(time % 60);
      let minute = m > 9 ? m : "0" + m;
      let second = s > 9 ? s : "0" + s;
      return minute + ':' + second;
    }
  }

  //Enable overflow tab content
  enableTab(e, tabcontent) {

    let target, t_attr;

    //scrolling content on top
    if (tabcontent) tabcontent.scrollTop = 0;

    if (e) t_attr = e.getAttribute('href');

    if (t_attr == '#notestab' || t_attr == '#searchtab') {

      if (tabcontent) tabcontent.style.overflow = 'hidden';
    } else {
      if (tabcontent) tabcontent.style.overflow = 'auto';
    }
  }

  //Method to enable the focus when click
  enableFocus() {
    let notes_review;

    notes_review = document.getElementById('notes_review');

    //updatenotes is false because, when you click on edit button but you did not upadated and now you are going to add new notes
    this.updatenotes = false;
    this.notesbtn = "Add";
    this.model.NoteText = '';

    if (notes_review) notes_review.focus();

    //check the length
    this.checkTextLength(true);
  }

  //for checking the tab number
  switchTab(tabno) {
    this.whichTab = tabno;
    if (tabno == 1) {

    } else if (tabno == 2) {

    }
  }


  //opening modal popUp for rating
  /*EnableTab() {

    if (this.valuationCode == 1) {
      let standard = document.getElementById('standard');
      if (standard) standard.classList.remove('disabled_over');
    } else {
      let custom = document.getElementById('custom');
      if (custom) custom.classList.remove('disabled_over');
    }
  }*/

  /*DO NOT REMOVE*/
  /*onVideoSwitch(target) {
    let url, current_url;

    //if (e && e.target) target = e.target;
    if (target) {
      url = target.getAttribute('url');
      current_url = target.getAttribute('currenturl');

      if (target.classList.contains('sidebyside') && this.review_video) {
        this.review_video.setAttribute('src', current_url);
        target.classList.remove('sidebyside');
      } else if (this.review_video) {
        this.review_video.setAttribute('src', url);
        target.className += ' sidebyside';
      }

    }
  }*/

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
      //.post(`${environment.domainApi}/Messages/InsertMessages`, content).subscribe(res=>{
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

  //method for play and pause video preview
  /*playPauseRecording() {
    //this.review_video = document.getElementById('review_video');
    if (this.review_video) {
      if (this.review_video.paused && this.ReplayCount != 0 && this.hitcount == 0) {
        this.hitcount = 1;
        if (!this.review_video.hasAttribute("controls")) this.review_video.setAttribute('controls', 'controls');
        setTimeout(function () {
          this.review_video.play();

          //Now updating the replay count
          this.updateTheReplayCount();
        }, 500); 
      }
    }

  }

  //Method to update the replay count
  updateTheReplayCount() {
    let revobj: any = {};
    revobj.RefRequestID = Number(localStorage.getItem('RefRequestID'));
    revobj.UserID = Number(localStorage.getItem('UserID'));

    this.recordingcatalogservice.replayCount(revobj).subscribe(res => {
      success => console.log("Replay count added", this.res);

      this.ReplayCount = res[0]['ReplayCount'];

    }, (error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }*/

  //Method to get the all notes
  getMyNotes() {
    //hiding loader after login
    this.appcmp.showLoader = true;

    let notesObj: any = {};

    notesObj.AddedUserID = Number(localStorage.getItem('LoginUserID'));
    notesObj.RefRecordingID = this.RefRecordingID;
    
    return this.http
    .post(`${environment.domainApi}I2BNotes/GetRecordingRequestNotes`, notesObj).subscribe(res=>{
      //getting response object's key data length 
      let data = Object.keys(res).length;

      if (data && res[0]['ResponseStatus'] == 'Success') {
        this.noteslist = res;
        //hiding loader after login
        this.appcmp.showLoader = false;

      } else {
        this.noteslist = [];
        //hiding loader after login
        this.appcmp.showLoader = false;
      }
    });

  }

  //Method to add notes
  AddMyNotes(NoteText) {
    let notesObj: any = {};

    //showing loader after login
    this.appcmp.showLoader = true;

    if (this.updatenotes) {

      this.appcmp.loadermessage = 'Notes is being updated...';
      
      return this.http
      .put(`${environment.domainApi}I2BNotes/UpdateUserNote`, this.model).subscribe(res=>{
        //getting response object's key data length 
        let data = Object.keys(res).length;

        if (data && res[0]['ResponseStatus'] == 'Success') {
          //Method to get the all notes
          this.getMyNotes();

        } else {
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });

    } else {

      notesObj.AddedUserID = Number(localStorage.getItem('LoginUserID'));
      notesObj.RefRecordingID = this.RefRecordingID;
      notesObj.NoteText = NoteText;

      this.appcmp.loadermessage = 'Notes is being added...';
      
      return this.http
      .post(`${environment.domainApi}I2BNotes/InsertUserNote`, notesObj).subscribe(res=>{
        //getting response object's key data length 
        let data = Object.keys(res).length;

        if (data && res[0]['ResponseStatus'] == 'Success') {
          //Method to get the all notes
          this.getMyNotes();

        } else {
          //hiding loader after login
          this.appcmp.showLoader = false;
        }
      });
    }

  }


  //Method to cancel the update notes
  notesEditCancel(e) {
    let target, target_id;

    if (e && e.target) target = e.target;
    if (target) target_id = target.id;

    if (target_id == 'addnotesModal' || target_id == 'cancel_notes' || target_id == 'reviewModal') {

      this.model = {};
      this.updatenotes = false;
      this.notesbtn = "Add";

      //check the length
      this.checkTextLength(true);
    }
  }

  //Method to remove the notes
  NotesRemove() {

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Notes is being removed...";
    
    return this.http
    .put(`${environment.domainApi}I2BNotes/DeleteUserNote`, this.NotesObj).subscribe(res=>{
      //Once service completed then drawing bookmark
      this.getMyNotes();
      //hiding loader after login
      //this.appcmp.showLoader = false;
    });

  }

  //Method to confirm delete
  deleteConfirm(note) {

    this.NotesObj = note;
  }

  //Method to edit notes
  NotesEdit(notes) {
    let notes_review;

    notes_review = document.getElementById('notes_review');
    if (notes_review) notes_review.value = notes.NoteText;

    this.model.NoteID = notes.NoteID;
    this.model.NoteText = notes.NoteText;

    this.updatenotes = true;
    this.notesbtn = "Update";

    //Check the length
    this.checkTextLength(false);
  }

  //Method to check the character length
  checkTextLength(check) {
    let charLength_nots, charLength_book, notes_maxlength, book_maxlength, bookmark_text, notes_review, book_character_check, notes_character_check;

    notes_review = document.getElementById("notes_review");

    if (notes_review && check) notes_review.value = "";

    notes_character_check = document.getElementById("notes_character_check");

    if (notes_review) notes_maxlength = parseInt(notes_review.getAttribute("maxlength"));

    if (notes_review) charLength_nots = notes_review.value.length;

    if (notes_character_check) notes_character_check.innerText = "Characters left: " + (notes_maxlength - charLength_nots);

  }

  //Method to read the question by computer
  onQuestionReading(element, index, q_text, readbtn, RecordingStatus,quesID) {

    let pausebtn;
    if (RecordingStatus == 'Skipped') this.IsSkipped = true;
    if (index) pausebtn = document.getElementsByClassName('pausebtn_' + index)[0];

    this.review_video = document.getElementById('review_video');

    if (readbtn && readbtn.innerText == 'Read') {
      //this._initSpeech();

      //removing the already selcted question
      this.removeSelectedQuestion('question');

      this.getQuestionScript(this.RefRecordingID, quesID);

      element = document.getElementsByClassName('question_' + index)[0];
      //highlight the active question
      if (element) {
        element.className += ' active_data';
        if (element.firstElementChild) element.firstElementChild.className += ' active_data';
        //this.getQuestionScript(RefReqId, qid);
      }


      if (this.review_video) {
        this.review_video.pause();
        let id:any = localStorage.getItem('AssignedID');
        if(id) id = Number(id);
        
        let url = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+id+'_'+index+'.mp4';
        this.review_video.setAttribute('src', url);

        //this.review_video.setAttribute('src', this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.mp4');
        /*check video*/
        /*if (this.review_video) {
          //let url = this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.mp4';
          let id = localStorage.getItem('AssignedID');
          let url = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+id+'_'+index+'.mp4';
          this.review_video.setAttribute('src', url);
          let vid_obj: any = {};

          vid_obj.RefRecordingID = this.RefRecordingID;
          vid_obj.FileName = index + '.mp4';

          if (vid_obj) {
                         
            return this.http
            .post(`${environment.domainApi}/RecordRTC/CheckMP4Videos`, vid_obj).subscribe(res=>{
              
              //getting response object's key data length 
              let data = Object.keys(res).length;

              if (res[0]['ResponseStatus'] == 'Success' && res[0]['Message'] == 'Is Exist') {
                //this.review_video.setAttribute('src', this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.mp4');
                let url = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+id+'_'+index+'.mp4';
                this.review_video.setAttribute('src', url);

                //this.speech.cancel();
                //Method to set Pause to all if any
                //this.setPauseText(true);
                //if (this.review_video.paused) this.review_video.play();
              } else {
                vid_obj.FileName = index + '.webm';

                if (vid_obj) {
                                
                  return this.http
                  .post(`${environment.domainApi}/RecordRTC/CheckMP4Videos`, vid_obj).subscribe(res=>{
                    //getting response object's key data length 
                    let data = Object.keys(res).length;

                    if (res[0]['ResponseStatus'] == 'Success' && res[0]['Message'] == 'Is Exist') {
                      this.review_video.setAttribute('src', this.domain_url + 'uploads/' + this.RefRecordingID + '/' + index + '.webm');

                      //this.speech.cancel();
                      //Method to set Pause to all if any
                      //this.setPauseText(true);
                      //if (this.review_video.paused) this.review_video.play();
                    } else {
                      if (RecordingStatus == 'Skipped') this.IsSkipped = true;
                      else this.IsSkipped = false;
                      (<any>$('#inprogressModal')).modal('show');
                    }
                  });
                  
                }
              }
            });
          }
        }*/

        this.voice_text = q_text;
        readbtn.innerText = 'Stop';
        if (readbtn.classList.contains('btn-primary')) {
          readbtn.classList.remove('btn-primary');
        }
        readbtn.className += ' btn-danger';
        //this.textarea = element as HTMLElement;
        this.playSpeechText(this.speech);

        //if (readbtn) readbtn.setAttribute('disabled', 'true');
        this.read_btn = readbtn;
        //Method to set Pause to all if any
        //this.setPauseText(false);

        //if (pausebtn) pausebtn.removeAttribute('disabled');
      }
    } else if (readbtn && readbtn.innerText == 'Stop') {
      if (this.review_video) this.review_video.pause();
      readbtn.innerText = 'Read';
      if (readbtn.classList.contains('btn-danger')) {
        readbtn.classList.remove('btn-danger');
      }
      readbtn.className += ' btn-primary';
      //this.onPauseRecording();
      this.speech.cancel()

      if (this.review_video) {
        this.review_video.pause();
      }
      //this.stopSpeechText(this.speech);

      //if (pausebtn) pausebtn.addAttribute('disabled', 'true');
    }

  }

  setPauseText(bool) {
    //let pausebtn = document.getElementsByClassName('pausebtn');
    let readbtn = document.getElementsByClassName('readbtn');
    /*
    if (pausebtn && pausebtn.length > 0) {
      for (let i = 0; i < pausebtn.length; i++) {
        if (pausebtn[i]) {
          (pausebtn[i] as HTMLButtonElement).innerText = 'Pause';
          //if (bool && !pbtn) pausebtn[i].setAttribute('disabled', 'true');
        }
      }
    }*/
    let a = (this.speech) ? this.speech.pending() : null;

    if (readbtn && readbtn.length > 0) {
      for (let i = 0; i < readbtn.length; i++) {
        let b = (this.speech) ? this.speech.speaking() : null;
        if (b) {

          if (readbtn[i]) {
            if (this.read_btn != readbtn[i]) {
              (readbtn[i] as HTMLButtonElement).innerText = 'Read';
              if (readbtn[i].classList.contains('btn-danger')) {
                readbtn[i].classList.remove('btn-danger');
              }
              readbtn[i].className += ' btn-primary';
            }
          }
        } else {
          if (readbtn[i]) {
            //if (this.read_btn != readbtn[i]) 
            (readbtn[i] as HTMLButtonElement).innerText = 'Read';
            if (readbtn[i].classList.contains('btn-danger')) {
              readbtn[i].classList.remove('btn-danger');
            }
            readbtn[i].className += ' btn-primary';
            //else if (this.read_btn) this.read_btn.innerText = 'Stop';
            //if (bool && !pbtn) pausebtn[i].setAttribute('disabled', 'true');
          } else {
            //if (readbtn[i] && !bool) (readbtn[i] as HTMLButtonElement).innerText = 'Stop';
          }
        }
      }
    }
  }

  //Method to stop the reading question by computer
  onStopQuestionReading(element, index, elm) {

    //this.onPauseRecording();
    if (elm && elm.innerText == 'Pause') {
      elm.innerText = 'Resume';
      this.onPauseRecording();
    } else if (elm && elm.innerText == 'Resume') {
      elm.innerText = 'Pause';
      this.onPauseRecording();
    }
  }

  //joyride module for tour
  //tour() {
  //  this.joyrideService.startTour(
  //    { steps: ['firstStep', 'secondStep'] }
  //  );
  //}

  //Method to start the play
  /*onStartPlay(review_video) {
    //console.log("start");
    
    if (this.IsFirstScriptLoad) {
      if (this.review_video) {
        this.review_video.pause();
      }
      return false;
    }

    let readbtn = document.getElementsByClassName('readbtn');
    if (readbtn.length > 0) {
      //this.IsVideoStart = true;
      for (let i = 0; i < readbtn.length; i++) {
        if (readbtn[i] && !readbtn[i].classList.contains('playing')) {
          readbtn[i].className += ' playing';
          let status = (readbtn[i] as HTMLButtonElement).getAttribute('status');
          if (status == 'Skipped' || status == 'Not recorded') (readbtn[i + 1] as HTMLButtonElement).click();
          else (readbtn[i] as HTMLButtonElement).click();
        }
        return false;
      }
    }
  }*/

  //Method to start the play
  /*onVideoPause(review_video) {
    //console.log("pause");
  }*/

  //Method to detect the video has been finished
  onVideoEnd(review_video) {
    //this.IsVideoStart = false;
    console.log("end playing");
    //console.log("end");
    /*let readbtn = document.getElementsByClassName('readbtn');
    if (readbtn.length > 0 && this.IsVideoStart) {
      for (let i = 0; i < readbtn.length; i++) {
        if (readbtn[i] && !readbtn[i].classList.contains('playing')) {
          readbtn[i].className += ' playing';

          let status = (readbtn[i] as HTMLButtonElement).getAttribute('status');

          if (status == 'Skipped' || status == 'Not recorded') {
            if (readbtn[i + 1]) (readbtn[i + 1] as HTMLButtonElement).click();
          } else {
            (readbtn[i] as HTMLButtonElement).click();
          }
          
          if (readbtn.length == i+1) {
            let playallbtn = document.getElementById('playall-button');
            if (playallbtn) {
              playallbtn.innerText = 'Play All with Question';
              if (playallbtn.classList.contains('btn-danger')) {
                playallbtn.classList.remove('btn-danger');
              }
              playallbtn.className += ' btn-primary';
            }
          }

          return false;
        }
      }
    }*/

    if (this.IsVideoStart) {
      let active_q = document.getElementsByClassName('question_div active_data')[0], parent, p_next, readbtn;
      if (active_q) parent = active_q.parentElement;
      if (parent) p_next = parent.nextElementSibling;
      if (p_next) readbtn = p_next.getElementsByClassName("readbtn")[0];

      if (readbtn) readbtn.click();
    }

  }
  

  //method for getting Script...
  getQuestionScript(rid, qid) {
    //return false;
    if (qid && rid) {
      let transcriptObj = { RefRecordingID: rid, RecordingQuestionID: qid };

      return this.http
      .post(`${environment.domainApi}/I2BRecordingRequest/GetQuestionTranScript`, transcriptObj).subscribe(res=>{
         // getting response object's key data length 
        let data = Object.keys(res).length;

        if (data > 0 && res[0]['ResponseStatus'] == 'Success') {

         
          this.ans = res[0]['RecordingAnsScript'];

          let transcript = document.getElementsByClassName('transcript')[0], searchpara;
          if (transcript && this.ans) {
            transcript.innerHTML = this.ans;
            searchpara = transcript.innerHTML;
            searchpara = searchpara.toString();

            this.IsFirstScriptLoad = false;
            //Now embed the seched text to highlight
            //this.highlight(this.searchkeyword);

            //Method to highlight the answer text which was searched
            this.highlightText(searchpara);

            //Method to highlight the answer text which was searched
          } else if (transcript) transcript.innerHTML = "Script not available.";

        }
      });

    }
  }

  //Method to highlight the searched text
  highlight(text) {
    var inputText = document.getElementsByClassName("transcript")[0];
    var innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      innerHTML = innerHTML.substring(0, index) + "<span class='highlighter'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
      inputText.innerHTML = innerHTML;
    }
  }

  //Method to play the video
  videoPlay(e, review_video, playbtn) {
    //this.IsVideoStart = false;
    this.speech.cancel();


    if (playbtn && playbtn.innerText == 'Play') {

      if (this.review_video.paused) {
        this.review_video.play();
      }
    }
    /*let playallbtn = document.getElementById('playall-button');
    if (playallbtn) {
      playallbtn.innerText = 'Play All with Question';
      if (playallbtn.classList.contains('btn-danger')) {
        playallbtn.classList.remove('btn-danger');
      }
      playallbtn.className += ' btn-primary';
    }*/
  }

  //Method to start the video play
  onStartPlay(review_video) {
    //this.IsVideoStart = false;
    this.speech.cancel();

    if (this.review_video && this.review_video.paused) {
      this.review_video.play();
    }

    /*let playallbtn = document.getElementById('playall-button');
    if (playallbtn) {
      playallbtn.innerText = 'Play All';
      if (playallbtn.classList.contains('btn-danger')) {
        playallbtn.classList.remove('btn-danger');
      }
      playallbtn.className += ' btn-primary';
    }*/

  }

  //Method to switch autoplay
  onAutoplay(e) {
    let target;

    if (e && e.target) {
      target = e.target;

      if (target.checked) {
        this.IsVideoStart = true;
      } else {
        this.IsVideoStart = false;
      }

      console.log("val", this.IsVideoStart);
    }
  }

  //Method to play all video simultaniously
  videoPlayAll(e, review_video, playallbtn) {
    let active_q = document.getElementsByClassName('question_div active_data')[0], parent, p_next, readbtn;
    if (active_q) p_next = active_q.nextElementSibling;
    if (p_next) readbtn = p_next.getElementsByClassName("readbtn")[0];

    if (readbtn) readbtn.click();

    /* if (this.IsVideoStart) {
       this.IsVideoStart = false;
     } else {
       this.IsVideoStart = true;
     }*/
     /*
     if (playallbtn && playallbtn.innerText == 'Play All with Question') {
       this.speech.cancel();
       //If video is playing then pause it
       if (review_video) review_video.pause();

       //console.log("start");

       //if (this.IsFirstScriptLoad) {
       //  if (this.review_video) {
       //    this.review_video.pause();
       //  }
       //  return false;
       //}

       let readbtn = document.getElementsByClassName('readbtn');
       if (readbtn.length > 0) {
         this.IsVideoStart = true;
         playallbtn.innerText = 'Stop Playing';
         if (playallbtn.classList.contains('btn-primary')) {
           playallbtn.classList.remove('btn-primary');
         }
         playallbtn.className += ' btn-danger';

         for (let i = 0; i < readbtn.length; i++) {
           if (readbtn[i] && !readbtn[i].classList.contains('playing')) {
             readbtn[i].className += ' playing';
             let status = (readbtn[i] as HTMLButtonElement).getAttribute('status');
             if (status == 'Skipped' || status == 'Not recorded') (readbtn[i + 1] as HTMLButtonElement).click();
             else (readbtn[i] as HTMLButtonElement).click();
           }
           return false;
         }
       }
     } else if (playallbtn && playallbtn.innerText == 'Stop Playing') {
       this.IsVideoStart = false;

       this.speech.cancel();
       //If video is playing then pause it
       if (review_video) review_video.pause();

       playallbtn.innerText = 'Play All with Question';
       if (playallbtn.classList.contains('btn-danger')) {
         playallbtn.classList.remove('btn-danger');
       }
       playallbtn.className += ' btn-primary';

       let readbtn = document.getElementsByClassName('readbtn');
       if (readbtn.length > 0) {
         for (let i = 0; i < readbtn.length; i++) {
           if (readbtn[i] && readbtn[i].classList.contains('playing')) {
             readbtn[i].classList.remove('playing');
           }
         }
       }

     }*/

  }
  
//opening modal popUp for rating
  EnableRatingTab() {
    this.GetRatedValue(this.RefRecordingID);
    /*if (this.valuationCode == 1) {
      let standard = document.getElementById('standard');
      if (standard) standard.classList.remove('disabled_over');
    } else {
      let custom = document.getElementById('custom');
      if (custom) custom.classList.remove('disabled_over');
    }*/
  }
  
  GetRatedValue(reqid) {
    let uid = Number(localStorage.getItem('LoginUserID'));
    
    return this.http
    .get(`${environment.domainStageApi}Valuation/GetValuationsByUser?RefRequestID=` + reqid + `&UserID=` + uid).subscribe(res=>{
       //getting response object's key data length 
      let data = Object.keys(res).length;
      if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
                
        this.defaultrate = Number(res[0]['ValuationScore']);
        this.valuationCode = res[0]['ValuationType'];
        
        if (this.valuationCode == 1) {
          this.stan_rate = res[0]['ValuationScore'];
          this.model.ratingClicked = Number(res[0]['ValuationScore']);
          //this.items[0]['rating'] = Number(res[0]['ValuationScore']);
          this.rating = Number(res[0]['ValuationScore']);
          this.model.valuationText = res[0]['ValuationComment'];
        } else {
          this.paraText = res[0]['ValuationScore'];
          this.model.customvaluationText = res[0]['ValuationComment'];
        }
      }
    });

  }
  
  //Method to calculate the total weight %
  TotalPercent(val) {

    let num1 = (this.num1 == undefined) ? 0 : this.num1;
    let num2 = (this.num2 == undefined) ? 0 : this.num2;
    let num3 = (this.num3 == undefined) ? 0 : this.num3;
    let num4 = (this.num4 == undefined) ? 0 : this.num4;
    let num9 = (this.num9 == undefined) ? 0 : this.num9;

    this.total = num1 + num2 + num3 + num4 + num9;

    this.multiplication();
  }
  
  //Method to multiply the weight % and score
  multiplication() {
    
    this.sumofRating();

    this.multi = (this.num5 != undefined && this.num5 < 6) ? ((this.num1 != undefined) ? (this.num1 * this.num5) / 100 : 0) : 0;
    this.multi1 = (this.num6 != undefined && this.num6 < 6) ? ((this.num2 != undefined) ? (this.num2 * this.num6) / 100 : 0) : 0;
    this.multi2 = (this.num7 != undefined && this.num7 < 6) ? ((this.num3 != undefined) ? (this.num3 * this.num7) / 100 : 0) : 0;
    this.multi3 = (this.num8 != undefined && this.num8 < 6) ? ((this.num4 != undefined) ? (this.num4 * this.num8) / 100 : 0) : 0;
    this.multi4 = (this.num10 != undefined && this.num10 < 6) ? ((this.num9 != undefined) ? (this.num9 * this.num10) / 100 : 0) : 0;

    this.multiSum = (this.multi + this.multi1 + this.multi2 + this.multi3 + this.multi4);
    
    if (this.multiSum) {
      // this.paraText = Math.floor(this.multiSum);  JSR-SP
      this.paraText = this.multiSum; 
    } else {
      this.paraText = '';
    }

  }

  //method to add the weighted score and show rating
  TotalRating(e) {
    this.multiplication();
  }
  
  //Method to calculate the total score as per weight %
  sumofRating() {
    let num5 = (this.num5 == undefined) ? 0 : this.num5;
    let num6 = (this.num6 == undefined) ? 0 : this.num6;
    let num7 = (this.num7 == undefined) ? 0 : this.num7;
    let num8 = (this.num8 == undefined) ? 0 : this.num8;
    let num10 = (this.num10 == undefined) ? 0 : this.num10;

    this.sum = (num5 + num6 + num7 + num8 + num10);
  }
  
  //to clear the rating data
  clearRatedValue() {
    if (this.whichTab == 1) {
      this.model.ratingClicked = "";
      this.model.valuationText = "";
      this.items = [{ 'rating': 0 }];
    } else if (this.whichTab == 2) {
      this.items = [{ 'rating': 0 }];
      this.model.customvaluationText = "";
    }
    let standard = document.getElementById('standard');
    let custom = document.getElementById('custom');
    if (custom) custom.classList.remove('disabled_over');
    if (standard) standard.classList.remove('disabled_over');
    this.paraText = '';
    this.stan_rate = 0;
  }
  
  // method for add Comments
  addComments(model) {
    
    let paraText, paraTextval;

    //this.RefRequestID = Number(localStorage.getItem('RefRequestID'));
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.model.RefRequestID = this.RefRecordingID;
    this.model.UserID = this.UserID;

    //showing loader after click save
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Thank-you, valuation rating is being saved...';

    if (this.whichTab == 1) {
      this.model.ValuationScore = model.ratingClicked;
      this.model.ValuationComment = model.valuationText;
      this.model.ValuationType = 1;
    } else if (this.whichTab == 2) {
      this.model.ValuationScore = this.paraText;
      this.model.ValuationComment = model.customvaluationText;
      this.model.ValuationPointScore = this.paraText;
      this.model.ValuationType = 2;
    }

    //This is the default field which need to pass
    this.model.ShareInstruction = "";
    this.paraText = "";

    return this.http
    .post(`${environment.domainApi}Valuation/InsertValuationDetails`, this.model).subscribe(res=>{
       //getting response object's key data length 
      //let data = Object.keys(res).length;
      if (this.whichTab == 1) {
        this.model.ratingClicked = "";
        this.model.valuationText = "";
        //this.items = [{ 'rating': 0 }];
        this.rating = 0;

      } else if (this.whichTab == 2) {
        this.items = [{ 'rating': 0 }];
        this.model.customvaluationText = "";
      }

      //Now, again updating the UI
      this.GetRatedValue(this.RefRecordingID);
      //showing loader after click save
      this.appcmp.showLoader = false;
    });
    
  }
  
  //Method to reply the recording
  replayInterviewNow(e, index){
    if(index) {
      //let video_elm = document.getElementsByTagName('video')[0];
      let video_elm = document.getElementsByClassName('recording_player')[0];
      let replay = document.getElementsByClassName('replay_'+index)[0];
      let ext;
      //console.log("elm", replay);
      if(video_elm) {
        this.reviewRecording(e, index, 'request');
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
  reviewRecording(e, index, type) {
    let domainApi, recording_player, req_id, vtype, check_url;

    req_id = this.RefRecordingID;
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
      
      xhr.send();
    }*/
   
    //if(recording_player)
    (<any>$('#recordingPlayerModel')).modal('show');
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
  
  //method to enter rating on start click for standard valuation
  /*RatingClick(event, ratingval) {
    // this.rating = 1;
    console.log(ratingval, event);
    //debugger
     if (this.rating) {
       //this.model.ratingClicked = this.rating;
       this.model.ratingClicked = this.rating  ;
     } else {
 
     }
  }*/
  
  //method to enter rating on start click for standard valuation
  RatingClick(event,ratingval) {
    if (ratingval) {
      this.model.ratingClicked = ratingval;
    }
  }

  
  //method to enter rating on input text keyup for standard valuation
  RatingSet(e): void {
    let ratingValue;
    ratingValue = e.target.value;
    this.rating = ratingValue;

    //this.ratingClick.emit({
    //  //itemId: this.itemId,
    //  rating: rating
    //});

  }
  

}
