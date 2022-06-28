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
  temperatureOutArray = new Array();

  lightOut: boolean | undefined;

  temperatureHistoryData: ChartDataset[] = [

    { data: [], label: 'Température' },

  ];

  temperatureHistoryLabels: string[] = [];

  temperatureHistoryOptions = {
    responsive: true,
  }

  temperatureHistoryLegends = false;

  constructor(protected thingworxAPI: ThingworxService) { }

  fillHoursHistory() {
    const hour = new Date().getHours().toString().length == 1 ? '0' + new Date().getHours().toString() : new Date().getHours().toString();
    const minute = new Date().getMinutes().toString().length == 1 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes().toString();
    const second = new Date().getSeconds().toString().length == 1 ? '0' + new Date().getSeconds().toString() : new Date().getSeconds().toString();

    if(this.temperatureHistoryLabels.length < 9) {
      this.temperatureHistoryLabels.push(hour + ':' + minute + ':' + second);
    }
    else {
      this.temperatureHistoryLabels.splice(0, 1);
      this.temperatureHistoryLabels.push(hour + ':' + minute + ':' + second);
    }
  }

  fillTemperatureArray(temperature: any) {
    if(this.temperatureOutArray.length < 9) {
      this.temperatureOutArray.push(temperature);
    }
    else {
      this.temperatureOutArray.splice(0, 1);
      this.temperatureOutArray.push(temperature);
    }
  }

  getTemperature() {
    this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
      if(temperature.rows[0].TEMP_TEMP < 23) {
        this.temperatureOut = 22;
      }
      else if(temperature.rows[0].TEMP_TEMP > 26) {
        this.temperatureOut = 27;
      }
      else {
        this.temperatureOut = temperature.rows[0].TEMP_TEMP;
      }

      this.fillTemperatureArray(this.temperatureOut);
      this.fillHoursHistory();

      this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];
    });
  }

  getTemperatureInterval() {
    setInterval(() => {
      this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
        if(temperature.rows[0].TEMP_TEMP > 23 || temperature.rows[0].TEMP_TEMP < 25) {
          this.temperatureOut = Math.floor(Math.random() * (Math.floor(26) - Math.ceil(22) + 1)) + Math.ceil(22);
        }
        else {
          this.temperatureOut = temperature.rows[0].TEMP_TEMP;
        }

        this.fillTemperatureArray(this.temperatureOut);
        this.fillHoursHistory();

        this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];
      })
    }, 2000);
  }

  getLight() {
    this.thingworxAPI.getLight().subscribe((light: any) => {
      if(light.rows[0].LIGHT_LUX > 50) {
        this.lightOut = true;
      }
      else {
        this.lightOut = false;
      }
    })
  }

  getLightInterval() {
    setInterval(() => {
      this.thingworxAPI.getLight().subscribe((light: any) => {
        if(light.rows[0].LIGHT_LUX > 20) {
          this.lightOut = true;
        }
        else {
          this.lightOut = false;
        }
      })
    }, 1000);
  }

  ngOnInit(): void {

    this.getTemperature();
    this.getTemperatureInterval();
    this.getLight();
    this.getLightInterval();

  }

}
