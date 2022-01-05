import { Component, OnInit } from '@angular/core';
import { ChartOptions,ChartColor, ChartType, ChartDataSets } from 'chart.js';
import { Colors, Label } from 'ng2-charts';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true
      },
      
    
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 70,25,100,24], label: 'Series A',
    
    
        categoryPercentage: 1,
        barPercentage: 1
   },
    { data: [28, 48, 80,30,47 ,60 ], label: 'Series B',
    
   
    categoryPercentage: 1,
    barPercentage: 1
     },
    { data: [40, 38, 35, 45,72,30], label: 'Series C',
    
    categoryPercentage: 1,
       
    barPercentage: 1
    },
    
  ];
  public barChartColors: Colors[] = [
    {backgroundColor:"#0093fe"},
    {backgroundColor:"#fd7e14"},
    {backgroundColor:"#adb5bd" }
  ];
  
  





  constructor() {
    
   }

  ngOnInit() {

    
  }
 

}
