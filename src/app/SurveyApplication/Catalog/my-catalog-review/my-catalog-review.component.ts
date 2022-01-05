import { Component, OnInit, ViewChild,Input,Output,EventEmitter, ElementRef } from '@angular/core';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
//import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-catalog-review',
  templateUrl: './my-catalog-review.component.html',
  styleUrls: ['./my-catalog-review.component.css']
})
export class MyCatalogReviewComponent implements OnInit {
  title: string;
  public show_dialog: boolean = false;
  @Input() rating: number;
  @Output() valuationScore: EventEmitter<any> = new EventEmitter<any>();
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

  RequesterFirstName: string;
  RequesterID: string;
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
  RequesterLastName: string;
  RecordingTitle: string;
  Instructions: string;
  RecordingStatus: string;
  catalog_record: any;
  askedbyemail: string;
  requestdate: string;
  requestfinishdate: string;
  questionList;
  ReplayConsent: string;
  RecordingObj: any;
  isChecked: boolean;
  RequestTitle: string;
  webtakxtype:string = 'Compliance';
  video_url:string;
  WelcomePageRequired:boolean = false;
  JobDescription:string;
  isreviewdata: boolean = false;
  iscatalog_data: boolean = false;
  com_name: string;
  usersreview: any = {};
  domain: string;
  cmpdata: boolean = false;
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
  singleParticipantList:any;
  multipleParticipantList:any;
  participantList:any;
  reviewerlist:any = {};
  erroruser:string;
  reviewer_id:number;
  rewerUserform:any;
  refreqId:number;
  
  selected: any = '';
  Managererror: any = { isError: false, errorMessage: '' };
  Reviewer_val: string;
  ReviewerID: number;
  inputChanged: any = '';
  isActiveUser:boolean;
  keyword: string = 'EmailID';
  hiring_count:number;
  survey_count:number;
  reference_count:number;
  offline_count:number;
  single_count:number;
  multiple_count:number;
  marketresearch_count:number;
  compliance_count:number;
  employeesurvey_count:number;
  security_count:number;
  vendormanagement_count:number;
  tooltipVal:string;
  domainURL:any;
  domainCopyUrl:string;
  @ViewChild('Reference', { static: false }) reference_div: ElementRef;
  @ViewChild('MarketResearch', { static: false }) marketresearch_div: ElementRef;
  @ViewChild('Offline', { static: false }) offline_div: ElementRef;
  @ViewChild('Hiring', { static: false }) hiring_div: ElementRef;
  @ViewChild('Security', { static: false }) survey_div: ElementRef;
  @ViewChild('EmployeeSurvey', { static: false }) employeesurvey_div: ElementRef;
  @ViewChild('VendorManagement', { static: false }) vendormanagement_div: ElementRef;
  @ViewChild('Offline', { static: false }) security_div: ElementRef;
  
  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    //this.title = "Reference recordings | " + appcmp.title;
    this.title = appcmp.title + " | Reviewer Catalog";
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
    this.GetOpenRequestCount();
    
    //Method to get the recording list
    //this.takeinterviewservice.GetRefRequestDetails();
    this.GetReferenceRecording();

    //Method to set the dialog height as per the window height
    this.resizefilterDialog();

    this.sender_id = Number(localStorage.getItem('UserID'));
    this.model.WebtalkxType = 'Compliance';
    this.model.ParticipantType = 'Single Participant';
    this.domain = `${environment.domainApi}`;
    this.domainCopyUrl = `${environment.domainCopyUrl}`;
    this.domainURL = GlobalVariable.domainURL;
    //now call to get the participant type clount
    this.GetparticipantTypeRequestCount();
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
  /*selectWebTalkType(type){
    this.webtakxtype = type;

    //Now updating the request list
    this.RecordingRequestList = [];
    this.GetReferenceRecording();
    
  }*/

//Method to show the tooltip
outFunc() {
  var tooltip = document.getElementById("myTooltip"); 
  //var tooltip = document.getElementsByClassName("icon-copy_" + i)[0];
 // this.tooltipVal = "Copy secure url";
   tooltip.innerHTML = "Copy secure url";
 }


