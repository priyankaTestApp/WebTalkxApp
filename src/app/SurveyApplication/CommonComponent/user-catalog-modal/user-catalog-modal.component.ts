import { Component, OnInit, Optional, Inject, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../../app.component';
import { GlobalVariable } from '../../../globals';
import { HttpErrorResponse } from '@angular/common/http';
//import { SurveyApplicationComponent } from './../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-catalog-modal',
  templateUrl: './user-catalog-modal.component.html',
  styleUrls: ['./user-catalog-modal.component.css']
})
export class UserCatalogModalComponent implements OnInit {
  @Input() data: any=[];
  @Input() questionList: any[];
  @Input() userData: any=[];
  @Output() sendReplayData = new EventEmitter<any>();

  today: Date;
  model: any = {}
  showCatalog: boolean;
  showReplay: boolean;
  video_url: string;
  UserID: any
  sender_id: number;
  receiver_id: number;
  full_name: string;

  constructor(private http: HttpClient, private router: Router, private titleService: Title, private appcmp: AppComponent) {
   }

  ngOnInit(): void {
    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizefilterDialog();
    };
    //console.log(history.state);
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    console.log('this is user data for popup',this.userData)
  }

  //showConfirmationFun1 = (res1,res2) => {
  //  this.data = res1;
  //  this.userData = res1;
  //  (<any>$('#catalogdetailsmodel')).modal('show');
  //}



  //showConfirmationFun2 = () => {
   
  //  (<any>$('#recordingPlayerModel')).modal('show');
  //}







  //recordingPlayerModel
  replayInterviewNow(e, index, type) {
    let domainApi, recording_player, req_id, vtype, check_url;

    req_id = this.data['ID'];
    console.log('replayInterviewNow--------', req_id)
    vtype = type;
    this.video_url = '';

    recording_player = document.getElementsByClassName('recording_player')[0];
    domainApi = `${environment.domainApi}`;
    //this.video_url = domainApi + vtype +'_'+ req_id+'_'+ index+'_'+ '.mp4';
    //https://stage.webtalkx.com/api/UserVideo/10/2.webm
    //check_url = domainApi+'upload/' + vtype +'_'+ req_id+'_'+ index+ '.mp4';
    check_url = domainApi + 'UserVideo/' + req_id + '/' + vtype + '_' + req_id + '_' + index + '.mp4';
    this.video_url = domainApi + 'UserVideo/' + req_id + '/' + vtype + '_' + req_id + '_' + index + '.mp4';

 //we are emitting video_url to request-by-me-page(for all other components)
    this.sendReplayData.emit(this.video_url);

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









  //method to convert the text into link if available
  urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    //var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url, b, c) {
      var url2 = (c == 'www.') ? 'http://' + url : url;
      return '<a class="white-text" href="' + url2 + '" target="_blank">' + url + '</a>';
    })
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



}
