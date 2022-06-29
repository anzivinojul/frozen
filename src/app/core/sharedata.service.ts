import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedataService {

  private booleanSource = new BehaviorSubject(true);
  currentBoolean = this.booleanSource.asObservable();

  constructor() { }

  changeBoolean(auto: boolean) {
    this.booleanSource.next(auto);
  }
}
