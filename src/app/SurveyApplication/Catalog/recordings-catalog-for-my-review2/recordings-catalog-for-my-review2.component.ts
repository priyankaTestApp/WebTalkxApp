import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyApplicationComponent } from '../../SurveyApplication.component';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-recordings-catalog-for-my-review2',
  templateUrl: './recordings-catalog-for-my-review2.component.html',
  styleUrls: ['./recordings-catalog-for-my-review2.component.css']
})
export class RecordingsCatalogForMyReview2Component implements OnInit {
  //@ViewChild('NewReviewerForm') public NewReviewerForm: NgForm;
  public NewReviewerForm: NgForm;

  title: string;
  model: any = {};
  UserID: number
  form: FormGroup;
  isListViewActive: boolean = true;
  isActiveUser: boolean;
  erroruser: string = '';

  IsUserExist: boolean;

  //dtOptions: DataTables.Settings = {};

  dtOptions: any = {};

  usersreview: any;
  input_arr;

  ReferenceGiverName: string;
  EngagementName: any;
  IndustryName: any;
  EngagemenAreatName: any;
  EngagementTitle: any;
  domainURL: string;

  showcomnyname: boolean = true;
  isChecked: boolean = false;
  showEngAreaNameColumn: boolean = true;
  showIndustryNameColumn: boolean = false;
  showEngTitleColumn: boolean = false;
  showEngSize: boolean = false;
  isList: boolean = true;
  allcheck: boolean = false;
  timeinterval;
  showengType: boolean = true;
  showengCat: boolean = true;
  showSoftSerVendor: boolean = true;
  others: boolean = true;
  itsoftware: boolean = true;

  vencontactcmp: boolean;
  showRecordDate: boolean;
  showGiverColumn: boolean;
  showEngNameColumn: boolean;
  showStatus: boolean;
  accountManager: boolean;
  showEngDate: boolean;
  showEngCategory: boolean;
  showEngagementType: boolean;
  showReferenceGiver: boolean;

  CatalogId: number;
  catalog_length: number;
  recordingList: any;
  masterSelected: boolean;
  checklist: any;
  checkedList: any;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  com_name: string;

  acc_manager: string = '';
  busi_email: string = '';
  industry_name: string = '';
  reve_scale: string = '';
  numof_emp: string = '';
  busi_addr: string = '';
  website: string = '';
  phoneNumber: number;
  userprofile_img: string = '';
  user_id;
  state: string;
  city: string;
  country: string;
  cmpdata: boolean = false;
  bussi_name: string;
  iscatalog_data: boolean = false;
  iscompanydata: boolean = false;
  catalog_record: any;
  isreviewdata: boolean = false;
  compLinkedInURL: string;

  reviewerlist: any;
  RequesterFirstName: string;
  RequesterID: string;
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
  rewerUserform: NgForm;
  RequestTitle: string;
  questionList;
  recordingHistory;
  RequesterLinkedIn: string;
  ReplayConsent: string;
  // introJS = introJs();
  selected: any = '';
  Managererror: any = { isError: false, errorMessage: '' };
  Reviewer_val: string;
  ReviewerID: number;
  inputChanged: any = '';
  reviewer_id: number;
  keyword: string = 'EmailID';
  video_url:string;
  singleParticipantList:any;
  multipleParticipantList:any;
  participantList:any;

  constructor(private toastr:ToastrService, private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private router: Router, public sanitizer: DomSanitizer, private titleService: Title, private appcmp: AppComponent) {
    //Added below code to update the title
    this.title = appcmp.title + " | Survey Recordings";

    if (localStorage.getItem('LoginUserID') == "" || localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizefilterDialog();
    };

    this.masterSelected = false;
  }

