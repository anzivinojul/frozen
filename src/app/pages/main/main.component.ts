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
    else if (temperature > 23) {
      this.temperatureClimatisation = temperature - 1;
      if(this.lightOut == true) {
        this.temperatureClimatisation--;
      }
    }
    else {
      this.temperatureClimatisation = 22;
      if(this.lightOut == true) {
        this.temperatureClimatisation--;
      }
    }
  }

  getTemperature() {
    this.thingworxAPI.getTemperature().subscribe((temperature: any) => {
      if(temperature.rows[0].TEMP_TEMP < 23 || temperature.rows[0].TEMP_TEMP > 25) {
        this.temperatureOut = (Math.random() * (25 - 23 + 1)) + 23;
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
      this.temperatureOut = (Math.random() * (25 - 23 + 1)) + 23;

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
        if(temperature.rows[0].TEMP_TEMP < 23 || temperature.rows[0].TEMP_TEMP > 25) {
          this.temperatureOut = (Math.random() * (25 - 23 + 1)) + 23;
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
        this.temperatureOut = (Math.random() * (25 - 23 + 1)) + 23;

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
      if(light.rows[0].LIGHT_LUX > 60) {
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
    const lastLight = this.lightOut;
    setInterval(() => {
      this.thingworxAPI.getLight().subscribe((light: any) => {
        if(light.rows[0].LIGHT_LUX > 60) {
          this.lightOut = true;
          if(this.auto) {
            this.findTemperatureClimatisation(this.temperatureOut);
          }
        }
        else {
          this.lightOut = false;
          if(this.auto) {
            this.findTemperatureClimatisation(this.temperatureOut);
          }
        }
      }, (error: any) => {
        this.lightOut = !this.lightOut;
      })
    }, 500);
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
