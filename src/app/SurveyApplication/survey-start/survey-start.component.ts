import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators, AbstractControl, NgModel } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
//import { NotificationService } from '../../toastr-notification/toastr-notification.service';
//import { GlobalVariable } from '../../globals';

@Component({
  selector: 'app-survey-start',
  templateUrl: './survey-start.component.html',
  styleUrls: ['./survey-start.component.css']
})
export class SurveyStartComponent implements OnInit {
  model:any = {};
  title: string;

  constructor(private router: Router, private titleService: Title, private appcmp: AppComponent, /*private commonservice: CommonService, public _notificationservice: NotificationService*/) {
    this.title = "New Application | " + appcmp.title;
  }

  ngOnInit(): void {
  }

  
  // Function for calling user login.
  onSubmit(form: NgForm) {
    //console.log(form.value);

    if (form.valid) {
      this.router.navigateByUrl('/SurveyApp/Record');  

      /*
      this.appcmp.showLoader = true;
      form.value.UserID = localStorage.getItem("UserId");   
      form.value.ApplicationNumber  = '';
      form.value.ApplicationName = '';
      
      if (this.NeedSitePlan == 'no' || this.NeedSitePlan == '' || form.value.SitePlanApproval == '' || form.value.SitePlanApproval == 'undefined') form.value.SitePlanApproval = "Not Required";
      localStorage.setItem("ApplicationFees", String(form.value.ApplicantFee));
      localStorage.setItem("Address", form.value.OwnerAddress);
      localStorage.setItem("PaymentType", "Tree Removal Fee");
      
      this.treeremoveform.InsertTreeRemovalForm(form.value).subscribe(res => {
        if (res["length"] > 0) {
          if (res[0]['ResponseStatus'] == 'Success') {
            this.appcmp.showLoader = false;
            
            let applicationId = res[0]['ApplicationID'];
            
            if (this.isPaymentToProceed) {
              this.isPaymentToProceed = false;            
              if (applicationId) {
                //localStorage.setItem("ApplicationId", String(applicationId));
                localStorage.setItem("EditApplicationId", String(applicationId));
                this.router.navigateByUrl('/TreeRemovePermit/PaymentMethod');               

                //Now upload the document
                this.uploadTheSelectedDocument(applicationId);
              }
              this.appcmp.showLoader = false;
              //this._notificationservice.success("Application submitted successfully.");
            }
           
          }
          if (res[0]['ResponseStatus'] == "Success - No data available") {
            this.appcmp.showLoader = false;
            this._notificationservice.error(GlobalVariable.TechnicalError);
          }
        } else {
          this.appcmp.showLoader = false;
          this._notificationservice.error(GlobalVariable.TechnicalError);
        }
      },

        (error: HttpErrorResponse) => {

          this.appcmp.showLoader = false;
          this._notificationservice.error(GlobalVariable.TechnicalError);
        });*/
    }
  }

}
