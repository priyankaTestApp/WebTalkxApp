import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { debounce } from 'rxjs/operators';

@Component({
  selector: 'app-replay-player-modal',
  templateUrl: './replay-player-modal.component.html',
  styleUrls: ['./replay-player-modal.component.css']
})
export class ReplayPlayerModalComponent implements OnInit {
  model: any = {};
  title: string;
  ProfileImage: string;
  public UserName: any;
  UserID: number;
  domain_url: string;
  roleName: string;

  //to get video url from its all parent components
  @Input() video_url: string;


  //Assigning below project title as common name and getting passed to all the child component
  public showNavigation: boolean = true;

  constructor(private http: HttpClient, private titleService: Title, private appcmp: AppComponent, private router: Router) {
    this.title = appcmp.title;
    //if (localStorage.getItem('LoginUserID') == "" || localStorage.getItem('LoginUserID') == null) {
    //  this.router.navigateByUrl('/userlogin');
    //}

    //Added window resize event and perform required operation
    window.onresize = (e) => {
      //Method to set the dialog height as per the window height
      this.resizefilterDialog();
    };

  }
  // Method to init the admin js file.
  public initAdminScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'assets/js/sb-admin-2.min.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit(): void {
    this.initAdminScript();
  }

  //Method to stop the video playing
  stopVideoPlayer(recording_player) {
    
    if (recording_player) recording_player.pause();
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
