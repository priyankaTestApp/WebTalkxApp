import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-recording-catalog-types',
  templateUrl: './recording-catalog-types.component.html',
  styleUrls: ['./recording-catalog-types.component.css']
})
export class RecordingCatalogTypesComponent implements OnInit {

  //@Input() recordingType: boolean;
  //all variables are used for sharing data
  @Output() recordingTypeName: EventEmitter<any> = new EventEmitter();

  @Input() hiring_count: number;
  @Input() survey_count: number;
  @Input() reference_count: number;
  @Input() offline_count: number;
  @Input() single_count: number;
  @Input() multiple_count: number;
  @Input() marketresearch_count: number;
  @Input() compliance_count: number;
  @Input() employeesurvey_count: number;
  @Input() security_count: number;
  @Input() vendormanagement_count: number;
  //---end---//
  title: string;
  public show_dialog: boolean = false;
  public UserID: number;
  today: Date;
  model: any = {}
  form: FormGroup;
  sender_id: number;
  receiver_id: number;
  full_name: string;
  webtakxtype: string;
  
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
      //this.resizefilterDialog();
    };

    this.appcmp.loadermessage = 'Please wait...';
    //this.masterSelected = false;

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
   
   
    this.sender_id = Number(localStorage.getItem('UserID'));

    //this.joyrideService.closeTour();
    this.model.WebtalkxType = 'Compliance';
    this.model.ParticipantType = 'Single Participant';
   
    //this.onPageLoad();
  }


  //Method to select the webtalk type
  selectWebTalkType(element, type) {
    this.webtakxtype = type;

    //we are emitting output variable
    this.recordingTypeName.emit(type);

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
    

  }

  // method to show participant type based on @Input
  onPageLoad() {



    //else if (this.recordingType == 'Review Catalog') {
    //  this.showParticipants = true;
    //}
    //else if (this.recordingType == 'My Recordings') {
    //  this.showParticipants = false;
    //}
  }
}