  // Page init method.
  ngOnInit() {
    //Added below line to remove the prompt message on reload and close browser.
    window.onbeforeunload = null;
    this.toastr.success('Added successfully', 'Success');
    this.surveyCmp.showNavigation = true;

    //this.tour();

    //Added below code to update the title
    this.titleService.setTitle(this.title);
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    //this.startSteps();
    //this.UserID = 10392;

    //Now fetching user's list
    let rid: string;
    //this.getReviewerList();

    //Method to get all users
    //this._getTeamMembers();

    //Method to get the recording's list
    //this.givercatalogservice.GetRecordingListByUserID(this.UserID);
    this.GetRecordingListByUserID(this.UserID);

    //Method to set the dialog height as per the window height
    this.resizefilterDialog();

    //getting the catalog setting on page load
    //this.getCatalogSetting(this.UserID);

    this.model.WebtalkxType = 'Survey';
    
    //On load, setting blank to not viewing
    localStorage.removeItem('IsViewingRecording');

    /*this.timeinterval = setInterval(() => {
      this.rowCollapse();
    }, 100);*/

    //Initializing method to initializing and binding view button click
    this.initViewButton();
    this.timeinterval = setInterval(() => {
      this.initViewButton();
    }, 100);


    this.sender_id = Number(localStorage.getItem('LoginUserID'));
    this.domainURL = GlobalVariable.domainURL;

    //Method to load on initially
    this.onInitialLoadMethod();

    //Calling to close the modal and redirect on edit profile page
    this.closeModalIfOnLoad();

  }


