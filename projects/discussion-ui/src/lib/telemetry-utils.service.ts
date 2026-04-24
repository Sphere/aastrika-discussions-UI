
import { DiscussionEventsService } from './discussion-events.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { last, find, isEmpty, isEqual, reject, get } from 'lodash';
interface ITelemetryObj {
  eid: string,
  edata: {},
  context?: {}
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryUtilsService {

  _context: any = []
  currentObj: any = {};

  constructor(
    private discussionEvents: DiscussionEventsService,
    private router: Router
  ) { }

  setContext(context: any) {
    this._context = context;
    this.currentObj = last(context);
  }

  uppendContext(data: any) {
    const matchedC = find(this._context, { id: data.id });
    if (!isEmpty(data) && !isEqual(data, matchedC)) {
      this._context.push(data);
    }
    this.currentObj = last(this._context);
  }

  deleteContext(prevTopic: any) {
    const topic = find(this._context, prevTopic);
    if (topic) {
      this._context = reject(this._context, topic);
    }
  }

  getContext() {
    return this._context;
  }

  logImpression(pageId: any) {
    this.discussionEvents.emitTelemetry({});
    const impressionEvent: ITelemetryObj = {
      eid: 'IMPRESSION',
      edata: {
        type: 'view',
        pageid: pageId,
        uri: this.router.url
      }
    }
    if (this.currentObj) {
      impressionEvent.context = { cdata: [{
        id: get(this.currentObj, 'id'),
        type: get(this.currentObj, 'type') }
      ]};
    }
    this.discussionEvents.emitTelemetry(impressionEvent);
  }

  logInteract(event: any, pageId: any) {
    const target = get(event, 'currentTarget.attributes.id') ||  get(event, 'target.attributes.id') ||
     get(event, 'srcElement.attributes.id');
    const interactEvent: ITelemetryObj = {
      eid: 'INTERACT',
      edata: {
        id: get(target, 'value') || get(event, 'action'),
        type: 'CLICK',
        pageid: pageId
      }
    };

   if (this.currentObj?.id) {
      const id = this.currentObj.id.toString();

      const object:any = {
        id,
        type: this.currentObj?.type,
        ver: '1'
      };

      object['rollup'] = this._context.length > 1 ? this.getRollUp() : {};

      interactEvent.context = {
        cdata: [{
          id,
          type: this.currentObj?.type
        }],
        object
      };
    }
    this.discussionEvents.emitTelemetry(interactEvent);
  }

  getRollUp() {

      const rollUp = {};
      const data = reject(this._context, this.currentObj);

      if (this._context.length > 1) {
        data.forEach((element, index) => {
          console.log('rollup', element);
          rollUp['l' + (index + 1)] = element.toString();
        });
      }

      if (get(this.currentObj, 'type') !== 'Post') {
        return rollUp;
      }

      return {};

  }

}
