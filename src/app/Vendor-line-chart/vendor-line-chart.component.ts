import { Component, OnInit } from '@angular/core';
//import { CommonService } from '../CommonService/commonfunction.service';
import { AppComponent } from '../app.component';
import { HttpErrorResponse } from '@angular/common/http';
//import { NotificationService } from '../toastr-notification/toastr-notification.service';
import { GlobalVariable } from '../globals';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'vendor-line-chart',
  templateUrl: './vendor-line-chart.component.html',
  styleUrls: ['./vendor-line-chart.component.css']
})
export class VendorLineChartComponent implements OnInit {

  //width = 1000;
  height = 300;
  type = "msline";
  dataFormat = "json";
  //dataSource = data;

  dataSource: any;

  MonthName: string;

  MonthNumber: number;
  RecordingCount: number;
  ReplayCount: number;
  UserID: number;

  constructor(/*public commonservice: CommonService,*/ private http: HttpClient, private appcmp: AppComponent/*, public _notificationservice: NotificationService*/) { }
  ngOnInit() {
    
    this.UserID = Number(localStorage.getItem('LoginUserID'));

    //Method to get the line chart data
    this.GetLineChartData();
  }

  //method for getting the lineChart data
  GetLineChartData() {
    // this.commonservice.VendorLineChartData(this.UserID).subscribe(res => {

    //   if (res["length"] > 0) {
    //     if (res[0]['ResponseStatus'] == 'Success') {
    //       /*this.MonthName = res[0]['MonthName'];
    //       this.MonthNumber = res[0]['MonthNumber'];
    //       this.RecordingCount = res[0]['RecordingCount'];
    //       this.ReplayCount = res[0]['ReplayCount'];*/

    //       this.setChartData(res);
    //     }
    //   } else {
    //     //hiding loader
    //     this.appcmp.showLoader = false;
    //   }
    // },
    //   (error: HttpErrorResponse) => {
    //     console.log(error.error);
    //     this._notificationservice.error(GlobalVariable.TechnicalError);
    //   });

    let uid = this.UserID;
    return this.http
      .get(`${environment.domainApi}Chart/GetLineChartDataForVendor?UserID=`+ uid).subscribe(res=>{
        if (res["length"] > 0) {
          if (res[0]['ResponseStatus'] == 'Success') {
            /*this.MonthName = res[0]['MonthName'];
            this.MonthNumber = res[0]['MonthNumber'];
            this.RecordingCount = res[0]['RecordingCount'];
            this.ReplayCount = res[0]['ReplayCount'];*/
  
            this.setChartData(res);
          }
        } else {
          //hiding loader
          this.appcmp.showLoader = false;
        }
      });
  }

  //method for setting the chart data
  setChartData(res) {
    let categoryData: any = [], response, recordingCount: any = [], replayCount: any = [];
    response = res;

    for (let i = 0; i < response.length; i++) {

      categoryData.push({
        "label": response[i]['MonthName'] + '<br>' + response[i]['YearNumber'] 
      });

      recordingCount.push({
        "value": response[i]['RecordingCount']
      });

      replayCount.push({
        "value": response[i]['ReplayCount']
      });
    }

    //if (!categoryData.includes('January')) categoryData.push({ "label": 'January'});
    //if (recordingCount && replayCount) {
      this.dataSource = {
        chart: {
          caption: "",
          // yaxisname: "% of youth on this platform",
          //subcaption: "Charity Contribution",
          showhovereffect: "1",
          numbersuffix: "",
          drawcrossline: "1",
          plottooltext: "<b>$dataValue</b> $seriesName",
          theme: "fusion",
          paletteColors: "#0075c2,#1aaf5d",
          bgcolor: "#ffffff",
          anchorRadius: "5",
        },
        categories: [
          {
            category: categoryData
          }
        ],
        dataset: [
          {
            lineThickness : 3,
            seriesname: "Number of recordings",
            data: recordingCount,
            anchorBgColor: "#0075c2",
          },
          {
            lineThickness: 3,
            seriesname: "Number of replays",
            data: replayCount,
            anchorBgColor: "#1aaf5d",
          }
        ]
      };
    //}
  }

}



