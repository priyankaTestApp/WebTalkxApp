import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-RegistMsg',
  templateUrl: './RegistMsg.component.html',
  styleUrls: ['./RegistMsg.component.css']
})

export class RegistMsgComponent implements OnInit {
  title:string;
  constructor(private titleService: Title, private appcmp: AppComponent) {
    //this.title = "Register message | " + appcmp.title;
    this.title = appcmp.title + " | Register message";
  }

    ngOnInit() {
      //this.ngOnInit();
      //Added below code to update the title
      this.titleService.setTitle(this.title);
  }

}
