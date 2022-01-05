import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { log } from 'util';
@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {
  @Input() data: string;
  showdashboard: boolean;
  showApp: boolean;
  dashboardData: any;

  @Output() dashboardDetails = new EventEmitter<string>();
  model: any = {};
  title: string;
  ProfileImage: string;
  public UserName: any;
  UserID: number;
  domain_url: string;
  roleName: string;
  @Input()video_url: string;
  aggr_data:any
  fulldata:any;
  //title = 'Example of Angular 8 DataTable';
 // dtOptions: DataTables.Settings = {};
  dtUsers =[
    {"id": 101, "firstName": "Anil", "lastName": "Singh"},
    {"id": 102, "firstName": "Reena", "lastName": "Singh"},
    {"id": 103, "firstName": "Aradhay", "lastName": "Simgh"},
    {"id": 104, "firstName": "Dilip", "lastName": "Singh"},
    {"id": 105, "firstName": "Alok", "lastName": "Singh"},
    {"id": 106, "firstName": "Sunil", "lastName": "Singh"},
    {"id": 107, "firstName": "Sushil", "lastName": "Singh"},
    {"id": 108, "firstName": "Sheo", "lastName": "Shan"},
    {"id": 109, "firstName": "Niranjan", "lastName": "R"},
    {"id": 110, "firstName": "Lopa", "lastName": "Mudra"},
    {"id": 111, "firstName": "Paramanand","lastName": "Tripathi"}
  ];


  //Assigning below project title as common name and getting passed to all the child component
  public showNavigation: boolean = true;

  constructor(private http: HttpClient, private titleService: Title, private appcmp: AppComponent, private router: Router) {
    this.title = appcmp.title;
    //if (localStorage.getItem('LoginUserID') == "" || localStorage.getItem('LoginUserID') == null) {
    //  this.router.navigateByUrl('/userlogin');
    //}

  }







  //@HostListener('document:keyup', ['$event'])
  //@HostListener('document:click', ['$event'])
  //@HostListener('document:wheel', ['$event'])

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

  ngOnInit() {
    //this._commonservice.startTourEvent.subscribe((data) => {
    //  if (data && data.length > 0) {
    //    this.tour();
    //  }
    //  console.log(data);
    //});

    this.initAdminScript();

    localStorage.setItem('InProgress', '');
    localStorage.setItem('IsUploading', '');


    this.UserName = localStorage.getItem('LoginFullName');

    //converting user's first letter to be capital
  
    this.title = "Welcome " + this.title;
    this.roleName = localStorage.getItem('Role');
    if (this.roleName && this.roleName == 'Requester') this.roleName = 'Vendor';
    this.domain_url = `${environment.domainApi}`;

   
    //Added below code to update the title
    this.titleService.setTitle(this.title);

    //Method to get unread notification
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    //this.video_url = this.video_url;


    this.GetAggregateSentimentData()

  }

//method for getting the lineChart data
GetAggregateSentimentData() {

  let uid = this.UserID;
  return this.http
  .get(`http://20.109.157.87/graph/sentiment/aggregate/`).subscribe(res=>{
  //console.log("res2", res['status'], res['aggregate_data']);
  if (res["status"] == 'success') {
  this.aggr_data = res['aggregate_data'];
  this.fulldata = res['aggregate_data'];
  }
  });
  }




  getTestData(e) {
    //if(recording_player)
    this.video_url = e;
    (<any>$('#recordingPlayerModel')).modal('show');
  }


 

 
}
