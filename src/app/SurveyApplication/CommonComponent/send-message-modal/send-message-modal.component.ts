import { Component, OnInit, Input } from '@angular/core';
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
@Component({
  selector: 'app-send-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.css']
})
export class SendMessageModalComponent implements OnInit {
  model: any = {}
  title: string;
  sender_id: number;
  @Input() receiver_id: number;
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
    

    this.surveyCmp.showNavigation = true;
  }

  ngOnInit(): void {

    this.sender_id = Number(localStorage.getItem('UserID'));
    console.log('sender id---------',this.sender_id);
    console.log('receiver id---------',this.receiver_id);

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
