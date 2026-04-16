import { CONTEXT_PROPS } from './../../services/discussion.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionService } from '../../services/discussion.service';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import * as CONSTANTS from './../../common/constants.json';
/* tslint:disable */
import * as _ from 'lodash'
import { NSDiscussData } from '../../models/discuss.model';
import { ConfigService } from '../../services/config.service';
import { NavigationServiceService } from '../../navigation-service.service';
/* tslint:enable */

@Component({
    selector: 'lib-discuss-home',
    templateUrl: './discuss-home.component.html',
    styleUrls: ['./discuss-home.component.scss'],
    standalone: false
})
export class DiscussHomeComponent implements OnInit {
  
  @Input() categoryId;
  @Input() categoryHomeAction;
  @Output() stateChange: EventEmitter<any> = new EventEmitter();

  

  discussionList = [];
  routeParams: any;
  showStartDiscussionModal = false;
  // categoryId: string;
  isTopicCreator = false;
  showLoader = false;
  currentActivePage: number = 1;

  // Input parameters for infinite scroll
  modalScrollDistance = -12;
  modalScrollThrottle = 500;
  scrollUpDistance = 5;

  currentPage = 0 ;
  pageSize: number;
  totalTopics: number;
  title: any;
  trendingTags: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private configService: ConfigService,
    private telemetryUtils: TelemetryUtilsService,
    private navigationService: NavigationServiceService) { }

  ngOnInit() {
    this.telemetryUtils.logImpression(NSDiscussData.IPageName.HOME);
    this.route.params.subscribe(params => {
      this.configService.setCategoryId.subscribe((categoryIds: string) => {
        this.routeParams = categoryIds;
        // categoryIds = this.discussionService.getContext(CONTEXT_PROPS.cid)
        categoryIds = this.categoryId ? this.categoryId : categoryIds
        this.getDiscussionList(categoryIds);
      })
      // this.routeParams = params;
      // this.categoryId = this.discussionService.getContext(CONTEXT_PROPS.cid);
      // this.getDiscussionList(_.get(this.routeParams, 'slug'));
    });

    this.fetchAllTags();

  
  }

  navigateToDiscussionDetails(discussionData) {
    const matchedTopic = _.find(this.telemetryUtils.getContext(), { type: 'Topic' });
    if (matchedTopic) {
      this.telemetryUtils.deleteContext(matchedTopic);
    }

    this.telemetryUtils.uppendContext({
      id: _.get(discussionData, 'tid'),
      type: 'Topic'
    });
    let routerSlug = this.configService.getConfig().routerSlug ? this.configService.getConfig().routerSlug : ''
    let input = { data: { url: `${routerSlug}${CONSTANTS.ROUTES.TOPIC}${_.trim(_.get(discussionData, 'slug'))}`, queryParams: {}, tid: discussionData.tid, title: discussionData.title }, action: CONSTANTS.CATEGORY_DETAILS }
    this.navigationService.navigate(input)
    this.stateChange.emit({ tid: discussionData.tid, title: discussionData.title, action: this.categoryHomeAction })
  }
  /**
   * @description - To get all the topics
   * @param - required cid as a slug
   */
  getDiscussionList(slug: string) {
    this.showLoader = true;
    
    // TODO : this.currentActivePage shoulb be dynamic when pagination will be implemented
    this.discussionService.getContextBasedTopic(slug, this.currentActivePage).subscribe(data => {
   
      this.showLoader = false;
      this.title = _.get(data, 'title')
      this.isTopicCreator = _.get(data, 'privileges.topics:create') === true ? true : false;
      this.discussionList = [...this.discussionList, ...(_.union(_.get(data, 'topics'), _.get(data, 'children')))];
      if (this.currentPage === 1) {
      this.pageSize = _.get(data, 'nextStart'); // count of topics per page
      }
      this.totalTopics = _.get(data, 'totalTopicCount'); // total count of topics
    }, error => {
      this.showLoader = false;
      // TODO: Toaster
      console.log('error fetching topic list', error);
    });
  }

  startDiscussion() {
    this.showStartDiscussionModal = true;
  }

  logTelemetry(event) {
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.HOME);
  }

  closeModal(event) {
    if (_.get(event, 'message') === 'success') {
      this.discussionList = [];
      this.currentPage = 0;
      this.getDiscussionList(this.routeParams);
    }
    this.showStartDiscussionModal = false;
  }

  fetchAllTags() {
    this.showLoader = true;
    this.discussionService.fetchAllTag().subscribe(data => {
      this.showLoader = false;
      this.trendingTags = _.get(data, 'tags');
    }, error => {
      this.showLoader = false;
      // TODO: toaster
      console.log('error fetching tags');
    });
  }


  /**
   * @description - call the topic get api when scrolled down
   */
  onModalScrollDown() {
    const pageId = this.currentPage - 1;
    if ( (this.pageSize * pageId) < this.totalTopics) {  // should fail when it reaches the total topics
    this.getDiscussionList(_.get(this.routeParams, 'slug'));
    }
  }
}
