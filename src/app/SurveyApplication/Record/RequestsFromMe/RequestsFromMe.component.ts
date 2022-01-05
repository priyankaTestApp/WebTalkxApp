import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Requests-from-me',
  templateUrl: './RequestsFromMe.component.html',
  styleUrls: ['./RequestsFromMe.component.css']
})
export class RequestsFromMeComponent implements OnInit {
  title: string;
  public show_dialog: boolean = false;
  public UserID: number;
  public user_record: any = [];
  public catalog_record: any = [];
  today: Date;
  model: any = {}
  //form: FormGroup;
  recording_length: number;
  RecordingRequestList: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  sender_id: number;
  receiver_id: number;
  full_name: string;

  RequesterFirstName: string;
  //RequesterID: string;
  authername: string;
  autherID: string;
  GiverName: string;
  projectName: string;
  autheremail: string;
  startdate: string;
  enddate: string;
  GiverID: string;
  GiverLinkedIn: string;
  GiverEmailID: string;
  GiverFirstName: string;
  GiverSecondName: string;
  //RequesterLastName: string;
  //RecordingTitle: string;
  //Instructions: string;
  RecordingStatus: string;

  askedbyemail: string;
  requestdate: string;
  //requestfinishdate: string;
  questionList;
  ReplayConsent: string;
  RecordingObj: any;
  //isChecked: boolean;
  //RequestTitle: string;
  webtakxtype:string = 'Compliance';
  video_url:string;
  WelcomePageRequired:boolean = false;
  JobDescription:string;
  autherlinkedin:string;
  skipenable:boolean;
  rpaenable:boolean;
  participanttype:string;
  webtalkxtype:string;
  phonenumber:string;
  introvideo:boolean;
  surveyanonymous:boolean;
  description:string;
  welcomemessage:string;
  Documents:string;
  customwelcomepage:string;
  uploadlogo:string;
  organization:string;
  manager:string;
  reviewteamemail:string;
  meetingname:string;
  hiring_count:number;
  survey_count:number;
  reference_count:number;
  offline_count:number;
  marketresearch_count:number;
  compliance_count:number;
  employeesurvey_count:number;
  security_count:number;
  vendormanagement_count:number;
  
