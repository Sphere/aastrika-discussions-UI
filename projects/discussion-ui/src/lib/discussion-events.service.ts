import { Injectable, EventEmitter } from '@angular/core';
import { isEmpty } from 'lodash';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DiscussionEventsService {

  public telemetryEvent = new Subject<any>();
  public actionEvent = new EventEmitter<any>();

  constructor() { }

  emitTelemetry(event) {
    //console.log('Lib Event', event);
    if (!isEmpty(event)) {
      this.telemetryEvent.next(event);
    }
  }
}