 //method to copy url
myFunction(data,index) {
    let urls: any = [], recordedby: any = [], titlearr: any = [],userID:any=[],emailID:any=[];

        let recordingid = (data['ID']) || (data['RefRecordingID']);
        console.log('id-----------------',recordingid)
        let fullname = (data['FirstName'] + ' ' + data['LastName']);
       
       let userId = data['UserID'] || data['GiverID'];
      
        let title= data['ProjectName'] || data['MeetingName'] ;
        let email = data['EmailID'];
       
        localStorage.setItem('AssignedEmail',email )
        if (recordingid) {
          urls.push(this.domainCopyUrl + '#/I2Breview/2r9QUFD/' + recordingid + '/' + userId + '/' + email);
        }

        if (fullname) recordedby.push(fullname);
        if (title && title != undefined) titlearr.push(title); else titlearr.push('');
        if (userId) userID.push(userId);
        if (email) emailID.push(email);

    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var input = document.createElement("textarea");
      input.className = ' clip-board';
      //input.textContent = urls.toString();

      if (urls.length > 0) {
        var b = '';
        for (var i = 0; i < urls.length; i++) {
          b += titlearr[i] + '\n' + 'Recorded By - ' + recordedby[i] + '\n' + urls[i] + '\n';
        }
        input.value = b;

      } else {
        input.value = urls.toString();
      }

      input.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      console.log("Copied data---------------", input.value);

      var tooltip = document.getElementById("myTooltip");
      //var tooltip = document.getElementsByClassName("icon-copy_" + index)[0];
      //tooltip.innerHTML = "Copied: " + input.value;
      if (input.value) {
        tooltip.innerHTML = "Secure URL copied";
       
        //this.tooltipVal = "Secure URL copied";
      } 
  }

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
    //now call to get the participant type clount
    this.GetparticipantTypeRequestCount();
    
