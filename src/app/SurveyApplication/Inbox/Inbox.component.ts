import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { Title } from '@angular/platform-browser';
import { GlobalVariable } from '../../globals';
import { SurveyApplicationComponent } from '../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { ErrorMessagesService } from 'src/app/services/error-messages.service';
@Component({
  selector: 'app-inbox',
  templateUrl: './Inbox.component.html',
  styleUrls: ['./Inbox.component.css']
})
export class InboxComponent implements OnInit {
  title: string;
  UserID: number;
  MessageID: number;
  SenderID: number;
  SenderName: string;
  SenderTitle: string;
  MessageText: string;
  SendDateTime: number;
  ResponseStatus: string;
  masterSelected: boolean;
  checklist: any;
  checknotificationlist: any;
  checkedList: any;
  messageList: any;
  notificationList: any;
  msg_length: number;
  not_length: number;
  timeinterval;
  isdatalength: boolean = false;
  timeintervals;
  usersList: any;
  receiver_id: number;
  model: any = {};
  selected_id: number;
  selectNotification: string;
  unreaditemcount: number;
  unreadmsgcount: number;
  selectMessage: string;
  //dtOptions: DataTables.Settings = {};
  dtOptions = {};
  domainUrl: string;
  isuserlength: boolean = false;
  LoginUserID: number;
  u_img: string = '../assets/img/u_image6.png';
  searchTerm : string;
  //errorService: any;

