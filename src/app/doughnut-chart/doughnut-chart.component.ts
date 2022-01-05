import { Component, OnInit,Input } from '@angular/core';
import { ChartType } from 'chart.js';
//import 'chart.piecelabel.js';  
import { MultiDataSet, Label,Colors } from 'ng2-charts';
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  @Input() newData :any;
  
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [100, 100, 200],
    [100, 450, 100],
    [150, 50, 100],
    // [50, 150, 120],
    // [250, 130, 70],
  ];

  
  chartOptions:any= {
  cutoutPercentage: 150,
  legend: {
    display: false
  },
}
  public doughnutChartColors: Colors[] = [
    {backgroundColor:["#0093fe","#fd7e14","#adb5bd"],},
    {backgroundColor:["#0093fe","#fd7e14","#adb5bd"]},
    {backgroundColor:["#0093fe","#fd7e14","#adb5bd"]},
    // {backgroundColor:"#fd7e14"},
    // {backgroundColor:"#adb5bd" }
  ];
 
  public doughnutChartType: ChartType = 'doughnut';
  constructor() {
    
   }

   

  ngOnInit() {
  // console.log('Response------',this.newData[0].Question)
   
  setTimeout(() => {
    console.log('Response------',this.newData)
  },1000);
  }




 

}
