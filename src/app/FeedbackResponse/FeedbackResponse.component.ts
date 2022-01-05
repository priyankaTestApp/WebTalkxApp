import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../toastr-notification/toastr-notification.service';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
//import { CommonService } from '../CommonService/commonfunction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-FeedbackResponse',
  templateUrl: './FeedbackResponse.component.html',
  styleUrls: ['./FeedbackResponse.component.css']
})
export class FeedbackResponseComponent implements OnInit {
  updateUserModel: any = {};
  title: string;
  UserID: number;
  RefRecordingID: number;
  rating: number;

  constructor(public _notificationservice: NotificationService, private http: HttpClient, private router: Router, private titleService: Title, private appcmp: AppComponent) {
    this.title = appcmp.title + " | Feedback";
  }

  ngOnInit() {
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.RefRecordingID = Number(localStorage.getItem('RefRecordingID'));
  }

  FeedbackResponse() {

    this.router.navigateByUrl('/I2BApplication/RecordingsCatalogFromMe');
  }



  //method to submit the feedback
  FeedBackSubmit(form: NgForm) {
  //  console.log(form.value)
    if (this.UserID) {
      const data = {
        UserID: this.UserID,
        Suggestion: form.value.suggest || '',
        Experience:'',
        Rating: form.value.rating,
        RefRecordingID: this.RefRecordingID
      }

      //showing loader icon
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      /*
      this._commonservice.I2BFeedback(data).subscribe(res => {
        success => alert("Done");
        console.log(res);
        if (res[0]['ResponseStatus'] == 'Success') {
          
          let IsUploading = localStorage.getItem('IsUploading');
          if (IsUploading == 'Y') {
            this.router.navigateByUrl('/I2BApplication/RequestsFromMe');
          } else {
            this.router.navigateByUrl('/I2BApplication/RecordingsCatalogFromMe');
          }
          this._notificationservice.success("Thanks for your valuable feedback.");
          //hidding loader icon
          this.appcmp.showLoader = false;
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error.error);
          //hiding loader after login
          this.appcmp.showLoader = false;
        });
        */
    
      return this.http
        .post(`${environment.domainApi}I2BRecordingRequest/InsertRecordingFeedBack`, data).subscribe(res=>{
          //this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
          if (res["length"] > 0) {
            if (res[0]['ResponseStatus'] == 'Success') {
          
              let IsUploading = localStorage.getItem('IsUploading');
              if (IsUploading == 'Y') {
                this.router.navigateByUrl('/I2BApplication/RequestsFromMe');
              } else {
                this.router.navigateByUrl('/I2BApplication/RecordingsCatalogFromMe');
              }
              this._notificationservice.success("Thanks for your valuable feedback.");
              //hidding loader icon
              this.appcmp.showLoader = false;
            } else {
              //hiding loader after login
              this.appcmp.showLoader = false;
            }
          }
        });
    }
  }
}

