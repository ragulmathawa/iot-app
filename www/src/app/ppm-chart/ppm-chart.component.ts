import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ppm-chart',
  templateUrl: './ppm-chart.component.html',
  styleUrls: ['./ppm-chart.component.scss']
})
export class PpmChartComponent implements OnInit {
  @Input() data:any[];
  view: any[] = [650, 300];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'PPM';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() { }

  ngOnInit(): void {
  }

}