    //get recording 
    this.GetReferenceRecording();
    
  }
  
  
  //Method to get the participant list
  GetOpenRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';
    
    return this.http
      .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmission_OpenRequestCountFromMe?UserID=`+ this.UserID+`&Status=Finished`).subscribe(res=>{
      
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
  
  //Method to get the participant type clount
  GetparticipantTypeRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';
    //+`&WebTalkxTypeName=`+this.webtakxtype
    return this.http
      .get(`${environment.domainStageApi}FinalSubmission/GetAssignedRequest_ParticipantTypeCount?UserID=`+ this.UserID+`&WebTalkxTypeName=`+this.webtakxtype).subscribe(res=>{
      
      if (res["length"] > 0) {
                
        if (res[0]['ResponseStatus'] == 'Success') {
          
          this.single_count = res[0]["Single_Count"];
          this.multiple_count = res[0]["Multiple_Count"];
          
          //If single request count is 0 then directly select the multiple but check, multiple should have also a value
          if(this.single_count == 0) {
            if(this.multiple_count > 0) this.model.ParticipantType = 'Multiple Participant';
            else this.model.ParticipantType = 'Single Participant';
          } else this.model.ParticipantType = 'Single Participant';
                    
        } else {
          this.single_count = null;
          this.multiple_count = null;
        }
      } else {
        this.single_count = null;
        this.multiple_count = null;                  
      }
    });

  }

  //Method to get the recording list
  GetReferenceRecording() {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading reviewer catalog...';

    let reqObj: any = {};
    reqObj.AuthorID = this.UserID;
    
    return this.http
    //.post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequest`, reqObj).subscribe(res=>{
      .get(`${environment.domainStageApi}RecordingRequest/GetAssignedRecordingRequestDetails?AssignedToID=` +  this.UserID + `&WebTalkxTypeName=`+this.webtakxtype).subscribe(res=>{
      //.get(`${environment.domainStageApi}RecordingRequest/GetAssignedRecordingRequestDetails`).subscribe(res=>{
      
      if (res["length"] > 0) {
        this.recording_length = res["length"];
        
        if (res[0]['ResponseStatus'] == 'Success') {

          this.RecordingRequestList = res;
          //this.checklist = this.RecordingRequestList;
          
          let data_filter = this.RecordingRequestList.filter(element => (element.WebTalkxRecordingType.trim() == 'Single Recording'));
          let data_filter2 = this.RecordingRequestList.filter(element => (element.WebTalkxRecordingType.trim() == 'Group Recording'));

          if (data_filter.length > 0 || data_filter2.length > 0) {
            //this.RecordingRequestList = data_filter;
            this.singleParticipantList = data_filter;
            this.multipleParticipantList = data_filter2;
            
            //this.checklist = this.RecordingRequestList;

            //Now initiating datatable
            this.loadDataTable();
            
          } else {
            //this.RecordingRequestList = [];
            this.singleParticipantList = [];
            this.multipleParticipantList = [];
          }

          //hiding loader
          this.appcmp.showLoader = false;
        } else {
          //this.RecordingRequestList = [];
          this.singleParticipantList = [];
          this.multipleParticipantList = [];

          //hiding loader
          this.appcmp.showLoader = false;
        }
      } else {
        //this.RecordingRequestList = [];
        this.singleParticipantList = [];
        this.multipleParticipantList = [];

        //hiding loader
        this.appcmp.showLoader = false;
      }
    });
  }


  // Method for start intrivie

  //Method to remove the notes
  RecordingRemove() {

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Question is being removed...";
    
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
  
  //Method to remove the recording requests
  removeRecordingRequest() {

    const recordObj = {
      ID: this.RecordingObj,
      AuthorID: this.UserID
    }

    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Recording catalog is being removed...";
    
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
  getSelectedRowInfo(recordings, id, e, user) {

    let target = e.target, input_ele;
    e.preventDefault();
    e.stopPropagation();

    //Added hack to open model to show the company details
    (<any>$('#catalogdetailsmodel')).modal('show');   

    let r_id = recordings['ID'];
    let email = recordings['EmailID'] || user['EmailID'];

    if (r_id == id) {

      //Now getting question
      this.getQuestion(id, email);

      this.catalog_record = recordings;
      this.authername = recordings['AuthorName'] || (recordings['RequesterFirstName']+' '+recordings['RequesterLastName']);
      this.autherID = recordings['AuthorID'] || recordings['RequesterID'];
      this.autheremail = recordings['AuthorEmailID'] || recordings['RequesterEmail'];
      this.autherlinkedin = recordings['AuthorLinkedInID'] || recordings['RequesterLinkedIn'];
      if (this.autherlinkedin && (this.autherlinkedin.indexOf('https') == -1 || this.autherlinkedin.indexOf('http') == -1)) {
        this.autherlinkedin = 'https://' + this.autherlinkedin;
      }

      this.GiverID = recordings['UserID'] || user['ParticipantID'];
      this.GiverLinkedIn = recordings['LinkedIn'] || user['LinkedIn'];
      if (this.GiverLinkedIn && (this.GiverLinkedIn.indexOf('https') == -1 || this.GiverLinkedIn.indexOf('http') == -1)) {
        this.GiverLinkedIn = 'https://' + this.GiverLinkedIn;
      }
      this.GiverEmailID = recordings['EmailID'] || user['EmailID'];
      if(recordings['FirstName'] || user['FirstName'] || recordings['LastName'] || user['LastName']) 
        this.GiverName = (recordings['FirstName'] || user['FirstName']) +' ' + (recordings['LastName'] || user['LastName']);
      else this.GiverName = '';
      
      this.phonenumber = recordings['PhoneNumber'] || user['PhoneNumber'];
      
      this.projectName = recordings['ProjectName'];
      this.meetingname = recordings['MeetingName'];
      this.requestdate = recordings['InsertDate'];
      this.RecordingStatus = recordings['FinalStatus'];
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
  replayRecording($event, recording_id, recordings) {
    let fullname: string;
    fullname = (recordings.RequesterFirstName || recordings.FirstName) + ' ' + (recordings.RequesterLastName || recordings.LastName);
    let email, id, record_name;

    record_name = recordings.ProjectName || recordings.MeetingName || recordings;

    // localStorage.setItem('RefRecordingID', RefRecordingID);
    localStorage.setItem('RefRecordingID', String(recording_id));
    localStorage.setItem('requesterName', String(recordings.AutherName));
    localStorage.setItem('requesterId', String(recordings.AutherID));
    localStorage.setItem('RecordingName', String(record_name));
    localStorage.setItem('English', 'upload1');
    localStorage.setItem('TestRecord', 'N');
    email = recordings.EmailID || recordings.AuthorEmailID;
    id = recordings.UserID || recordings.GiverID || recordings.AuthorID;
    localStorage.setItem('AssignedEmail', String(email));
    localStorage.setItem('AssignedID', String(id));
    
    //Redirecting on recording review page
    this.router.navigateByUrl('/I2BApplication/RecordingReview');
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
  
  //Method to get the all review and open the review model
  openReviewBox(id, event) {

    //id = 10180;
    id = id;
    event.preventDefault();
    event.stopPropagation();

    //enable review's modal data
    this.isreviewdata = true;
    this.iscatalog_data = false;
    this.com_name = 'Valuations';

    //Added hack to open model to show the company details
    (<any>$('#reviewmodel')).modal('show');

    //enable review's modal data
    this.isreviewdata = true;

    return this.http
      .get(`${environment.domainStageApi}Valuation/GetValuationsByRefRequest?RefRequestID=` + id).subscribe(res => {
        //getting response object's key data length 
        let data = Object.keys(res).length;

        if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
          //console.log("res", res[0]);
          this.usersreview = res;
          
          // to get star rating
          let valuationScore = res[0]['ValuationScore'];
          if (valuationScore) {         
            this.rating= valuationScore;
          }
          //this.setMoreAndLess();

          //using interval to get the length of element
          /*this.timeinterval = setInterval(() => {
            this.getUserOnHover();
          }, 100);*/
        } else {
          //disable review's modal data
          this.isreviewdata = false;
          this.usersreview = [];
        }
      });

  }
  
  //Method to get the participant list
  GetParticipant(refid, status) {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading participants...';
    let isrecorded:boolean;

    if(status == 'Open') isrecorded = false;
    else isrecorded = true;
    
    return this.http
      .get(`${environment.domainStageApi}ParticipantInfo/GetParticipantInfoByRefRecordingID?RefRecordingID=`+ refid+'&IsRecorded='+isrecorded).subscribe(res=>{
      
      if (res["length"] > 0) {
                
        if (res[0]['ResponseStatus'] == 'Success') {

          this.participantList = res;
          
          //hiding loader
          this.appcmp.showLoader = false;
        } else {
          this.participantList = [];
          //hiding loader
          this.appcmp.showLoader = false;
        }
      } else {
        this.participantList = [];
        //hiding loader
        this.appcmp.showLoader = false;
      }
    });

  }
  
  //method's for selection in autocomplete
  selectEvent(item) {
    this.selected = item;
    let select_f_name = this.selected.FirstName + ' ' + this.selected.LastName + ' (' + this.selected.EmailID + ')';
    //this.model.ReviewerID = select_f_name;

    this.model.ReviewerID = select_f_name;
    this.Reviewer_val = select_f_name;
    this.ReviewerID = this.selected.UserID;
    this.reviewer_id = this.selected.UserID;

    this.Managererror = { isError: true, errorMessage: ' ' };

  }
  
  //Method to create reviewer
  createReviewer(model) {

    let RevObj: any = {};
    RevObj.FirstName = model.FirstName;
    RevObj.LastName = model.LastName;
    RevObj.EmailID = model.Email;
    RevObj.UserID = this.UserID;

    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Reviewer is being created...';
    
    return this.http
    .post(`${environment.domainStageApi}I2B_Users/InsertReviewerDetails`, RevObj).subscribe(res=>{
      //getting response object's key data length 
      let data = Object.keys(res).length;

      if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
        //console.log("res", res[0]);
        this.appcmp.showLoader = false;

        if (res[0]['IsUserExist'] == 1) {
          this.erroruser = 'User already exists.'
        } else {
          let rid, email;
          rid = res[0]['UserID'];
          this.reviewer_id = res[0]['UserID'];
          email = RevObj.EmailID;

          this.model.ReviewerID = email;
          //this.model.ReviewerID = rid;
          //Added hack to open model to show the company details
          (<any>$('#reviewerModal')).modal('hide');

          //Now clear the field before adding new reviewer
          //this.createNewReviewer(this.rewerUserform);

          //Added hack to open model to show the company details
          (<any>$('#catalogShareModel')).modal('show');
          this.erroruser = '';

          //Method to create reviewer
          //this.getReviewerList();
        }

      } else {
        this.appcmp.showLoader = false
      }
    });

  }
  //Method to clear the field before adding new reviewer
  createNewReviewer(NewReviewerForm: NgForm) {
    /*this.model.FirstName = '';
    this.model.LastName = '';
    this.model.Email = '';*/
    this.erroruser = "";
    this.rewerUserform = NewReviewerForm;
    NewReviewerForm.reset();
  }

  //Method to create reviewer
  getReviewerList(recordingObj, ReqID, e) {
    e.preventDefault();
    e.stopPropagation();
    this.refreqId = ReqID;

    let recordingid, record_title;
    //debugger
    if (ReqID) {
      //Added hack to open model to show the company details
      (<any>$('#catalogShareModel')).modal('show');

      //for (let recording of this.checkedList) {
        recordingid = recordingObj['ID'];
        record_title = recordingObj['ProjectName'] || recordingObj['MeetingName'];
        this.model.ReviewTitle = record_title;

        if (recordingid) {

          let UserObj: any = {};
          UserObj.UserID = this.UserID;
          UserObj.RefRecordingID = recordingid;

          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Share with dropdown is being loaded...';
          
          return this.http
          .post(`${environment.domainStageApi}I2B_Users/GetUsersForReviewDDL`, UserObj).subscribe(res=>{
          
            //getting response object's key data length 
            let data = Object.keys(res).length;

            if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
              //console.log("res", res[0]);
              this.reviewerlist = res;

              //Method to select newely created user

              //if(rid) this.selectNewUser(rid);


              this.appcmp.showLoader = false;

            } else {
              this.reviewerlist = [];
              this.appcmp.showLoader = false
            }
          });
        }
      //}
    }

  }
  
  //method for change the search value
  onChangeSearch(val: string) {

    this.inputChanged = val;
  }

  //method for focus in autocomplete
  onFocused(e) {

    // do something when input is focused

  }

  //clear the message(error)
  clearEventStatic() {
    //this.model.AccountManager = '';
    this.Managererror = { isError: true, errorMessage: 'Share with is required.' };
  }
  
  //Method to send invitation
  sendRecordingInvitationToReviewer(model) {
    let recordingid, givername, requestername;

    if (this.refreqId) {
      //for (let recording of this.checkedList) {
        recordingid = this.refreqId;
        if (recordingid) {

          let RecordObj: any = {};
          let assignedToID = (this.reviewer_id) ? this.reviewer_id : model.ReviewerID.UserID;

          RecordObj.RefRecordingID = recordingid;
          RecordObj.AssignedToID = assignedToID;
          RecordObj.AssignedByID = this.UserID;
          RecordObj.AssignedTitle = model.ReviewTitle;
          RecordObj.SentMessage = model.ReviewMessage;
          //console.log("RecordObj", RecordObj, model);

          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Invitation is being sent to reviewer...';

          return this.http
          .post(`${environment.domainStageApi}I2BRecordingRequest/AssignedRequestToReviewer`, RecordObj).subscribe(res=>{
          
            //getting response object's key data length 
            let data = Object.keys(res).length;

            if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
              //console.log("res", res[0]);
              this.reviewerlist = res;
              //Method to clear the field
              this.clearInvitationField();

              this.appcmp.showLoader = false;
              //this._notificationservice.success("Invitation has been sent successfully.");

              //Added hack to open model to show the company details
              (<any>$('#catalogShareModel')).modal('hide');

            } else {
              this.reviewerlist = [];
              this.appcmp.showLoader = false
            }
          });
        }
      //}
    }
  }

  //Method to clear the invitation field
  clearInvitationField() {
    this.model.ReviewerID = '';
    this.model.ReviewTitle = '';
    this.model.ReviewMessage = '';
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
    if (Email && Email.length > 3 && Email.indexOf('@') > -1) {
      let obj: any = {};
      obj.EmailID = Email;

      return this.http
      .post(`${environment.domainStageApi}I2B_Users/GetUserDetailsByEmail`, obj).subscribe(res=>{
        if (res[0]['ResponseStatus'] == 'Success') {
          if (res && res["length"] > 0) {
            //res.forEach(el => {
              if (res[0]['EmailID'] === Email) {
                this.model.FirstName = res[0]['FirstName'];
                this.model.LastName = res[0]['LastName'];
              }
            //});
          }
        }
      });
    } else {
      this.model.FirstName = '';
      this.model.LastName = '';
    }
  }

}