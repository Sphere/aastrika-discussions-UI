import { Component, Input, OnInit } from '@angular/core';
import { EventsService } from '../../events.service';
import { NavigationServiceService } from '../../navigation-service.service';
import { ConfigService } from '../../services/config.service';
import { DiscussionService } from '../../services/discussion.service';
import * as _ from 'lodash'
import { IdiscussionConfig } from '../../models/discussion-config.model';

@Component({
    selector: 'sb-base-wrapper',
    templateUrl: './base-wrapper.component.html',
    styleUrls: ['./base-wrapper.component.css'],
    providers: [NavigationServiceService, EventsService],
    standalone: false
})
export class BaseWrapperComponent implements OnInit {

  @Input() config: IdiscussionConfig
  state: string
  constructor(private navigationServiceService: NavigationServiceService, private eventService: EventsService, private configSvc: ConfigService, private discussionService: DiscussionService) { }

  ngOnInit() {
    this.navigationServiceService.initService('wrapperService')
    this.configSvc.setConfig(this.config)
    this.discussionService.userName = _.get(this.config, 'userName')
    const rawCategories = _.get(this.config, 'categories')
    this.discussionService.forumIds = _.get(rawCategories, 'result')
    this.discussionService.initializeUserDetails(this.config.userName)

    this.eventService.toggleMenuItem.subscribe((data) => {
      this.wrapperEventListener(data)
      this.state = data.action
    
    })
    this.wrapperInit()
  }

  protected wrapperInit() { }

  protected wrapperEventListener(data) { }

}
