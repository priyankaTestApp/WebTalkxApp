import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Saved-requests',
  templateUrl: './SavedRequests.component.html',
  styleUrls: ['./SavedRequests.component.css']
})
export class SavedRequestsComponent implements OnInit {
  title: string;
  public show_dialog: boolean = false;
  public UserID: number;
  today: Date;
  model: any = {}
  form: FormGroup;
  recording_length: number;
  RecordingRequestList: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  RecordingObj: any;

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
  ReplayConsent: string;
  questionList;
  RequestTitle: string;
  webtakxtype:string = 'Compliance';
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
  WelcomePageRequired:string;
  JobDescription:string;
  meetingname:string;
  video_url:string;
   
  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    //this.title = "Reference recordings | " + appcmp.title;
    this.title = appcmp.title + " | Saved Requests";
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

    //Method to set the dialog height as per the window height
    this.resizefilterDialog();

    //Method to get the recording list
    this.GetReferenceRecording();
    this.model.WebtalkxType = 'Compliance';
    
    this.sender_id = Number(localStorage.getItem('UserID'));

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
  selectWebTalkType(type){
    this.webtakxtype = type;

    //Now updating the request list
    this.RecordingRequestList = [];
    this.GetReferenceRecording();
    
  }

  //Method to get the recording list
  GetReferenceRecording() {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading saved requests...';

    let reqObj: any = {};
    reqObj.RequesterID = this.UserID;
    this.UserID = this.UserID;
    
    return this.http
    //.post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequest`, reqObj).subscribe(res=>{
      .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmissionWebTalkxDetails?AuthorID=` +  this.UserID + `&WebTalkxTypeName=` + this.webtakxtype + `&Status=Saved Draft`).subscribe(res=>{
      
      if (res["length"] > 0) {
        this.recording_length = res["length"];
        
        if (res[0]['ResponseStatus'] == 'Success') {

          this.RecordingRequestList = res;
          //this.checklist = this.RecordingRequestList;

          let data_filter = this.RecordingRequestList.filter(element => element.FinalStatus.trim() == 'Saved Draft')

          if (data_filter.length > 0) {
            this.RecordingRequestList = data_filter;
            this.checklist = this.RecordingRequestList;
            //Now initiating data table
            this.loadDataTable();
            
            //hiding loader
            this.appcmp.showLoader = false;

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

  //Method to check and uncheck all recording
  checkUncheckAll() {
    for (let i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //Method to check and uncheck single recording
  isAllSelected() {
    this.masterSelected = this.checklist.every(function (message: any) {
      return message.isSelected == true;
    })
    this.getCheckedItemList();
  }

  //Method to check and uncheck final object of recording
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

  //Method to remove the selected recording
  _recordingDeleteConfirm(recording) {

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

    if (r_id == id) {

      //Now getting question
      this.getQuestion(id);

      this.catalog_record = recordings;
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
    content.MessageText = usertextmsg;
    content.SenderID = senderid;
    content.ReceiverID = receiverid;

    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Message is being sent...';

    if (usertextmsg) {      
      return this.http
      .post(`${environment.domainApi}I2BMessages/InsertMessages`, content).subscribe(res=>{
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

  //method to get the original request
  viewSelectedRequest(id) {

    if (id) {
      //localStorage.setItem('RefRecordingID', id);
      this.router.navigateByUrl('/I2BApplication/RecordingRequest/' + id);
    }
  }

  //method to get the all the question
  getQuestion(rid) {
    //this.RefRequestID
    if (rid) {
      let ReferenveObj: any = {};
      ReferenveObj.RefRecordingID = rid;
      
      return this.http
      .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res=>{
        if (res["length"] > 0) {
          
          if (res[0]['ResponseStatus'] == 'Success') {
            this.questionList = res;
          }
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
    domainApi = `${environment.videoapi}`;
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
    /*split = filename.split('.')
    if(split) ext = split[1];
    if(ext) ext = ext.toLowerCase();*/
    //let url = domainApi+'upload1/'+filename;
    /*if(ext == 'pdf') {
      url = domainApi+'UserDocuments/'+filename;  
    } else {
      url = 'https://docs.google.com/viewer?url=https://stage.webtalkx.com/api/UserDocuments/VAISHNAVIPANDEY.docx';
    }*/
    url = domainApi+'UserDocuments/'+filename; 
    finalurl = 'https://docs.google.com/viewer?url='+url;
    
     var newwindow = window.open(url,'WebTalkx','height=560,width=340');
     if (window.focus) {newwindow.focus()}
     return false;
    
    //if(filename) window.open(url, '_blank');

  }


}
