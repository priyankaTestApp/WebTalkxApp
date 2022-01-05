import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Speech from 'speak-tts';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-SecureUrl',
  templateUrl: './SecureUrl.component.html',
  styleUrls: ['./SecureUrl.component.css']
})
export class SecureURLComponent implements OnInit {
  domainurl: any;
  review_video;
  endtime;
  model: any;
  UserID: number;
  textarea;
  API_url: string;
  RefRecordingID: number;
  speech;
  Isresume: boolean = true;
  IsReRecord: boolean = false;
  IsRecordingStarted: boolean = false;
  Isfinish: boolean;
  IsSave: boolean;
  rating: number;
  ratingClicked: number;
  itemIdRatingClicked: string;
  RefRequestID: number;
  updatenotes: boolean = false;
  notesbtn: string = "Add";
  noteslist: any = {};
  title: string;
  finalRate: number;
  video_url: string

  //array of object of rating
  items = [{ 'rating': 0 }];

  addForm: FormGroup;
  defaultrate: number;
  valuationScore: number;
  ValuationComment: string;
  ValuationScorePoints: number;
  ValuationPointWeight: number;
  ValuationPointScore: number;
  ValuationType: number;
  vendorname: string;
  givername: string;
  res: any;
  paraText: any;
  whichTab: number = 1;
  refGiverid: number;
  vendorID: number;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  valuationCode: number;
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
  vendor_Org: string;
  engagment_type: string;
  engagment_category: string;
  softwarevendor: string;
  itsoftware: string;
  engagment_other: string;
  ReplayCount: number = 0;
  hitcount: number = 0;
  ReqId: number;
  questionList;
  question_length: number = 0;
  requesterId: number;
  ReviewerID: number;
  timeinterval;
  m: number = 1;
  recording_title: string;
  read_btn;
  voice_text: string;
  IsVideoStart: boolean = false;
  ans;
  IsSkipped: boolean = false;
  search_questionList;
  timeintervals;
  questionscript: string = 'No script available.';
  searchkeyword: string;
  firstinterval;


  //new added
  user_id:number;
  domainCopyUrl:string;
  email_Id:string;
  IsFirstScriptLoad: boolean = false;
  recrdtype:string;
  recordingName:string;
  
  testrecord:string;

  constructor(private http: HttpClient, private appcmp: AppComponent, private router: Router, private route: ActivatedRoute, private titleService: Title) {

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      this.getvideoElementHeight();
    };

    this.appcmp.isSecure = false;
    this.appcmp.isSecureURL = true;
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