  @ViewChild('Reference', { static: false }) reference_div: ElementRef;
  @ViewChild('MarketResearch', { static: false }) marketresearch_div: ElementRef;
  @ViewChild('Offline', { static: false }) offline_div: ElementRef;
  @ViewChild('Hiring', { static: false }) hiring_div: ElementRef;
  @ViewChild('Security', { static: false }) survey_div: ElementRef;
  @ViewChild('EmployeeSurvey', { static: false }) employeesurvey_div: ElementRef;
  @ViewChild('VendorManagement', { static: false }) vendormanagement_div: ElementRef;
  @ViewChild('Offline', { static: false }) security_div: ElementRef;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    //this.title = "Reference recordings | " + appcmp.title;
    this.title = appcmp.title + " | Requests From Me";
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizefilterDialog();
    };

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
    //Get open request count
   

    //Method to set the dialog height as per the window height
    this.resizefilterDialog();

    this.sender_id = Number(localStorage.getItem('UserID'));
    this.model.WebtalkxType = 'Compliance';

    this.GetOpenRequestCount();

    //Method to get the recording list
    //this.takeinterviewservice.GetRefRequestDetails();
    this.GetReferenceRecording();
  }

  //method to get data from user-catalog common componet using @Output
  getReplayData(val) {
    this.video_url = val;
    if (val) {
      (<any>$('#recordingPlayerModel')).modal('show');
    }
    
  }
    //we are taking data from recording-catalog-type common componet using @Output
  receiveChildData(data) {
    console.log(data);
    this.webtakxtype = data;
    this.GetOpenRequestCount();

    //Method to get the recording list
    //this.takeinterviewservice.GetRefRequestDetails();
    this.GetReferenceRecording();
  }

  sendDataToParent(data) {
   
   // console.log(data);
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

  //Method to select the webtalk type
  selectWebTalkType(element, type){
    this.webtakxtype = type;

    let webtalkx_type = document.getElementsByClassName('webtalkx_type');

    if (webtalkx_type) {
      for (let i = 0; i < webtalkx_type.length; i++) {
        if (webtalkx_type[i] && webtalkx_type[i].classList.contains('active-block')) {
          webtalkx_type[i].classList.remove('active-block');
          webtalkx_type[i].classList.remove('bg-blue');
        }
      }
    }

    if (element && !element.classList.contains('active-block')) element.className += ' active-block bg-blue';
    //Now updating the request list
    this.RecordingRequestList = [];
    this.GetReferenceRecording();
    
  }

  //Method to get the participant list
  GetOpenRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';
    
    return this.http
      .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmission_OpenRequestCountFromMe?UserID=`+ this.UserID+`&Status=Open`).subscribe(res=>{
      
      if (res["length"] > 0) {
                
        if (res[0]['ResponseStatus'] == 'Success') {

          this.hiring_count = res[0]["Hiring_Count"];
          this.marketresearch_count = res[0]["MarketResearch_Count"];
          this.reference_count = res[0]["Reference_Count"];
          this.security_count = res[0]["Security_Count"];
          this.compliance_count = res[0]["Compliance_Count"];
          this.employeesurvey_count = res[0]["EmployeeSurvey_Count"];
          this.vendormanagement_count = res[0]["VendorManagement_Count"];
          this.offline_count = res[0]["OfflineMeeting_Count"];   
                   
          //If single request count is 0 then directly select the multiple but check, multiple should have also a value
          if(this.compliance_count == 0) {
            if(this.reference_count > 0) {
              this.model.WebtalkxType = 'Reference';
              let elm = this.reference_div.nativeElement;
              if(elm) elm.click();
            } else if(this.marketresearch_count > 0) {
              this.model.WebtalkxType = 'Market Research';
              let elm = this.survey_div.nativeElement;
              if(elm) elm.click();             
            } else if(this.offline_count > 0) {
              this.model.WebtalkxType = 'Offline Meeting';
              let elm = this.offline_div.nativeElement;
              if(elm) elm.click();
            }
            else if(this.hiring_count > 0) {
              this.model.WebtalkxType = 'Hiring';
              let elm = this.hiring_div.nativeElement;
              if(elm) elm.click();
            }
            else if(this.vendormanagement_count > 0) {
              this.model.WebtalkxType = 'Vendor Management';
              let elm = this.vendormanagement_div.nativeElement;
              if(elm) elm.click();
            }
            else if(this.security_count > 0) {
              this.model.WebtalkxType = 'Security';
              let elm = this.security_div.nativeElement;
              if(elm) elm.click();
            } else if(this.employeesurvey_count > 0) {
              this.model.WebtalkxType = 'Employee Survey';
              let elm = this.employeesurvey_div.nativeElement;
              if(elm) elm.click();
            }
          } else {
            this.model.WebtalkxType = 'Compliance';
          }      
          
        } else {
          this.hiring_count = null;
          this.marketresearch_count = null;
          this.reference_count = null;
          this.offline_count = null;  
          this.compliance_count = null;  
          this.employeesurvey_count = null;  
          this.security_count = null;  
          this.vendormanagement_count = null;
        }
      } else {
        this.hiring_count = null;
        this.marketresearch_count = null;
        this.reference_count = null;
        this.offline_count = null;     
        this.compliance_count = null;  
        this.employeesurvey_count = null;  
        this.security_count = null;  
        this.vendormanagement_count = null;             
      }
    });

  }
  
  //Method to get the participant list
  /*GetOpenRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';
    
    return this.http
      .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmission_OpenRequestCountFromMe?UserID=`+ this.UserID+`&Status=Open`).subscribe(res=>{
      
      if (res["length"] > 0) {
                
        if (res[0]['ResponseStatus'] == 'Success') {

          this.hiring_count = res[0]["Hiring_Count"];
          this.survey_count = res[0]["Survey_Count"];
          this.reference_count = res[0]["Reference_Count"];
          this.offline_count = res[0]["OfflineMeeting_Count"];
          
          //If single request count is 0 then directly select the multiple but check, multiple should have also a value
          if(this.hiring_count == 0) {
            if(this.reference_count > 0) {
              let elm = this.reference_div.nativeElement;
              if(elm) elm.click();
            } else if(this.survey_count > 0) {
              let elm = this.survey_div.nativeElement;
              if(elm) elm.click();
              this.model.WebtalkxType = 'Survey';
            } else if(this.offline_count > 0) {
              let elm = this.offline_div.nativeElement;
              if(elm) elm.click();
              this.model.WebtalkxType = 'Offline Meeting';
            }
          }
          
        } else {
          this.hiring_count = null;
          this.survey_count = null;
          this.reference_count = null;
          this.offline_count = null;          
        }
      } else {
        this.hiring_count = null;
        this.survey_count = null;
        this.reference_count = null;
        this.offline_count = null;                  
      }
    });

  }*/

  //Method to get the recording list
  GetReferenceRecording() {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading recording requests...';

    let reqObj: any = {};
    reqObj.AuthorID = this.UserID;
    
    return this.http
    .get(`${environment.domainApi}FinalSubmission/GetFinalSubmissionRequestFromMe?UserID=` + this.UserID + `&WebTalkxTypeName=` + this.webtakxtype + `&Status=Open`).subscribe(res=>{
    //.get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmissionWebTalkxDetails?AuthorID=` +  this.UserID + `&WebTalkxTypeName=` + this.webtakxtype).subscribe(res=>{
      if (res["length"] > 0) {
        this.recording_length = res["length"];
        if (res[0]['ResponseStatus'] == 'Success') {

          this.RecordingRequestList = res;
          //this.checklist = this.RecordingRequestList;

          let data_filter = this.RecordingRequestList.filter(element => element.FinalStatus.trim() != 'Finished');
          //let data_filter = this.RecordingRequestList.filter(element => (element.RecordingStatus.trim() == 'Open' || element.RecordingStatus.trim() == 'Draft' || (element.RecordingStatus.trim() == 'Finished' && element.Convertedflag.trim() == 'False')));

          if (data_filter.length > 0) {
            this.RecordingRequestList = data_filter;
            this.checklist = this.RecordingRequestList;
            
            //Now initiating datatable
            this.loadDataTable();
          } else {
            this.RecordingRequestList = [];
          }

          //hiding loader
          this.appcmp.showLoader = false;
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


  // Method for start intriview
  startInterview($event, RefRecordingID, request) {
    //showing loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Interview is preparing...';

    if (RefRecordingID) {
      let fullname: string = request.RequesterFirstName +' '+ request.RequesterLastName;
      localStorage.setItem('RefRecordingID', RefRecordingID);
      localStorage.setItem('requesterName', String(fullname));
      localStorage.setItem('requesterId', String(request.RequesterID));
      localStorage.setItem('RecordOption', '2');
      localStorage.setItem('CatalogOption', '2');
      localStorage.setItem('requesterMsg', request.Instructions);

      this.router.navigateByUrl('/I2BApplication/I2BHost');
    } else {
      //hiding loader after login
      this.appcmp.showLoader = false;
    }
  }

  //Method to remove the notes
  RecordingRemove() {

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Recording is being removed...";
    
    return this.http
    .put(`${environment.domainStageApi}I2BRecordingRequest/DeleteQuestionFromUserQuestionnare`, this.RecordingObj).subscribe(res=>{
      
      if (res[0]['ResponseStatus'] == 'Success') {
        //this._notificationservice.success("Password updated successfully. You need to log in again.");
       
          this.router.navigateByUrl('/Login');
       
        //hiding loader after login
        this.appcmp.showLoader = false;
      }
      else {
        //this._notificationservice.error("Current password is wrong.");
        //hiding loader after login
        this.appcmp.showLoader = false;
      }
    });

  }

  //Method to confirm delete
  deleteConfirm(recordings) {

    this.RecordingObj = recordings;
  }

  //Method to check and uncheck all message and notification
  checkUncheckAll(e) {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //Method to check and uncheck single message and notification
  isAllSelected() {

    this.masterSelected = this.checklist.every(function (message: any) {
      return message.isSelected == true;
    });

    this.getCheckedItemList();
  }

  //Method to check and uncheck final object of message and notification
  getCheckedItemList() {
    this.checkedList = [];

    for (let i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    //this.checkedList = JSON.stringify(this.checkedList);

    //now enabling the delete icon if data is selected
    this.enableDisableDeleteIcon();

  }

  //Method to enable and disable the delete icon
  enableDisableDeleteIcon() {

    let deletebtn = document.getElementById('row-delete-btn');
    if (this.checkedList.length > 0) {
      if (deletebtn) deletebtn.removeAttribute('disabled');
    } else {
      if (deletebtn) deletebtn.setAttribute('disabled', 'true');
    }
  }

  //Method to check the selected recording delete
  archiveRecording() {
    let recordingid;
    if (this.checkedList.length > 0) {
      for (let recording of this.checkedList) {
        recordingid = recording['RefRequestID'];

        if (recording) {
          //hiding loader after login
          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Recording is being removed...';
          this._recordingDeleteConfirm(recording);
        }
      }
    }
  }

  //Method to remove the selected recording
  _recordingDeleteConfirm(recording) {

    //console.log("Removing Mes", msgid);
    //recording = JSON.stringify(recording);
    
    return this.http
    .put(`${environment.domainApi}ReferenceGiver/InsertReferenceGiver`, recording).subscribe(res=>{
      
      //Once service completed then drawing recording
      this.GetReferenceRecording();

      //hiding loader after login
      this.appcmp.showLoader = false;
      //this._notificationservice.success("Recording removed successfully...");
    });
  }

  //Method to select individual row
  getSelectedRowInfo(recordings, id, e) {

    let target = e.target, input_ele;
    e.preventDefault();
    e.stopPropagation();

    //Added hack to open model to show the company details
    (<any>$('#catalogdetailsmodel')).modal('show');

    let r_id = recordings['ID'];
    let email = recordings['EmailID'];

    if (r_id == id) {

      //Now getting question
      this.getQuestion(id, email);

      this.catalog_record = recordings;
      //this.user_record = user;

      this.authername = recordings['AuthorName'];
      this.autherID = recordings['AuthorID'];
      this.autheremail = recordings['AuthorEmailID'];
      this.autherlinkedin = recordings['AuthorLinkedInID'];
      if (this.autherlinkedin && (this.autherlinkedin.indexOf('https') == -1 || this.autherlinkedin.indexOf('http') == -1)) {
        this.autherlinkedin = 'https://' + this.autherlinkedin;
      }

      this.GiverID = recordings['UserID'];
      this.GiverLinkedIn = recordings['LinkedIn'];
      if (this.GiverLinkedIn && (this.GiverLinkedIn.indexOf('https') == -1 || this.GiverLinkedIn.indexOf('http') == -1)) {
        this.GiverLinkedIn = 'https://' + this.GiverLinkedIn;
      }
      this.GiverEmailID = recordings['EmailID'];
      this.GiverName = recordings['FirstName'] +' ' + recordings['LastName'];
      this.phonenumber = recordings['PhoneNumber'];
      
      this.projectName = recordings['ProjectName'];
      this.meetingname = recordings['MeetingName'];
      this.RecordingStatus = recordings['FinalStatus'];
      this.requestdate = recordings['InsertDate'];
      this.startdate = recordings['StartDate'];
      this.enddate = recordings['EndDate'];
      this.WelcomePageRequired = recordings['WelcomePageRequired'];
      this.JobDescription = recordings['JobDescription'];
      this.Documents = recordings['Documents'];
      this.customwelcomepage = recordings['CustomWelcomePage'];
      this.uploadlogo = recordings['UploadLogo'];
      this.organization = recordings['Organisation'];
      this.manager = recordings['Manager'];
      this.reviewteamemail = recordings['ReviewTeamMemberEmailID'];
      this.welcomemessage = recordings['WelcomeMessage'];
      this.description = recordings['Description']
      this.surveyanonymous = recordings['KeepSurveyAnonymous'];
      this.introvideo = recordings['IntroVideo'];
      this.webtalkxtype = recordings['WebTalkxRecordingType'];
      this.participanttype = recordings['ParticipantType']
      this.rpaenable = recordings['RPAEnable'];
      this.skipenable = recordings['SkipEnable'];

    }
  }

  //Method to get the user info like id, name
  getUserInfo(e, id, f_name) {
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
    this.full_name = f_name;
  }

  //Method to send the message to the user
  sendMessage(senderid, receiverid, usertextmsg) {

    let value, content: any = {}, msgcontainer;
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
        //console.log(res);
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

  //method to get the all the question
  getQuestion(rid, email) {
    //this.RefRequestID
    if (rid) {
      let ReferenveObj: any = {};
      //let email = localStorage.getItem('EmailID');

      ReferenveObj.RefRecordingID = rid;
      ReferenveObj.EmailID = email;
      
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionList = res;
          } else {
            this.questionList = [];
          }
        } else {
          this.questionList = [];
        }
      });
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
    if(element && !element.classList.contains('active-block')) element.className += ' active-block bg-blue';

  }
  
  // Method for start intriview
  startRecording($event, recording_id, request) {
    //showing loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Interview is preparing...';

    if (recording_id) {
      //let fullname: string = request.AutherName;
      localStorage.setItem('RefRecordingID', recording_id);
      localStorage.setItem('requesterName', String(request.AutherName));
      localStorage.setItem('requesterId', String(request.ID));
      localStorage.setItem('RecordOption', '2');
      localStorage.setItem('CatalogOption', '2');
      //localStorage.setItem('requesterMsg', request.Instructions);

      this.router.navigateByUrl('/I2BApplication/I2BHost');
    } else {
      //hiding loader after login
      this.appcmp.showLoader = false;
    }
  }
  
  //Method to remove the recording requests
  removeRecordingRequest() {

    const recordObj = {
      ID: this.RecordingObj,
      AuthorID: this.UserID
    }

    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Recording request is being removed...";
    
    //I2BRecordingRequest/DeleteRecordingRequest
    return this.http
    .put(`${environment.domainApi}FinalSubmission/DeleteFinalSubmissionWebTalkxDetails`, recordObj).subscribe(res=>{
      if (res[0]['ResponseStatus'] == 'Success') {

        //this._notificationservice.success("Recording request deleted successfully.");
        this.RecordingObj = null;

        //Now reload the grid
        this.GetReferenceRecording();

        //hidding loader icon
        this.appcmp.showLoader = false;
      }
    });

  }
  
  //Method to stop the video playing
  stopVideoPlayer(recording_player) {
    if(recording_player) recording_player.pause();
  }
  
  //recordingPlayerModel
  replayInterviewNow(e, index, type) {
    let domainApi, recording_player, req_id, vtype, check_url;

    req_id = this.catalog_record['ID'];
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

}
