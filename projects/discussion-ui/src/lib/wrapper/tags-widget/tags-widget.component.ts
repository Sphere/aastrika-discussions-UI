import { Component } from '@angular/core';
import { EventsService } from '../../events.service';
import { NavigationServiceService } from '../../navigation-service.service';
import { ConfigService } from '../../services/config.service';
import { DiscussionService } from '../../services/discussion.service';
import { BaseWrapperComponent } from '../base-wrapper/base-wrapper.component';

@Component({
  selector: 'sb-tags-widget',
  templateUrl: './tags-widget.component.html',
  styleUrls: ['./tags-widget.component.css']
})
export class TagsWidgetComponent extends BaseWrapperComponent {

  tags: string = 'tags'
  tagsAll: string = 'tagsAll'
  tagName: string

  constructor(configSvc: ConfigService, discussionService: DiscussionService, navigationServiceService: NavigationServiceService, eventService: EventsService) {
    super(navigationServiceService, eventService, configSvc, discussionService)
  }

  wrapperInit() {
    this.state = this.tags
  }

  wrapperEventListener(data) {
    // if (data.action === this.tags || data.action === this.tagName) {
    //   this.state = data.action
    // }
    this.tagName = data.tagName
  }

}
