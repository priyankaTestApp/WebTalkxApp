import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-survey-complete',
  templateUrl: './survey-complete.component.html',
  styleUrls: ['./survey-complete.component.css']
})
export class SurveyCompleteComponent implements OnInit {

  constructor(private appcmp: AppComponent) { 
    
    //hiding loader after login
    this.appcmp.showLoader = false;
  }

  ngOnInit(): void {
    
    //hiding loader after login
    this.appcmp.showLoader = false;
  }

}
