import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThingworxService {

  constructor(protected http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      appKey: '2da79b97-9ea4-4cc7-b223-3d82a0af1fd4',
    }),
  };

  getTemperature() {
    return this.http.get(`http://localhost:8080/http://miage.mecanaute.com:22222/Thingworx/Things/MIAGE.84338C/Properties/TEMP_TEMP`, this.httpOptions);
  }

  getLight() {
    return this.http.get(`http://localhost:8080/http://miage.mecanaute.com:22222/Thingworx/Things/MIAGE.84338C/Properties/LIGHT_LUX`, this.httpOptions);
  }
}
