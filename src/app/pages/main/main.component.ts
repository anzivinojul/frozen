import { Component, OnInit } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { ThingworxService } from 'src/app/core/api/thingworx.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  temperatureOut: any;

  temperatureHistoryData: ChartDataset[] = [

    { data: [22,23,23,24,24,26,26,27,26,25,24,22,20], label: 'Température' },

  ];

  temperatureHistoryLabels: string[] = [];

  temperatureHistoryOptions = {
    responsive: true,
  }

  temperatureHistoryLegends = false;

  constructor(protected thingworxAPI: ThingworxService) { }

  fillHoursHistory() {
    const dateToday = new Date();
    let actualHour = dateToday.getHours();
    let actualHourString = '';

    for(let i = 0 ; i <= 10 ; i++) {

      if(actualHour == 0) {
        actualHour = 23;
        actualHourString = actualHour.toString();
        this.temperatureHistoryLabels.push(actualHourString + 'h');
      }
      else if(actualHour < 11) {
        actualHour--;
        actualHourString = actualHour.toString();
        this.temperatureHistoryLabels.push('0' + actualHourString + 'h');
      }
      else {
        actualHour--;
        actualHourString = actualHour.toString();
        this.temperatureHistoryLabels.push(actualHourString + 'h');
      }

    }

    this.temperatureHistoryLabels.reverse();
  }

  getTemperature() {
    setInterval(() => {
      this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
        this.temperatureOut = temperature.rows[0].TEMP_TEMP;
      })
    }, 2000)
  }

  ngOnInit(): void {

    this.getTemperature();
    this.fillHoursHistory();

  }

}