  constructor(private errorService:ErrorMessagesService, private toastr:ToastrService, private http: HttpClient, public surveyCmp: SurveyApplicationComponent, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    this.masterSelected = false;
    this.title = appcmp.title + " | Inbox";

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizeContainer();
    };

  }
  ngOnInit() {
    
    //Added below code to update the title
    this.titleService.setTitle(this.title);
    localStorage.setItem('InProgress', '');
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.LoginUserID = Number(localStorage.getItem('LoginUserID'));

    //Method to get unread notification
    //this.GetUnreadNotificationCount(this.UserID);

    //Method to get unread message
    //this.GetUnreadMessageCount(this.UserID);

    //Method to get all users
    this._getCompanyUser(this.UserID);

    //Method to get the all notifications
    this.getAllNotifications(this.UserID);

    //Method to set the dialog height as per the window height
    this.resizeContainer();

    this.domainUrl = GlobalVariable.APIUrl;

    this.dtOptions = {
      //pagingType: 'full_numbers',
      pageLength: 10,
      //ordering: false,
      lengthChange: false,
      "info": false,
      "order": [[3, "desc"]], //, "asc"
      columnDefs: [
        { "orderable": false, "targets": [0] }]
    };

    //Check if any unread notification then select notification tab
    this.selectNotification = localStorage.getItem('Notification');

    if (this.selectNotification == 'true') {
      this.selectNotificationTab();
    }

    //Check if any unread message then select message tab
    this.selectMessage = localStorage.getItem('UnreadMessage');

    if (this.selectMessage == 'true') {
      this.selectMessageTab();
    }

    //Add hadler for notification and message icon
    this.allNotificationHandler();

    this.surveyCmp.showNavigation = true;
  }

  getNotificationsList(res) {
    console.log('notification list -----', res)
    this.notificationList = res;
    this.checklist = this.notificationList;
  }

 

  //Add hadler for notification and message icon
  allNotificationHandler() {
    let notification_icon, message_icon;

    notification_icon = document.getElementsByClassName('notification_icon')[0];
    if (notification_icon) notification_icon.addEventListener('click', this.selectNotificationTab.bind(this));

    message_icon = document.getElementsByClassName('message_icon')[0];
    if (message_icon) message_icon.addEventListener('click', this.selectMessageTab.bind(this));

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

  //method to get the all the message
  _getCompanyUser(uid) {
    let userObj: any = {};
    userObj.UserID = uid;
    //hiding loader after login
    this.appcmp.showLoader = true;
    this.appcmp.loadermessage = "Loading inbox...";
    
    return this.http
    .post(`${environment.domainApi}I2B_Users/GetUsersForInbox`, userObj).subscribe(res=>{
      
      if (res["length"] > 0) {

        if (res[0]['ResponseStatus'] == 'Success') {
          //hiding loader
          //this.appcmp.showLoader = false;

          //If only loggedin user is in inbox user then do nothing
          if (res["length"] == 1 && res[0]['UserID'] == this.LoginUserID) {
            this.usersList = [];
            this.isuserlength = true;
            //hiding loader
            this.appcmp.showLoader = false;

          } else {
            //assigning all the response data into the global variable which is using in html context to draw
            this.usersList = res;

            this.isuserlength = false;

            //Selecting first user's list
            this.timeintervals = setInterval(() => {
              //clear input will check the value till blank
              this.selectFirstUserList();
              //hiding loader
              this.appcmp.showLoader = false;
            }, 100);
          }
        } else {
          this.usersList = [];
          this.isuserlength = true;
          //hiding loader
          this.appcmp.showLoader = false;
        }
      } else {
        this.usersList = [];
        this.isuserlength = true;
        //hiding loader
        this.appcmp.showLoader = false;
      }
    });

  }

  //method to get the all the message
  getAllMessage(select_uid, uid) {
    
    return this.http
    .get(`${environment.domainApi}I2BMessages/GetMessages?UserID=` + select_uid + '&LoginUserID=' + uid).subscribe(res=>{
      //getting response data length
      this.msg_length = res["length"];

      if (res["length"] > 0) {

        if (res[0]['ResponseStatus'] == 'Success') {
          this.messageList = res;
          this.checklist = this.messageList;

          //Message length is greater then zero then
          this.isdatalength = true;

          //Method to scroll down the last message
          this.scrollDownToLast();

          //Method to set the dialog height as per the window height
          this.resizeContainer();
        }
      } else {
        //Message length is not greater then zero then
        this.isdatalength = false;
        this.messageList = '';
        //hiding loader
        this.appcmp.showLoader = false;
      }
    });
    //}
  }

  //method to get the all the notification
  getAllNotifications(uid) {
    
   
    return this.http
      .get(`${environment.domainApi}I2BNotifications/GetNotifications?UserID=` + uid + '&Count=0').subscribe(res=>{
      
      if (res["length"] > 0) {
        this.not_length = 0;
        if (res[0]['ResponseStatus'] == 'Success') {
          this.notificationList = res;
          this.checklist = this.notificationList;
          //Now initiating data table
          this.loadDataTable();
        }
      } else {
        this.notificationList = [];
      }
    },
    );
  }

  //Method to scroll down the last message
  scrollDownToLast() {
    let msg_history = document.getElementsByClassName('msg_history')[0], height;

    setTimeout(function () {
      if (msg_history) height = msg_history.scrollHeight;
      if (msg_history && height) msg_history.scrollTo(0, height);
      //if (msg_history) msg_history.scrollIntoView(false);
    }, 200);

    //Now focusing curser on input element
    this.focusOnInputElement();
  }

  //Method to focusing curser on input element
  focusOnInputElement() {
    let write_msg;

    write_msg = document.getElementsByClassName('write_msg')[0];
    if (write_msg) write_msg.focus();
  }

  //Method to select the first user
  selectFirstUserList() {
    let chat_list, select_uid;

    chat_list = document.getElementsByClassName('chat_list');
    if (chat_list.length > 0) {
      if (this.timeintervals) clearInterval(this.timeintervals);
      for (let i = 0; i < chat_list.length; i++) {
        if (i == 0 && chat_list[0] && !chat_list[0].classList.contains('active_chat')) {
          chat_list[0].className += ' active_chat';

          //fetching selected user's id
          select_uid = chat_list[0].id;

          //assigning receiver id
          this.receiver_id = select_uid;
          //getting the respective user's message
          this.getAllMessage(select_uid, this.UserID);
          //this.ReadMessageOnSelect(select_uid, this.UserID);
        }
      }
    }
  }
 
  //method to select the user
  selectUser(e,userelement, select_uid) {
    let chat_list, target;
    target = e.target;

    chat_list = document.getElementsByClassName('chat_list');
    if (chat_list.length > 0) {
      for (let i = 0; i < chat_list.length; i++) {
        if (chat_list[i] && chat_list[i].classList.contains('active_chat')) chat_list[i].classList.remove('active_chat');
      }

      if (userelement) userelement.className += ' active_chat';

      //assigning receiver id
      this.receiver_id = select_uid;
      //getting the selected user's message
      if (select_uid) {
        this.getAllMessage(select_uid, this.UserID);
        this.ReadMessageOnSelect(select_uid, this.UserID);
      }
    }
  }


  //Method to read the message
  ReadMessageOnSelect(select_uid, UserID) {
    let message: any = {}, message_menutab;
    message.SenderID = UserID;
    message.ReceiverID = select_uid;
    let select_ID = select_uid;
    message_menutab = document.getElementById('message_menutab');
    if (message_menutab && message_menutab.classList.contains('active')) {
          
      return this.http
      .put(`${environment.domainApi}I2BMessages/ReadMessage`, message).subscribe(res=>{
        
        if (res["length"] > 0) {

          if (res[0]['ResponseStatus'] == 'Success') {

            let icon_color = document.getElementsByClassName('inbox_unread_' + select_ID)[0];
            icon_color.classList.remove('inbox_unread');

            let icon_msg = document.getElementsByClassName('icon-message_' +select_ID)[0];
            
            let unReadCount = res[0]['UnReadCount'];
            if (unReadCount > 0) {
              if (icon_msg) {
                icon_msg.innerHTML = String(unReadCount);
                if (icon_msg && icon_msg.classList.contains('-hidden')) icon_msg.classList.remove('-hidden');
              }
            }else {
              if (icon_msg && !icon_msg.classList.contains('-hidden')) icon_msg.className += ' -hidden';
            }
           
            //method to get unread message count
            this.GetUnreadMessageCount(this.UserID)
          }
        }
      });
    }
  }

  //Method to send the message to the respective user
  sendMessage(textSend, msgtext) {
    
    //Always should have message then call service. And if text then trim
    if (msgtext && msgtext.trim()) {
      
      let msgtext_new = this.urlify(msgtext.trim());

      this.model.MessageText = msgtext_new;
      this.model.SenderID = this.UserID;
      this.model.ReceiverID = this.receiver_id;
        
      return this.http
      .post(`${environment.domainApi}I2BMessages/InsertMessages`, this.model).subscribe(res=>{
        if (res[0]['ResponseStatus'] == 'Success') {

          //Then clear the input text
          //this.model.textSend = '';
          if (textSend) textSend.innerText = '';

          //getting the selected user's message
          if (this.receiver_id) this.getAllMessage(this.receiver_id, this.UserID);

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

  //Method to call when press enter on text box
  sendText(e) {
    //Checking if pressed enter then hit the send button
    if (e.keyCode === 13) {
      e.preventDefault();
      document.getElementById("msg_send_btn").click();
    }
  }


  rowCollapseAndExpand() {

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let id = this.id;
        let content = document.getElementsByClassName('content_+id')[0] as HTMLElement;

        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }

  //Method to identify the selcted tab
  enableTab(tab, tabcontent) {
    let target, t_attr;

    if (tab) t_attr = tab.getAttribute('href');

    if (t_attr == '#messagetab') {
      //(this.msg_length > 0) ? this.isdatalength = true : this.isdatalength = false;
      this.isdatalength = false;
      //Method to scroll down the last message
      this.scrollDownToLast();

    } else if (t_attr == '#notificationtab') {
      (this.not_length > 0) ? this.isdatalength = true : this.isdatalength = false;

    }
  }

  //Method to enable and disable the delete icon
  //enableDisableDeleteIcon() {

  //  let deletebtn = document.getElementById('row-delete-btn');
  //  if (this.checkedList.length > 0) {
  //    if (deletebtn) deletebtn.removeAttribute('disabled');
  //  } else {
  //    if (deletebtn) deletebtn.setAttribute('disabled', 'true');
  //  }
  //}

  //Method to check the selected message delete
  _archiveNotification() {
    let notifid;
    if (this.checkedList.length > 0) {
      for (let notification of this.checkedList) {
        notifid = notification['NotificationID'];

        if (notification) {
          //hiding loader after login
          this.appcmp.showLoader = true;
          this.appcmp.loadermessage = 'Notification is being removed...';
          this._notificationDeleteConfirm(notification);
        }
      }
    }
  }

  //Method to remove the selected notification
  _notificationDeleteConfirm(notification) {
      
      return this.http
      .put(`${environment.domainApi}Notification/DeleteNotifications`, notification).subscribe(res=>{
        
      //Once service completed then drawing notification
      this.getAllNotifications(this.UserID);

      //hiding loader after login
      this.appcmp.showLoader = false;
      //this._notificationservice.success("Notification removed successfully.");
      });
  }

  //Method to enable the notification tab
  selectNotificationTab() {
    let notification_menutab = document.getElementById('notification_menutab');
    if (notification_menutab) {

      setTimeout(function () {
        //triggering on notification tab
        notification_menutab.click();
      }, 500);

      //clearing local storage
      localStorage.setItem('Notification', '');

      //enabling top action buttons
      this.isdatalength = true;
    }

  }

  //Method to enable the message tab
  selectMessageTab() {

    let message_menutab = document.getElementById('message_menutab');
    if (message_menutab) {

      //triggering on message tab
      message_menutab.click();
      //Method to scroll down the last message
      this.scrollDownToLast();

      //clearing local storage
      localStorage.setItem('UnreadMessage', '');

      //enabling top action buttons
      this.isdatalength = false;
    }

  }

  //Method to read as marked
  readNotification(e, trnotification, id, msg) {
    let target, notificationMessage, input_ele;

    this.selected_id = id;
    target = e.target;

    //getting input tag as a previous element
    if (target) input_ele = target.previousElementSibling;
    //if input exists then trigger click
    if (input_ele) {
      input_ele.click();
      return false;
    }

    if (trnotification) target = trnotification;

    //TODO - NOT TO REMOVE FOR NOW
    //this.rowCollapseAndExpand();

    notificationMessage = document.getElementById('notificationMessage');
    if (notificationMessage) {
      notificationMessage.innerHTML = msg ? msg : 'No content available.';
    }

    //If it is unread then make it read
    if (target && target.classList.contains('unreadmsg')) this._setToReadNotification(target, id);
    //this._setToReadNotification(target, id);
  }

  //Method to set to read
  _setToReadNotification(target, id) {
    let notification: any = {};
    if (id) notification.NotificationID = id;
      
    return this.http
    .put(`${environment.domainApi}I2BNotifications/ReadNotification`, notification).subscribe(res=>{
      
      if (res["length"] > 0) {

        if (res[0]['ResponseStatus'] == 'Success') {

          //Then remove unread class from tr
          if (target) {
            target.classList.remove('unreadmsg');
            //target.classList.remove('a');

            //Method to get unread notification
            this.GetUnreadNotificationCount(this.UserID);
          }
        }
      }
    });
  }

  //Method to set the dialog height as per the window height
  resizeContainer() {
    /*let cbody_elm = document.getElementsByClassName('card-body')[0],
      w_height = window.innerHeight,
      cbody_height = cbody_elm ? cbody_elm.clientHeight : null,
      inbox_chat = (document.getElementsByClassName('inbox_chat') as HTMLCollection),
      totalheight: number = 0;

    if (w_height && inbox_chat.length > 0) {

      totalheight = w_height - 100;
      for (let i = 0; i < inbox_chat.length; i++) {
        //Getting left user container element and setting the calculated height
        if (inbox_chat[i]) inbox_chat[i].setAttribute('style', 'height: ' + totalheight + 'px');
      }
    }*/
    let cbody_elm = document.getElementsByClassName('card-body')[0],
      w_height = window.innerHeight - 300,
      cbody_height = cbody_elm ? cbody_elm.clientHeight : null,
      inbox_chat = (document.getElementsByClassName('inbox_chat') as HTMLCollection),
      totalheight: number = 0,
      messagecontainer = document.getElementsByClassName('message-container')[0],
      inbox_people = document.getElementsByClassName('inbox_people')[0],
      msg_history = document.getElementsByClassName('msg_history')[0];

    if (messagecontainer) messagecontainer.setAttribute('style', 'height: ' + w_height + 'px');
    if (inbox_people) inbox_people.setAttribute('style', 'height: ' + w_height + 'px');

    totalheight = w_height - 132;
    if (msg_history) msg_history.setAttribute('style', 'height: ' + totalheight + 'px');
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

  enableDisableNotificationIcon(itemcount: number) {
    let iconbell = document.getElementsByClassName('notification_counter')[0];

    if (itemcount > 0) {
      if (iconbell) {
        iconbell.innerHTML = String(itemcount);
        //iconbell.setAttribute('data-count', itemcount.toString());
        //if (iconbell && !iconbell.classList.contains('show-count')) iconbell.className += ' show-count';
        if (iconbell && iconbell.classList.contains('-hidden')) iconbell.classList.remove('-hidden');
      }
    } else {
     
      if (iconbell && !iconbell.classList.contains('-hidden')) iconbell.className += ' -hidden';
    }

  }

  //Method to get the unread notification
  GetUnreadMessageCount(uid) {

    if (uid) {
      
      return this.http
      .get(`${environment.domainApi}I2BMessages/GetUnReadMessageCount?UserID=` + uid).subscribe(res=>{
        
        if (res["length"] > 0) {

          this.unreadmsgcount = res[0]['UnReadCount'];

          //method to show/hide notification icon
          this.enableDisableMessageIcon(this.unreadmsgcount);

        } else {

        }
      });
    }
  }

  //Method to update the message icon's data
  enableDisableMessageIcon(unreaditemcount: number) {
    //let iconmsg = document.getElementsByClassName('icon-message')[0];
    let iconmsg = document.getElementsByClassName('message_counter')[0];

    //if (iconmsg) iconmsg.setAttribute('data-count', unreaditemcount.toString());
    if (unreaditemcount > 0) {
      iconmsg.innerHTML = String(unreaditemcount);
      if (iconmsg && iconmsg.classList.contains('-hidden')) iconmsg.classList.remove('-hidden');
      
    } else {
      if (iconmsg && !iconmsg.classList.contains('-hidden')) iconmsg.className += ' -hidden';
    }

  }

  //Method to open linkedin profile of selected user
  openLinkedInProfile(linkedInUrl, e) {
    let url: string;

    e.preventDefault();
    e.stopPropagation();

    //If url does not contains protocol then concatanate
    if (linkedInUrl.indexOf("http") == -1 || linkedInUrl.indexOf("https") == -1) {
      url = "http://" + linkedInUrl;
    } else {
      url = linkedInUrl;
    }

    //if url exists then open the link in new tab
    if (url) window.open(url);
  }

  //Method to check and uncheck all message and notification
  checkUncheckAll() {
    for (let i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //Method to check and uncheck single message and notification
  isAllSelected() {
    this.masterSelected = this.checklist.every(function (message: any) {
      return message.isSelected == true;
    })
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
    //console.log(this.checkedList);
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


}

