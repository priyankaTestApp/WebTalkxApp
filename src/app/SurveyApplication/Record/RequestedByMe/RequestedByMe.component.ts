import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserCatalogModalComponent } from '../../CommonComponent/user-catalog-modal/user-catalog-modal.component';

@Component({
  selector: 'app-RequestedByMe',
  templateUrl: './RequestedByMe.component.html',
  styleUrls: ['./RequestedByMe.component.css']
})
export class RequestedByMeComponent implements OnInit {
  public catalog_record:any = [];
  public user_record:any= [];

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
 
  askedbyemail: string;
  requestdate: string;
  requestfinishdate: string;
  RecordingObj: any;
  ReplayConsent: string;
  questionList;
  RequestTitle: string;
  RefRecordingID;
  webtakxtype: string = 'Compliance';
  video_url: string;
  WelcomePageRequired: boolean = false;
  JobDescription: string;
  singleParticipantList: any;
  multipleParticipantList: any;
  participantList: any;
  autherlinkedin: string;
  skipenable: boolean;
  rpaenable: boolean;
  participanttype: string;
  webtalkxtype: string;
  phonenumber: string;
  introvideo: boolean;
  surveyanonymous: boolean;
  description: string;
  welcomemessage: string;
  Documents: string;
  customwelcomepage: string;
  uploadlogo: string;
  organization: string;
  manager: string;
  reviewteamemail: string;
  meetingname: string;
 
  hiring_count: number;
  survey_count: number;
  reference_count: number;
  offline_count: number;
  single_count: number;
  multiple_count: number;
  marketresearch_count: number;
  compliance_count: number;
  employeesurvey_count: number;
  security_count: number;
  vendormanagement_count: number;

  showReplay: boolean;
  @ViewChild('Reference', { static: false }) reference_div: ElementRef;
  @ViewChild('MarketResearch', { static: false }) marketresearch_div: ElementRef;
  @ViewChild('Offline', { static: false }) offline_div: ElementRef;
  @ViewChild('Hiring', { static: false }) hiring_div: ElementRef;
  @ViewChild('Security', { static: false }) survey_div: ElementRef;
  @ViewChild('EmployeeSurvey', { static: false }) employeesurvey_div: ElementRef;
  @ViewChild('VendorManagement', { static: false }) vendormanagement_div: ElementRef;
  @ViewChild('Offline', { static: false }) security_div: ElementRef;


