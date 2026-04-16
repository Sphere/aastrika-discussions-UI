import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { DiscussionService } from '../../services/discussion.service';
import * as _ from 'lodash'
import { NavigationServiceService } from '../../navigation-service.service';
import * as CONSTANTS from '../../common/constants.json';
import { EventsService } from '../../events.service';
import { BaseWrapperComponent } from '../base-wrapper/base-wrapper.component';
@Component({
    selector: 'sb-category-widget',
    templateUrl: './category-widget.component.html',
    styleUrls: ['./category-widget.component.css'],
    standalone: false
})
export class CategoryWidgetComponent extends BaseWrapperComponent {

  detailsToggle = true;
  category = CONSTANTS.CATEGORY;
  detailsPage = CONSTANTS.CATEGORY_DETAILS
  homePage = CONSTANTS.CATEGORY_HOME
  tid: number = 77
  slug: string = 'testing-124'
  context: any = { categories: { result: [1, 2] },
}

  constructor(configSvc: ConfigService, discussionService: DiscussionService, navigationServiceService: NavigationServiceService, eventService: EventsService) {
    super(navigationServiceService, eventService, configSvc, discussionService)
  }


  wrapperInit() {
    this.state = this.detailsPage;
  }

  stateChange(event) {
    this.state = event.action
    if (event.action === this.detailsPage) {
      this.tid = event.tid
      this.slug = event.title
    }
  }

  protected wrapperEventListener(data) {
  }

}
