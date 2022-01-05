import { Component, Input } from '@angular/core';
//import { CommonServiceService } from './Service/common-service.service';
//import { NotificationService } from './toastr-notification/toastr-notification.service';
import { Router } from '@angular/router';
import { GlobalVariable } from './globals';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UserCatalogModalComponent } from './SurveyApplication/CommonComponent/user-catalog-modal/user-catalog-modal.component';
import {MatStepperModule} from '@angular/material/stepper';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MatDialog, UserCatalogModalComponent,MatStepperModule]
})
export class AppComponent {
  title = 'SurveyApp';
  @Input()
    
  public showLoader: boolean = false;
  public loadermessage: string = 'Please wait';
  public isSecure: boolean = false;
  public isSecureURL: boolean = true;
  
  constructor(private router: Router, /*private _notificationservice: NotificationService,*/ /*private service: CommonServiceService*/) {
    
  }

  ngOnInit(){

  }
}