  constructor(private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, private titleService: Title, private appcmp: AppComponent, private toastr: ToastrService) {
    //this.title = "Reference recordings | " + appcmp.title;
    this.title = appcmp.title + " | Requests By Me";

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
    //this.toastr.success('Added successfully', 'Success');
    //Added below code to update the title
    this.titleService.setTitle(this.title);
    this.today = new Date();
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.RefRecordingID = Number(localStorage.getItem('RefRecordingID'));
    //    this.startSteps();

    //this.tour();

    //Method to set the dialog height as per the window height
    this.resizefilterDialog();
    //Get open request count
    this.GetOpenRequestCount();

    //now call to get the participant type clount
    this.GetparticipantTypeRequestCount();

    //Method to get the recording list
    //this.takeinterviewservice.GetRefRequestDetails();
    this.GetReferenceRecording();

    this.sender_id = Number(localStorage.getItem('UserID'));

    //this.joyrideService.closeTour();
    this.model.WebtalkxType = 'Compliance';
    this.model.ParticipantType = 'Single Participant';
  

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
    //now call to get the participant type clount
    this.GetparticipantTypeRequestCount();

    //Method to get the recording list
    this.GetReferenceRecording();
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

 

  //Method to get the participant list
  GetOpenRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';

    return this.http
      .get(`${environment.domainStageApi}/FinalSubmission/GetFinalSubmission_OpenRequestCount?UserID=` + this.UserID + `&Status=Open`).subscribe(res => {

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
            if (this.compliance_count == 0) {
              if (this.reference_count > 0) {
                this.model.WebtalkxType = 'Reference';
                let elm = this.reference_div.nativeElement;
                if (elm) elm.click();
              } else if (this.marketresearch_count > 0) {
                this.model.WebtalkxType = 'Market Research';
                let elm = this.survey_div.nativeElement;
                if (elm) elm.click();
              } else if (this.offline_count > 0) {
                this.model.WebtalkxType = 'Offline Meeting';
                let elm = this.offline_div.nativeElement;
                if (elm) elm.click();
              }
              else if (this.hiring_count > 0) {
                this.model.WebtalkxType = 'Hiring';
                let elm = this.hiring_div.nativeElement;
                if (elm) elm.click();
              }
              else if (this.vendormanagement_count > 0) {
                this.model.WebtalkxType = 'Vendor Management';
                let elm = this.vendormanagement_div.nativeElement;
                if (elm) elm.click();
              }
              else if (this.security_count > 0) {
                this.model.WebtalkxType = 'Security';
                let elm = this.security_div.nativeElement;
                if (elm) elm.click();
              } else if (this.employeesurvey_count > 0) {
                this.model.WebtalkxType = 'Employee Survey';
                let elm = this.employeesurvey_div.nativeElement;
                if (elm) elm.click();
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
  // GetOpenRequestCount() {

  //   //showing loader
  //   //this.appcmp.showLoader = true;
  //   //this.appcmp.loadermessage = 'Loading participants...';

  //   return this.http
  //     .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmission_OpenRequestCount?UserID=`+ this.UserID+`&Status=Open`).subscribe(res=>{

  //     if (res["length"] > 0) {

  //       if (res[0]['ResponseStatus'] == 'Success') {

  //         this.hiring_count = res[0]["Hiring_Count"];
  //         this.survey_count = res[0]["Survey_Count"];
  //         this.reference_count = res[0]["Reference_Count"];
  //         this.offline_count = res[0]["OfflineMeeting_Count"];

  //         //If single request count is 0 then directly select the multiple but check, multiple should have also a value
  //         if(this.hiring_count == 0) {
  //           if(this.reference_count > 0) {
  //             let elm = this.reference_div.nativeElement;
  //             if(elm) elm.click();
  //           } else if(this.survey_count > 0) {
  //             let elm = this.survey_div.nativeElement;
  //             if(elm) elm.click();
  //             this.model.WebtalkxType = 'Survey';
  //           } else if(this.offline_count > 0) {
  //             let elm = this.offline_div.nativeElement;
  //             if(elm) elm.click();
  //             this.model.WebtalkxType = 'Offline Meeting';
  //           }
  //         }

  //       } else {
  //         this.hiring_count = null;
  //         this.survey_count = null;
  //         this.reference_count = null;
  //         this.offline_count = null;          
  //       }
  //     } else {
  //       this.hiring_count = null;
  //       this.survey_count = null;
  //       this.reference_count = null;
  //       this.offline_count = null;                  
  //     }
  //   });

  // }

  //Method to get the participant type clount
  GetparticipantTypeRequestCount() {

    //showing loader
    //this.appcmp.showLoader = true;
    //this.appcmp.loadermessage = 'Loading participants...';

    return this.http
      .get(`${environment.domainStageApi}FinalSubmission/GetParticipantTypeCount?UserID=` + this.UserID + `&Status=Open&WebTalkxTypeName=` + this.webtakxtype).subscribe(res => {

        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {

            this.single_count = res[0]["Single_Count"];
            this.multiple_count = res[0]["Multiple_Count"];

            //If single request count is 0 then directly select the multiple but check, multiple should have also a value
            if (this.single_count == 0) {
              if (this.multiple_count > 0) this.model.ParticipantType = 'Multiple Participant';
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
    this.appcmp.loadermessage = 'Loading open requests...';

    let reqObj: any = {};
    reqObj.AuthorID = this.UserID;

    return this.http
      //.post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequest`, reqObj).subscribe(res=>{
      .get(`${environment.domainStageApi}FinalSubmission/GetFinalSubmissionWebTalkxDetails?AuthorID=` + this.UserID + `&WebTalkxTypeName=` + this.webtakxtype + `&Status=Open`).subscribe(res => {

        if (res["length"] > 0) {
          this.recording_length = res["length"];

          if (res[0]['ResponseStatus'] == 'Success') {

            this.RecordingRequestList = res;
            //this.checklist = this.RecordingRequestList;

            let data_filter = this.RecordingRequestList.filter(element => (element.FinalStatus.trim() == 'Open' && element.WebTalkxRecordingType.trim() == 'Single Recording'));
            let data_filter2 = this.RecordingRequestList.filter(element => ((element.FinalStatus.trim() == 'Open' || element.FinalStatus.trim() == 'Finished') && element.WebTalkxRecordingType.trim() == 'Group Recording'));

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

  //Method to get the participant list
  GetParticipant(refid) {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading participants...';

    return this.http
      .get(`${environment.domainStageApi}ParticipantInfo/GetParticipantInfoByRefRecordingID?RefRecordingID=` + refid + '&IsRecorded=false').subscribe(res => {

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
      .put(`${environment.domainApi}FinalSubmission/DeleteFinalSubmissionWebTalkxDetails`, recordObj).subscribe(res => {
        if (res[0]['ResponseStatus'] == 'Success') {

          //this._notificationservice.success("Recording request deleted successfully.");.
          this.toastr.success('Recording request deleted successfully.');
          this.RecordingObj = null;

          //Now reload the grid
          this.GetReferenceRecording();

          //hidding loader icon
          this.appcmp.showLoader = false;
        }
      });

  }

  //Method to confirm delete
  deleteConfirm(rid, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.RecordingObj = rid;
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
 
  //Method to remove the selected recording
  _recordingDeleteConfirm(recording) {

    //console.log("Removing Mes", msgid);
    //recording = JSON.stringify(recording);

    return this.http
      .put(`${environment.domainApi}ReferenceGiver/InsertReferenceGiver`, recording).subscribe(res => {

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

    //this.userCmp.showConfirmationFun1(recordings,user);

    let r_id = recordings['ID'];
    let email = recordings['EmailID'] || user['EmailID'];
    //this.router.navigate([], { state: { recordings: recordings } });
    if (r_id == id) {

      //Now getting question
      this.getQuestion(id, email);
      
      this.catalog_record = recordings ;
      this.user_record = user;
      //if (recordings) {
      //  this.catalog_record = recordings;
      //} else if(user) {
      //  this.catalog_record = user;
      //}
     

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
        .post(`${environment.domainApi}I2BMessages/InsertMessages`, content).subscribe(res => {

          this.model.usertextmsg = "";
          if (res[0]['ResponseStatus'] == 'Success') {

            //hiding loader after login
            this.appcmp.showLoader = false;
            this.appcmp.loadermessage = 'Please wait...';
            //this._notificationservice.success("Message has been sent successfully.");

          }
          else {
            //this._notificationservice.error("Current password is wrong.");
            //hiding loader after login
            this.appcmp.showLoader = false;
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

  //method to get the original request
  viewSelectedRequest(id) {

    if (id) {
      //localStorage.setItem('RefRecordingID', id);
      this.router.navigateByUrl('/I2BApplication/RecordingRequest/' + id);
    }
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
        .post(`${environment.domainApi}I2BRecordingRequest/GetRecordingRequestQuestions`, ReferenveObj).subscribe(res => {

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

  copyQuestionAcc(i, sampleInpt, elm) {
    //debugger;
    var copyText = sampleInpt;

    /* Select the text field */
    copyText.focus();
    copyText.select();

    document.execCommand("copy");
    //this._notificationservice.success("Copied to Clipboard.");
  }

  //Method to select the webtalkx type
  selectWebtalkxType(element, type) {
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

  }

  
  //Method to open description file
  openDescriptionFile(target, filename) {
    let domainApi = `${environment.domainApi}`;
    var split, ext, url, finalurl;
    split = filename.split('.')
    if (split) ext = split[1];
    if (ext) ext = ext.toLowerCase();
    //let url = domainApi+'upload1/'+filename;
    if (ext == 'pdf') {
      finalurl = domainApi + 'UserDocuments/' + filename;
    } else {
      //url = 'https://docs.google.com/viewer?url=https://stage.webtalkx.com/api/UserDocuments/VAISHNAVIPANDEY.docx';
      url = domainApi + 'UserDocuments/' + filename;
      finalurl = 'https://docs.google.com/viewer?url=' + url;
    }
    //url = domainApi+'UserDocuments/'+filename; 
    //finalurl = 'https://docs.google.com/viewer?url='+url;
    //console.log(finalurl);

    var newwindow = window.open(finalurl, 'WebTalkx', 'height=560,width=340');
    if (window.focus) { newwindow.focus() }
    return false;

    //if(filename) window.open(url, '_blank');

  }

}