  //Method to load on initially
  onInitialLoadMethod() {
    this.model.ReviewerID = null;
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

  //Calling to close the modal and redirect on edit profile page
  closeModalIfOnLoad() {
    let modal_backdrop = document.getElementsByClassName('modal-backdrop');

    if (modal_backdrop) {
      for (let i = 0; i < modal_backdrop.length; i++) {
        if (modal_backdrop[i]) {
          modal_backdrop[i].remove();
        }
      }

    }
  }

  resetReviewerForm(NewReviewerForm: NgForm) {
    debugger;
    this.erroruser = "";
    //some function for login validation\
    this.rewerUserform = NewReviewerForm;
    NewReviewerForm.reset();
  }

  //Method to get the recording's list
  GetRecordingListByUserID(uid) {
    if (uid) {
      //showing loader
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Loading survey recordings...';

      let recordingObj: any = {};
      recordingObj.RequesterID = uid;
      
      return this.http
      //&Status=Open
      //.post(`${environment.domainApi}I2BRecordingRequest/GetFineshedRecordingRequest`, recordingObj).subscribe(res=>{
        //https://sara.webtalkx.com/api/getallrecordings
     // .get(`https://linappcardtest.azurewebsites.net/api/getallrecordingsfromupload1`).subscribe(res=>{
      .get(`https://sara.webtalkx.com/api/getallvideorecordings`).subscribe(res=>{

        if (res["files"]['length'] > 0) {
          this.catalog_length = res["files"]['length'];
          if (res["status"]) {
            //this.recordingList = res;
            this.recordingList = res['files'];
            //console.log('src...',res['Url'])
            this.checklist = this.recordingList;
            //hiding loader
            this.appcmp.showLoader = false;
          
          } else {
            this.recordingList = [];
            //hiding loader
            this.appcmp.showLoader = false;
          }
        } else {
          this.recordingList = [];
          //hiding loader
          this.appcmp.showLoader = false;
        }
      });
    }
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

    let invitebtn = document.getElementById('invite-btn');
    let sharebtn = document.getElementById('row-share-btn');
    if (this.checkedList.length == 1) {
      //if (deletebtn) deletebtn.removeAttribute('disabled');
      if (sharebtn) sharebtn.removeAttribute('disabled');
    } else {
      //if (deletebtn) deletebtn.setAttribute('disabled', 'true');
      if (sharebtn) sharebtn.setAttribute('disabled', 'true');
    }

    /*if (this.checkedList.length > 0) {
      if (invitebtn) invitebtn.removeAttribute('disabled');
    } else {
      if (invitebtn) invitebtn.setAttribute('disabled', 'true');
    }*/
  }


  //Method to check the selected recording delete
  archiveCatalog() {
    let recordingid;
    if (this.checkedList.length > 0) {
      for (let recording of this.checkedList) {
        recordingid = recording['UserID'];

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
    /*this.givercatalogservice.DeleteRefRecording(recording).subscribe(data => {

      //Once service completed then drawing recording
      this.GetRecordingListByUserID(this.UserID);

      //hiding loader after login
      this.appcmp.showLoader = false;
      this._notificationservice.success("Recording removed successfully.");
    },
      (error: HttpErrorResponse) => {
        //console.log(error.error);       
        //hiding loader after login
        this.appcmp.showLoader = false;
        this._notificationservice.error(GlobalVariable.TechnicalError);
      });*/
  }

  rowCollapse() {
    let input = document.querySelector('[data-toggle="toggle"]') as HTMLInputElement;
    if (input) {
      if (this.timeinterval) clearInterval(this.timeinterval);
      input.addEventListener('change', function (e) {
        //console.log($(this), e, e.target, this);
        $(this).parents().next('.hide').toggle();
      });
    }
  }

  //method to change catalog list view
  listView() {
    this.isListViewActive = true;
    this.isList = true;
  }

  //method to change catalog grid view
  gridView() {
    this.isListViewActive = false;
    this.isList = false;
  }

  //Method to apply filter on table
  RefGiverfilter(index) {

    // let table = $('#row-delete').DataTable();
    // let column = table.column(index);
    // column.visible(!column.visible());

    this.checkSelectedTrue();
  }


  //method to check the all selected or not
  checkSelectedTrue() {
    setTimeout(function () {
      let checkAll, count = 0;
      //let m = document.getElementsByClassName('checkbox-p-in-2')[0] as HTMLInputElement;
      let m = document.getElementsByClassName('filter_selectall')[0] as HTMLInputElement;
      checkAll = document.getElementsByClassName('checkAll');

      if (checkAll.length) {
        for (let i = 0; i < checkAll.length; i++) {
          if (!checkAll[i].checked) {
            m.checked = false;
          } else {
            count++;
            if (checkAll.length == count) {
              m.checked = true;
            }
          }
        }
      }
    }, 100);
  }

  //Method to check the existing email id
  onEmailEnter(email) {

    if (email != "") {
      /*let emailObj: any = {};
      emailObj.Email = email;*/
      
      return this.http
      .get(`${environment.domainApi}I2B_Users/CheckUserEmail?Email=` + email).subscribe(res=>{
        //Check length
        let data = Object.keys(res).length;
        if (data > 0) { }

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
      });

    } else {
      this.erroruser = "";
      this.isActiveUser = false;
    }
  }

  //Method to fetch the User details by email id
  getUserByEmail(Email) {
    if (Email && Email.length > 3 && Email.indexOf('@') > -1) {
      const obj = {
        EmailID: Email
      };

      return this.http
      .post(`${environment.domainApi}I2B_Users/GetUserDetailsByEmail`, obj).subscribe(res=>{
        
        if (res[0]['ResponseStatus'] == 'Success') {
          if (res && res['Length'] > 0) {
            /*res.forEach(el => {
              if (el.EmailID === Email) {
                this.model.FirstName = el.FirstName;
                this.model.LastName = el.LastName;
              }
            });*/
          }
        }
      });
    } else {
      this.model.FirstName = '';
      this.model.LastName = '';
    }
  }

  //Method for all element selection
  getAllCheck(e) {
    e.preventDefault();
    e.stopPropagation();

    this.input_arr = document.getElementsByClassName('checkAll');
    //this.isChecked = !this.isChecked;
    if (this.input_arr.length > 0) {
      for (var c = 0; c < this.input_arr.length; c++) {

        //if element exists then trigger to select/unselect
        if (e && e.target && e.target.checked) {
          if (this.input_arr[c] && !this.input_arr[c].checked) this.input_arr[c].click();
        } else {
          if (this.input_arr[c] && this.input_arr[c].checked) this.input_arr[c].click();
        }

      }
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

  getCompanyInfo(e, id, f_name) {
    e.preventDefault();
    e.stopPropagation();

    this.com_name = 'Company details';
    this.bussi_name = f_name;
    this.iscatalog_data = false;
    this.iscompanydata = true;

    //Added hack to open model to show the company details
    (<any>$('#companydetailsmodel')).modal('show');

    //Getting selected company information
    this.getCompanyDetails(id);
  }

  // Function for get reviewer details.
  getCompanyDetails(id: number) {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading company details...';
    
    return this.http
        .get(`${environment.domainApi}Common/GetBusinessDetails?BusinessID=` + id).subscribe(res=>{
          
          if (res[0]['ResponseStatus'] == 'Success') {
            this.cmpdata = true;

            this.busi_email = res[0]['Email'];
            this.bussi_name = res[0]['BusinessName'];
            this.phoneNumber = res[0]['PhoneNumber'];
            this.industry_name = res[0]['IndustryName'];
            this.reve_scale = res[0]['RevenueScale'];
            this.numof_emp = res[0]['EmployeeRange'];
            this.busi_addr = res[0]['Address'];
            this.state = res[0]['State'];
            this.city = res[0]['City'];
            this.country = res[0]['Country'];

            //Check if website url exits then also check if it contains http or not
            if (res[0]['Website']) {
              if (res[0]['Website'].indexOf("http") == -1 || res[0]['Website'].indexOf("https") == -1) {
                this.website = "http://" + res[0]['Website'];
              } else {
                this.website = res[0]['Website'];
              }
            }

            /*if (res[0]['ProfilePictureURL']) {
              this.userprofile_img = '/api/image/' + res[0]['ProfilePictureURL'];
            } else {
              this.userprofile_img = '../assets/images/retegrity/user.png';
            }*/
            if (res[0]['BusinessID'] == 10209) {
              this.compLinkedInURL = 'https://www.linkedin.com/company/toysrus1';
              this.userprofile_img = '../../assets/images/TRU_Logo.png';
            } else if (res[0]['BusinessID'] == 3) {
              this.compLinkedInURL = 'https://www.linkedin.com/company/icix';
              this.userprofile_img = '../../../assets/images/ICIX_vector_image.png';
            }
            else {
              this.userprofile_img = '../assets/images/Retegrity-images/cmplogo.png';
              this.compLinkedInURL = '';
            }

            //hiding loader after login
            this.appcmp.showLoader = false;
            this.appcmp.loadermessage = 'Please wait...';

          } else {
            this.cmpdata = false;
          }
        });
  }

  //Method to select individual row
  getSelectedRowForInfo(recordings, id, e) {

    let target = e.target, input_ele;
    e.preventDefault();
    e.stopPropagation();

    if (target.nodeName == 'I') target = target.parentNode;
    if (target && target.classList.contains('catalog-info')) {
      this.iscompanydata = false;
      this.iscatalog_data = true;
      this.com_name = 'Recording details';

      //getting input tag as a previous element
      if (target) input_ele = target.previousElementSibling;

      //Added hack to open model to show the company details
      (<any>$('#companydetailsmodel')).modal('show');

      //Method to get the all review and update in comment tab
      this.openReviewBox(id);

      let r_id = recordings['RefRequestID'];

      if (r_id == id) {
        this.catalog_record = recordings;
      }
    }

  }
  //Method to get the all review and open the review model
  openReviewBox(id) {

    //enable review's modal data
    this.isreviewdata = true;    
      
    return this.http
    .get(`${environment.domainApi}Comments/GetCommentByRefRequest?RefRequestID=` + id).subscribe(res=>{
      //getting response object's key data length 
      let data = Object.keys(res).length;

      if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
        //console.log("res", res[0]);
        this.usersreview = res;
        //this.setMoreAndLess();

        //using interval to get the length of element
        /*this.timeinterval = setInterval(() => {
          this.getUserOnHover();
        }, 100);*/
      } else {
        //disable review's modal data
        this.isreviewdata = false;
      }
    });

  }

  //Method to select individual row
  getSelectedRow(e) {

    let target = e.target, input_ele;

    //getting input tag as a previous element
    if (target) input_ele = target.previousElementSibling;

    //if input exists then trigger click
    if (input_ele && (input_ele.nodeName == 'INPUT' || input_ele.nodeName == 'LABEL')) {
      input_ele.click();
    } else {
      return;
    }
    //if node name is label and input then do not load the details
    //console.log("This is the elm- " + e.target.children[0]);
    //if (e.target && e.target.children && e.target.children[0] && e.target.children[0].children[0] && e.target.children[0].children[0].classList.contains("checkbox checkbox-primary checkbox-fill d-inline"))
    //  return;
  }

  viewDetails() {

    //Added hack to open model to show the recording form
    //(<any>$('#viewmodel')).modal('show');
  }

  //getting view button and binding click
  initViewButton() {
    let view_button = document.getElementsByClassName('view-button');
    if (view_button) {
      for (let m = 0; m < view_button.length; m++) {

        view_button[m].addEventListener('click', this.getSelectedUser.bind(this));
      }
    }
  }

  // Function for select giver.
  getSelectedUser(e) {
    localStorage.setItem('IsViewingRecording', "true");

    if (e.target.id != "") {
      String(e.target.id);
      this.router.navigateByUrl('/referencegiver/referencerecordingrequest/' + e.target.id);
    }
  }

  //Method to send invitation
  sendInvitation(model) {
    console.log(model, "model");
  }

  //Method to create reviewer
  createReviewer(model) {
    //console.log(model, "modelcreate");

    let RevObj: any = {};
    RevObj.FirstName = model.FirstName;
    RevObj.LastName = model.LastName;
    RevObj.EmailID = model.Email;
    RevObj.UserID = this.UserID;

    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Reviewer is being created...';
    
    return this.http
    .post(`${environment.domainApi}I2B_Users/InsertReviewerDetails`, RevObj).subscribe(res=>{
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
          this.createNewReviewer(this.rewerUserform);

          //Added hack to open model to show the company details
          (<any>$('#catalogShareModel')).modal('show');
          this.erroruser = '';

          //Method to create reviewer
          this.getReviewerList();

          //Method to get all users
          //this._getTeamMembers();
        }

      } else {
        this.appcmp.showLoader = false
      }
    });
  }

  //Method to create reviewer
  getReviewerList() {
    let recordingid, record_title;
    //debugger
    if (this.checkedList && this.checkedList.length > 0) {
      for (let recording of this.checkedList) {
        recordingid = recording['RefRecordingID'];
        record_title = recording['AssignedTitle'] || recording['Title'];
        this.model.ReviewTitle = record_title;

        if (recordingid) {

          let UserObj: any = {};
          UserObj.UserID = this.UserID;
          UserObj.RefRecordingID = recordingid;

          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Share with dropdown is being loaded...';
          
          return this.http
          .post(`${environment.domainApi}I2B_Users/GetUsersForReviewDDL`, UserObj).subscribe(res=>{
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
      }
    }

  }

  //Method to select newely created user
  selectNewUser(rid) {
    let id = rid;

    setTimeout(function () {
      let select_popup = document.getElementsByClassName('select-popup')[0] as HTMLSelectElement;

      for (var i = 0; i < select_popup.options.length; i++) {
        if (select_popup.options[i].id == id) {
          select_popup.options[i].selected = true;
          //return;
        }
      }
    }, 2000);
    //(document.querySelector('option[value="+ rid +"]') as HTMLOptionElement).selected = true;
  }

  //method to get the all the message
  _getTeamMembers() {

    let userObj: any = {};
    userObj.UserID = this.UserID;

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Reviewer dropdown is being updated...';
    
    return this.http
    .post(`${environment.domainApi}I2B_Users/GetUsersForInbox`, userObj).subscribe(res=>{
      
      if (res["length"] > 0) {

        if (res[0]['ResponseStatus'] == 'Success') {
          //assigning all the response data into the global variable which is using in html context to draw
          this.reviewerlist = res;

          //hiding loader
          this.appcmp.showLoader = false;
        } else {
          //assigning all the response data into the global variable which is using in html context to draw
          this.reviewerlist = [];

          //hiding loader
          this.appcmp.showLoader = false;
        }
      } else {
        this.reviewerlist = [];
        //hiding loader
        this.appcmp.showLoader = false;
      }
    });
  }

  //Method to copy the recording URL
  myFunction() {
    // Get the text field
    //var copyText = document.getElementById("myInput") as HTMLInputElement;
    //var copyText = myInput;
    let urls: any = [], recordedby: any = [], titlearr: any = [];

    if (this.checkedList && this.checkedList.length > 0) {
      for (let recording of this.checkedList) {
        let recordingid = recording['RefRecordingID'];
        let fullname = recording['GiverFirstName'] + ' ' + recording['GiverSecondName'];
        let title = recording['Title'];

        if (recordingid) {
          urls.push(this.domainURL + '#/I2Breview/2r9QUFD/' + recordingid);
        }

        if (fullname) recordedby.push(fullname);
        if (title) titlearr.push(title);
      }
    } else {
      urls = [];
    }
    //let url = this.domainURL + '/#/ReferenceApplication/ReferenceHost/' + id;
    /*
    // Select the text field
    copyText.select();
    //copyText.setSelectionRange(0, 99999); //For mobile devices

    // Copy the text inside the text field
    document.execCommand("copy");

    // Alert the copied text
    alert("Copied the text: " + copyText.value);*/
    /*if (window.clipboardData && window.clipboardData.setData) {
      // IE specific code path to prevent textarea being shown while dialog is visible.
      return clipboardData.setData("Text", url);

    } else */
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
      //console.log("data", input.value);

      var tooltip = document.getElementById("myTooltip");
      //tooltip.innerHTML = "Copied: " + input.value;
      if (input.value) {
        tooltip.innerHTML = "Secure URL copied";
      } else {
        tooltip.innerHTML = "Please select the recordings.";
      }

      /*try {
        //return document.execCommand("copy");
        // Security exception may be thrown by some browsers.
        let data =  document.execCommand("copy");
        //console.log("data", data, input.value);
      } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
      } finally {
        document.body.removeChild(input);
      }*/
    }
  }
  //Method to show the tooltip
  outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy secure url";
  }

  //Method to send invitation
  sendRecordingInvitationToReviewer(model) {
    let recordingid, givername, requestername;
    //debugger
    if (this.checkedList.length > 0) {
      for (let recording of this.checkedList) {
        recordingid = recording['RefRecordingID'];
        givername = recording['GiverFirstName'] + ' ' + recording['GiverSecondName'];
        requestername = recording['RequesterFirstName'] + ' ' + recording['RequesterLastName'];

        if (recordingid) {

          let RecordObj: any = {};
          let assignedToID = (this.reviewer_id) ? this.reviewer_id : model.ReviewerID.UserID;

          RecordObj.RefRecordingID = recordingid;
          //RecordObj.AssignedToID = model.ReviewerID;
          RecordObj.AssignedToID = assignedToID;
          RecordObj.AssignedByID = this.UserID;
          RecordObj.AssignedTitle = model.ReviewTitle;
          RecordObj.SentMessage = model.ReviewMessage;

          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Invitation is being sent to reviewer...';
          
          return this.http
          .post(`${environment.domainApi}I2BRecordingRequest/AssignedRequestToReviewer`, RecordObj).subscribe(res=>{
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

              // this.model.ReviewerID = '';

              //this.model.ReviewTitle = '';
              //this.model.ReviewMessage = '';

            } else {

              this.reviewerlist = [];
              this.appcmp.showLoader = false
            }
          });
        }
      }
    }
  }

  //Method to clear the invitation field
  clearInvitationField() {
    this.model.ReviewerID = '';
    this.model.ReviewTitle = '';
    this.model.ReviewMessage = '';
  }

  //Method to redirect on replay page
  ReviewRecording(e, RefRecordingID, recordings) {
    let domainUrl, fullname: string = recordings.RequesterFirstName + ' ' + recordings.RequesterLastName;

    //localStorage.setItem('RefRecordingID', RefRecordingID);
    localStorage.setItem('RefRecordingID', '570');
    localStorage.setItem('requesterName', String(fullname));
    localStorage.setItem('requesterId', String(recordings.RequesterID));
    localStorage.setItem('RecordingName', String(recordings));
    localStorage.setItem('English', 'upload');
    localStorage.setItem('TestRecord', 'Y');
   
    //binding video url  
       this.video_url = recordings;
    //Redirecting on recording replay player popup
       (<any>$('#recordingPlayerModel')).modal('show');
   
    //this.router.navigateByUrl('/I2BApplication/RecordingReview');
  }

  //Method to select individual row
  getSelectedRowInfo(recordings, id, e) {

    let target = e.target, input_ele;
    e.preventDefault();
    e.stopPropagation();

    //Added hack to open model to show the company details
    (<any>$('#catalogdetailsmodel')).modal('show');

    let r_id = recordings['RefRecordingID'];

    if (r_id == id) {

      //Now getting question
      this.getQuestion(id);

      //Method to get the all sharing history details in sharing history tab
      this.shareHistoryDetails(id);

      this.catalog_record = recordings;
      this.RequesterFirstName = recordings['RequesterFirstName'];
      this.RequesterID = recordings['RequesterID'];
      this.GiverID = recordings['GiverID'];
      this.GiverLinkedIn = recordings['GiverLinkedIn'];
      if (this.GiverLinkedIn && (this.GiverLinkedIn.indexOf('https') == -1 || this.GiverLinkedIn.indexOf('http') == -1)) {
        this.GiverLinkedIn = 'https://' + this.GiverLinkedIn;
      }

      this.RequesterLinkedIn = recordings['RequesterLinkedIn'];

      if (this.RequesterLinkedIn && (this.RequesterLinkedIn.indexOf('https') == -1 || this.RequesterLinkedIn.indexOf('http') == -1)) {
        this.RequesterLinkedIn = 'https://' + this.RequesterLinkedIn;
      }
      this.GiverEmailID = recordings['GiverEmailID'];
      this.GiverFirstName = recordings['GiverFirstName'];
      this.GiverSecondName = recordings['GiverSecondName'];
      this.RequesterFirstName = recordings['RequesterFirstName'];
      this.RequesterLastName = recordings['RequesterLastName'];
      this.RecordingTitle = recordings['RecordingTitle'];
      this.Instructions = recordings['Instructions'];
      this.RecordingStatus = recordings['RecordingStatus'];
      this.askedbyemail = recordings['RequesterEmailID'];
      this.requestdate = recordings['RequestDate'];
      this.requestfinishdate = recordings['FinishedDate'];
      this.RequestTitle = recordings['Title'];
      this.ReplayConsent = recordings['ReplayConsent'];
      //this.ReplayConsent = 'webtalkx';

    }
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

  //Method to get the sharing history details
  shareHistoryDetails(id) {
    
    return this.http
    .get(`${environment.domainApi}I2B_RecordingShareHistory/GetSharedHistory?RefRecordingID=` + id).subscribe(res=>{
        //getting response object's key data length 
        let data = Object.keys(res).length;

        if (data > 0 && res[0]['ResponseStatus'] == 'Success') {
          this.recordingHistory = res;

        } else {
          //disable review's modal data
          //this.isreviewdata = false;
          this.recordingHistory = [];
        }
    });

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

  //Enable tab selection
  enableTab(e) {
    let target, t_attr, sharinghistory, detailstab;

    sharinghistory = document.getElementById('sharinghistory');
    detailstab = document.getElementById('detailstab');

    if (e) t_attr = e.getAttribute('href');

    if (sharinghistory && sharinghistory.classList.contains('active show')) {
      sharinghistory.classList.remove('active show');
    }
    if (detailstab && detailstab.classList.contains('active show')) {
      detailstab.classList.remove('active show');
    }

    if (e && !e.classList.contains('active show')) {
      e.className += ' active show';
    }

  }


  //method's for selection in autocomplete
  selectEvent(item) {
    this.selected = item;
    let select_f_name = this.selected.FirstName + ' ' + this.selected.LastName + ' (' + this.selected.EmailID + ')';
    //  this.model.ReviewerID = this.selected;
    
    this.model.ReviewerID = select_f_name;
    this.Reviewer_val = select_f_name;
    this.ReviewerID = this.selected.UserID;
    this.reviewer_id = this.selected.UserID;
    this.Managererror = { isError: true, errorMessage: ' ' };

  }

  // Validation for check engagement name.
  ManagerNameValidation(ManagerName: string) {
    if (!ManagerName) {
      this.Managererror = { isError: true, errorMessage: 'Share with is required.' };
    } else {
      this.Managererror = { isError: true, errorMessage: ' ' };
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

  //copy to clipboard
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
  
  //Method to stop the video playing
  stopVideoPlayer(recording_player) {
    if(recording_player) recording_player.pause();
  }
  
 
  //Method to get the participant list
  GetParticipant(refid) {

    //showing loader
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = 'Loading participants...';
    
    return this.http
      .get(`${environment.domainStageApi}ParticipantInfo/GetParticipantInfoByRefRecordingID?RefRecordingID=`+  refid+'&IsRecorded=true').subscribe(res=>{
      
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

}
