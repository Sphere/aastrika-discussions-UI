import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private _navItemSource = new BehaviorSubject<any>(0);
  // Observable navItem stream
  navItem$ = this._navItemSource.asObservable();
  registeredEvents: Array<Object> = [];
  toggleMenuItem: ReplaySubject<any> = new ReplaySubject(1)

  constructor() { }
  /**
   * This function is used to update the states in widget with data
   * @param  {} data
   * TODO: Not being used anymore have to cleanup   
   */
  toggle(data) {
    this.toggleMenuItem.next(data);
  }

}
