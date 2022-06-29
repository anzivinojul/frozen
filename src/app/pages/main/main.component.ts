import { Component, OnInit } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { Subscription } from 'rxjs';
import { ThingworxService } from 'src/app/core/api/thingworx.service';
import { SharedataService } from 'src/app/core/sharedata.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  temperatureOut: any;
  temperatureOutArray = new Array();

  lightOut: boolean | undefined;

  temperatureClimatisation: any;

  temperatureHistoryData: ChartDataset[] = [

    { data: [], label: 'Température' },

  ];

  temperatureHistoryLabels: string[] = [];

  temperatureHistoryOptions = {
    responsive: true,
  }

  temperatureHistoryLegends = false;

  auto: boolean | undefined;
  subscription: Subscription | undefined;

  constructor(protected thingworxAPI: ThingworxService, protected shareData: SharedataService) { }

  fillHoursHistory() {
    const hour = new Date().getHours().toString().length == 1 ? '0' + new Date().getHours().toString() : new Date().getHours().toString();
    const minute = new Date().getMinutes().toString().length == 1 ? '0' + new Date().getMinutes().toString() : new Date().getMinutes().toString();
    const second = new Date().getSeconds().toString().length == 1 ? '0' + new Date().getSeconds().toString() : new Date().getSeconds().toString();

    if(this.temperatureHistoryLabels.length < 7) {
      this.temperatureHistoryLabels.push(hour + ':' + minute + ':' + second);
    }
    else {
      this.temperatureHistoryLabels.splice(0, 1);
      this.temperatureHistoryLabels.push(hour + ':' + minute + ':' + second);
    }
  }

  fillTemperatureArray(temperature: any) {
    if(this.temperatureOutArray.length < 7) {
      this.temperatureOutArray.push(temperature);
    }
    else {
      this.temperatureOutArray.splice(0, 1);
      this.temperatureOutArray.push(temperature);
    }
  }

  findTemperatureClimatisation(temperature: number) {
    if(temperature > 26) {
      this.temperatureClimatisation = temperature - 3;
      if(this.lightOut == true) {
        this.temperatureClimatisation--;
      }
    }
    else if (temperature > 24) {
      this.temperatureClimatisation = temperature - 2;
      if(this.lightOut == true) {
        this.temperatureClimatisation--;
      }
    }
    else if (temperature == 24) {
      this.temperatureClimatisation = temperature - 1;
      if(this.lightOut == true) {
        this.temperatureClimatisation--;
      }
    }

    console.log(this.temperatureClimatisation);

  }

  getTemperature() {
    this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
      if(temperature.rows[0].TEMP_TEMP < 23 || temperature.rows[0].TEMP_TEMP > 27) {
        this.temperatureOut = Math.floor(Math.random() * (Math.floor(28) - Math.ceil(22) + 1)) + Math.ceil(22);
      }
      else {
        this.temperatureOut = temperature.rows[0].TEMP_TEMP;
      }

      this.fillTemperatureArray(this.temperatureOut);
      this.fillHoursHistory();

      this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];

      if(this.auto) {
        this.findTemperatureClimatisation(this.temperatureOut);
      }

    }, (error: any) => {
      this.temperatureOut = Math.floor(Math.random() * (Math.floor(28) - Math.ceil(22) + 1)) + Math.ceil(22);

      this.fillTemperatureArray(this.temperatureOut);
      this.fillHoursHistory();

      this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];

      if(this.auto) {
        this.findTemperatureClimatisation(this.temperatureOut);
      }
    });
  }

  getTemperatureInterval() {
    setInterval(() => {
      this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
        if(temperature.rows[0].TEMP_TEMP < 23 || temperature.rows[0].TEMP_TEMP > 27) {
          this.temperatureOut = Math.floor(Math.random() * (Math.floor(28) - Math.ceil(22) + 1)) + Math.ceil(22);
        }
        else {
          this.temperatureOut = temperature.rows[0].TEMP_TEMP;
        }

        this.fillTemperatureArray(this.temperatureOut);
        this.fillHoursHistory();

        this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];

        if(this.auto) {
          this.findTemperatureClimatisation(this.temperatureOut);
        }

      }, (error: any) => {
        this.temperatureOut = Math.floor(Math.random() * (Math.floor(28) - Math.ceil(22) + 1)) + Math.ceil(22);

        this.fillTemperatureArray(this.temperatureOut);
        this.fillHoursHistory();

        this.temperatureHistoryData = [ { data: this.temperatureOutArray, label: 'Température' } ];

        if(this.auto) {
          this.findTemperatureClimatisation(this.temperatureOut);
        }
      });
    }, 4000);
  }

  getLight() {
    this.thingworxAPI.getLight().subscribe((light: any) => {
      if(light.rows[0].LIGHT_LUX > 50) {
        this.lightOut = true;
      }
      else {
        this.lightOut = false;
      }
    }, (error: any) => {
      this.lightOut = true;
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
      }, (error: any) => {
        this.lightOut = !this.lightOut;
      })
    }, 1000);
  }

  plusTemperature() {
    if(!this.auto) {
      this.temperatureClimatisation++;
    }
  }

  minusTemperature() {
    if(!this.auto) {
      this.temperatureClimatisation--;
    }
  }

  ngOnInit(): void {

    this.subscription = this.shareData.currentBoolean.subscribe(boolean => this.auto = boolean);

    this.getTemperature();
    this.getTemperatureInterval();
    this.getLight();
    this.getLightInterval();

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
