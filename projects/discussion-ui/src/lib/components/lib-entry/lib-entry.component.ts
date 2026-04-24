import { DiscussionService } from './../../services/discussion.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DiscussionEventsService } from './../../discussion-events.service';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { NSDiscussData } from './../../models/discuss.model';
import { IdiscussionConfig } from '../../models/discussion-config.model';
import { ConfigService } from '../../services/config.service';
import { Inject } from '@angular/core';
import { NavigationServiceService } from '../../navigation-service.service';
import { AbstractConfigService } from '../../services/abstract-config.service';
import { get } from 'lodash';
@Component({
    selector: 'lib-lib-entry',
    templateUrl: './lib-entry.component.html',
    styleUrls: ['./lib-entry.component.scss'],
    /* tslint:disable */
    host: { class: 'flex-1 main_discuss_lib', },
    standalone: false
})
export class LibEntryComponent implements OnInit {

  data: IdiscussionConfig;
  headerOption = true;
  banner: any
  private bannerSubscription: any
  bannerOption: boolean;
  currentRoute = 'all-discussions'
  pageKey: string;
  config: any;

  constructor(
    public activatedRoute: ActivatedRoute,
    private discussionService: DiscussionService,
    private configSvc: ConfigService,
    private location: Location,
    private navigationServiceService: NavigationServiceService,
    private discussionEventService: DiscussionEventsService,
    private telemetryUtils: TelemetryUtilsService,
    @Inject('configService') protected configService: AbstractConfigService

  ) {
    this.bannerSubscription = this.activatedRoute.data.subscribe(data => {
      if (data && data.pageData) {
        this.banner = data.pageData.data.banner || []
      }
    })
  }

  ngOnInit() {
    /**
     * calling the initservice to tell navigationservice to use the router service
     * because this component is invoke only in router approach 
     */
    this.navigationServiceService.initService('routerService')
    this.activatedRoute.queryParams.subscribe((params) => {
      // pagkey is used to read the configuration from the AbstractConfigService
      // since there could be multiple configurations.
      this.pageKey = get(params, 'page')
      this.config = this.configService.getConfig(get(params, 'page'))
      //setting the config so that other components can read the data
      this.configSvc.setConfig(JSON.parse(this.config))
      this.data = this.configSvc.getConfig();
      this.discussionService.userName = get(this.data, 'userName');
      const rawCategories = get(this.data, 'categories');
      this.discussionService.forumIds = get(rawCategories, 'result');
      this.discussionService.initializeUserDetails(this.data.userName);
      this.headerOption = this.configSvc.getHeaderOption()
      this.bannerOption = this.configSvc.getBannerOption()
    })
  }

  goBack() {
    this.location.back();
  }

  close(event: any) {
    const eventAction = {
      action: 'DF_CLOSE'
    };
    this.discussionEventService.emitTelemetry(eventAction);
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.LIB_ENTRY);
  }
}