  ngOnInit() {

    this.domainurl = GlobalVariable.domainURL;
    //this.API_url = GlobalVariable.APIUrl;
    this.API_url = GlobalVariable.APIUrl;
    this.domainCopyUrl = `${environment.domainCopyUrl}`;
    //this.user_id = Number(localStorage.getItem('UserID'));
    this.domain_url = `${environment.domainApi}`;


    this.route.params.subscribe(routeParams => {
     
      if (routeParams && routeParams.id) {
        localStorage.setItem('RefRecordingID', routeParams.id);
        localStorage.setItem('GiverID', routeParams.userId);
        //localStorage.setItem('EmailID', routeParams.emailId);
        let rid = routeParams.id;
        let uid = routeParams.userId;
        let emailId = routeParams.emailId
       
        this.RefRecordingID = Number(rid);
        this.user_id  = uid;
        this.email_Id = emailId;
        console.log('emailid ----', this.email_Id)
      }
    });

     //calling to get the all interview question
     this.getQuestion(this.RefRecordingID);

     this.GetRecordingHeadline(this.RefRecordingID,this.user_id );

     //using interval to get the length of element
     this.timeinterval = setInterval(() => {
      this.getvideoElementHeight();
      //this.tour();
    }, 100);

     //Scrolling window on top at initial
      window.scroll(0, 0);

 
      this._initSpeech();

   
   
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






  //Enable overflow tab content
  enableTab(e, tabcontent) {
    let tabAttr;

    //scrolling content on top
    if (tabcontent) tabcontent.scrollTop = 0;

    if (e) tabAttr = e.getAttribute('href');

    if (tabAttr == '#notestab' || tabAttr == '#searchtab') {

      if (tabcontent) tabcontent.style.overflow = 'hidden';
    } else {
      if (tabcontent) tabcontent.style.overflow = 'auto';
    }
  }

  //Method to get the recording headlines
  GetRecordingHeadline(reqid,id) {
    // let refObj: any = {};
    // refObj.RefRecordingID = reqid;
    let refObj: any = {};
    //let id = localStorage.getItem('AssignedID');
    console.log('id-------------',id)
    refObj.RefRecordingID = reqid;
    refObj.GiverID = (id) ? Number(id) : null;

      return this.http
        .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestUserDetails`, refObj).subscribe(res=>{
          //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          if (res["length"] > 0) {
            if (res[0]['ResponseStatus'] == 'Success') {
              this.vendorname = res[0]['RequesterName'];
              this.givername = res[0]['GiverName'];
              this.refGiverid = res[0]['GiverID'];
              this.vendorID = res[0]['RequesterID'];
              this.interviewer = res[0]['Interviewer'];
              this.ReviewerID = res[0]['ReviewerID'];
              this.recording_title = res[0]['AssignedTitle'] || res[0]['Title'];
      
              this.title = this.appcmp.title + " | " + this.givername;
              this.titleService.setTitle(this.title);
      
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
              //hiding loader after login
              this.appcmp.showLoader = false;
            }
          }
        });
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
    //this.checkTextLength(true);
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
      //this.checkTextLength(true);
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
        //let id = localStorage.getItem('AssignedID');
        let URL = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+this.user_id+'_'+index+'.mp4';
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
    //let q_status = document.getElementsByClassName('q_status');

    if (type == 'search') questiontext = document.getElementsByClassName('question_search');
    if (type == 'question') questiontext = document.getElementsByClassName('question-text');

    if (questiontext && questiontext.length) {
      for (let i = 0; i < questiontext.length; i++) {
        if (questiontext[i].classList.contains('active_data')) questiontext[i].classList.remove('active_data');
      }
    }
    /*if (q_status.length && type == 'question') {
      for (let i = 0; i < q_status.length; i++) {
        if (q_status[i] && q_status[i].classList.contains('active_data')) q_status[i].classList.remove('active_data');
      }
    }*/
  }

  


  //method to get the all the question
  getQuestion(rid) {
    //this.RefRequestID
    if (rid) {
      // let ReferenveObj: any = {};
      // ReferenveObj.RefRecordingID = rid;

      let ReferenveObj: any = {};
      //let email:any = localStorage.setItem('AssignedEmail','');
    
      ReferenveObj.RefRecordingID = rid; 
      ReferenveObj.EmailID =  this.email_Id;
      
      return this.http
        .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
          //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          if (res["length"] > 0) {
            this.question_length = res["length"];
            if (res[0]['ResponseStatus'] == 'Success') {
              this.questionList = res;
              this.search_questionList = res;
              this._initSpeech();
              //Now update the question index
              this.setQuestionIndex();
            }
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
        if (rid && queId) this.getQuestionScript(rid, queId);
      }
      
    }, 100);
    
  }

  
  //Method to get the all notes
  getMyNotes() {
    //hiding loader after login
    this.appcmp.showLoader = true;

    let notesObj: any = {};

    notesObj.AddedUserID = Number(localStorage.getItem('LoginUserID'));
    notesObj.RefRecordingID = this.RefRecordingID;

     return this.http
     .post(`${environment.domainApi}I2BNotes/GetRecordingRequestNotes`, notesObj).subscribe(res=>{
       //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
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

  
  

  //Method to get the user info like id, name
  getUserInfo(e, id, f_name) {

    //If target is image tag then do not open message popup
    if (e && e.target && !e.target.classList.contains('icon-picture')) {
      this.receiver_id = id;
      this.full_name = f_name;

      e.preventDefault();
      e.stopPropagation();

      //Added check if logged in user is same as vendor
      (<any>$('#sendmsgmodel')).modal('show');
    }
  }

  //Method to calculate the video element height and set the questionaier section height
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
  
  //if(recording_player)
  (<any>$('#recordingPlayerModel')).modal('show');
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
        //if(id) id = Number(id);
        
        let url = this.domain_url + 'UserVideo/'+ this.RefRecordingID +'/record_'+ this.RefRecordingID+'_'+this.user_id+'_'+index+'.mp4';
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


  //Method to search the comments and notes
  keywordSearch(e, type) {

    let target, rid;
    if (e && e.target) target = e.target;

    rid = this.RefRecordingID;
    //Now removing selected question
    this.removeSelectedQuestion(type);
    //updating script
    //this.updatingScript();
    /*
    let transcript = document.getElementsByClassName('transcript')[0], searchpara;
    if (transcript) {
      searchpara = transcript.innerHTML;
      searchpara = searchpara.toString();

      //Method to highlight the answer text which was searched
      //this.highlightText(searchpara);
    }*/
    if (target.value && target.value.length >= 3) {
      this.searchkeyword = target.value;

      return this.http
        .get('${environment.domainApi}I2BRecordingRequest/SearchResult?SearchText=' + target.value + '&RefRequestID=' + rid).subscribe(res=>{
          
        if (res[0]['ResponseStatus'] == 'Success') {
          let SearchResultInQ = res[0]['SearchResultInQ'], qid, SearchResultInComment, bid;
          let bookmarkheader = document.getElementById('bookmark-header');
          SearchResultInComment = res[0]['SearchResultInComment'];

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
          if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);

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

  //Method to highlight the answer text which was searched
  highlightText(searchpara) {
    let text = this.searchkeyword;
    if (text) {
      let pattern = new RegExp("(" + text + ")", "gi");
      let new_text = searchpara.replace(pattern, "<span class='highlighter'>" + text + "</span>");
      document.getElementsByClassName('transcript')[0].innerHTML = new_text;
    }
  }


  //Method to get the all questions script
  getAllQuestionsScript(qid) {
    if (qid) {
      return this.http
        .get('${environment.domainApi}RequesterRecording/GetRecodingScriptByRefRequestID?RefRequestID=' + qid).subscribe(res=>{
          //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          //getting response object's key data length 
          let data = Object.keys(res).length;
          //getting transcript element
          let transcript = document.getElementsByClassName('transcript')[0];
          if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
            this.questionscript = res[0]['RecordingScript'];
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

  //Method to clear the search box
  clearSearch() {
    //using interval to get the length of element
    this.timeintervals = setInterval(() => {
      //clear input will check the value till blank
      this.clearInput();
    }, 100);
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

  clearInput() {

    let searchquestion = (<HTMLInputElement>document.getElementsByClassName('search-question')[0]), searchquestion_val;
    if (searchquestion) searchquestion_val = searchquestion.value;

    if (searchquestion_val == "") {
      if (this.timeintervals) clearInterval(this.timeintervals);


      //showing no content text
      this.noContentAvailable(false);
      //then getting all script
      //if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);
      if (this.RefRequestID) this.getAllQuestionsScript(this.RefRequestID);
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

    if (this.review_video.paused) {
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

    /*if (playallbtn && playallbtn.innerText == 'Play All with Question') {
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

}
