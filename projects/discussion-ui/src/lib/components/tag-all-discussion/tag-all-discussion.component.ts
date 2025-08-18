import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core'
import { NSDiscussData } from '../../models/discuss.model'
import { Router, ActivatedRoute } from '@angular/router'
import { DiscussionService } from '../../services/discussion.service';
/* tslint:disable */
import _ from 'lodash'
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import * as CONSTANTS from './../../common/constants.json';
import { DiscussUtilsService } from '../../services/discuss-utils.service';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { NavigationServiceService } from '../../navigation-service.service';

@Component({
  selector: 'lib-tag-all-discussion',
  templateUrl: './tag-all-discussion.component.html',
  styleUrls: ['./tag-all-discussion.component.scss']
})
export class TagAllDiscussionComponent implements OnInit {
  @Input() widgetTagName: any;
  @Input() widgetcIds: any;

  @Output() stateChange: EventEmitter<any> = new EventEmitter();

  routeParams: any;
  tagName!: any
  similarPosts :any[]
  queryParam: any
  fetchSingleCategoryLoader = false
  currentActivePage: 1
  defaultError = 'Something went wrong, Please try again after sometime!'
  pager = {}
  paginationData!: any
  fetchNewData = false
  paramsSubscription: Subscription;
  getParams: any;
  cIds: any;
  currentFilter = 'recent'
  showLoader = false;
  discussionList: any[];
  allTopics: any;
  showStartDiscussionModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discussService: DiscussionService, 
    public activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private telemetryUtils: TelemetryUtilsService,
    private discussUtils: DiscussUtilsService,
    private navigationService: NavigationServiceService
  ) { }

  ngOnInit() {
    // debugger
    this.cIds = this.widgetcIds? this.widgetcIds: this.configService.getCategories()

    if(this.widgetTagName)
    {
      this.tagName = this.widgetTagName;
    }
    else
    {
      this.activatedRoute.queryParams.subscribe((params) => {
        this.tagName = params.tagname ? params.tagname: this.tagName
      })
    }
    
    // To check wheather any contexts are there or not from the config service
    if (this.configService.hasContext() || this.widgetcIds) {
      this.fetchContextBasedTagDetails(this.tagName, this.cIds, this.currentActivePage)
    } else {
      this.fetchSingleTagDetails(this.tagName, this.currentActivePage)
    }

  }

  /**Method to fetch the tag based discussion */
  fetchSingleTagDetails(tagname: string, page?: any) {
    this.fetchSingleCategoryLoader = true
    this.discussService.getTagBasedDiscussion(tagname).subscribe(
      (data: NSDiscussData.IDiscussionData) => {
        this.similarPosts = [];
        _.filter(data.topics, (topic) => {
          if (topic.user.uid !== 0) {
            this.similarPosts.push(topic)
          }
        })
        // this.similarPosts = data.topics
        this.paginationData = data.pagination
        this.fetchSingleCategoryLoader = false
        this.setPagination()
      },
      (err: any) => {
        console.error('Error in fetching single tag details', err)
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        this.fetchSingleCategoryLoader = false
      })
  }

  /** Method to fetch the context based discussions */
  fetchContextBasedTagDetails(tagname: string, cid: any, page?: any) {
    this.fetchSingleCategoryLoader = true
    const req = {
      cid: cid.result,
      tag: tagname
    };

    this.discussService.getContextBasedTagDiscussion(req).subscribe(
      (data: NSDiscussData.IDiscussionData) => {
        this.similarPosts = [];
        _.filter(data.result, (topic) => {
          if (topic.user.uid !== 0) {
            this.similarPosts.push(topic)
          }
        })
        // this.similarPosts = data.resul
        // this.paginationData = data.pagination
        this.fetchSingleCategoryLoader = false
        this.setPagination()
      },
      (err: any) => {
        console.error('Error in fetching context based tag details', err)
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        this.fetchSingleCategoryLoader = false
      })
  }


  // TODO : for pagination
  // getNextData(tagname: string, page: any) {
  //   return this.discussService.fetchNextTagD(tagname, page).subscribe(
  //     (data: any) => {
  //       this.paginationData = data.pagination
  //       this.setPagination()
  //       this.similarPosts = _.get(data, 'topics')
  //     })
  // }

  setPagination() {
    this.pager = {
      startIndex: this.paginationData.first.page,
      endIndex: this.paginationData.last.page,
      pages: this.paginationData.pages,
      currentPage: this.paginationData.currentPage,
      totalPage: this.paginationData.pageCount,
    }
  }

  navigateWithPage(page: any) {
    if (page !== this.currentActivePage) {
      this.fetchNewData = true
      this.router.navigate([`${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TAG}tag-discussions`], { queryParams: { page, tagname: this.queryParam },  queryParamsHandling: "merge"  });
    }
  }

  /** Method to navigate to the dicussion detail page on click of tag related discussion */
  navigateToDiscussionDetails(discussionData) {
    debugger
    const matchedTopic = _.find(this.telemetryUtils.getContext(), { type: 'Topic' });
    if (matchedTopic) {
      this.telemetryUtils.deleteContext(matchedTopic);
    }

    this.telemetryUtils.uppendContext({
      id: _.get(discussionData, 'tid'),
      type: 'Topic'
    });

    let slug = _.trim(_.get(discussionData, 'slug'))
    let input = { data: { url: `${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`, queryParams: {} }, action: CONSTANTS.CATEGORY_DETAILS, }
    this.navigationService.navigate(input)
    this.stateChange.emit({ action: CONSTANTS.CATEGORY_DETAILS, title: discussionData.title, tid: discussionData.tid })

    // this.router.navigate([`${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${_.trim(_.get(discussionData, 'slug'))}`], { queryParamsHandling: "merge" });
  }

  logTelemetry(event) {
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.HOME);
  }

  // TODO: add refershdata function
  // refreshData(tagname: string, page: any) {
  //   if (this.fetchNewData) {
  //     // this.getNextData(tagname, page)
  //   }
  // }

  // for tag color
  public getBgColor(tagTitle: any) {
    const bgColor = this.discussUtils.stringToColor(tagTitle.toLowerCase());
    const color = this.discussUtils.getContrast();
    return { color, 'background-color': bgColor };
  }

  fillrecent(_page?: any) {
    this.getRecentData(_page)
  }

  fillPopular(page?: any) {
    this.showLoader = true;
    return this.discussService.fetchPopularD(page).subscribe((response: any) => {
      this.showLoader = false;
      this.discussionList = [];
      _.filter(response.topics, (topic) => {
        if (topic.user.uid !== 0 && topic.cid !== 1 ) {
          this.discussionList.push(topic);
        }
      });
      // this.discussionList = _.get(response, 'topics')
    }, error => {
      this.showLoader = false;
      // TODO: Toaster
      console.log('error fetching topic list', error);
    });
  }

  filter(key: string | 'recent' | 'popular') {
    if (key) {
      this.currentFilter = key;
      switch (key) {
        case 'recent':
          this.cIds.length ? this.getContextData(this.cIds.result) : this.fillrecent()
          break;
        case 'popular':
          this.cIds.length ? this.getContextData(this.cIds.result) : this.fillPopular()
          break;
        default:
          break;
      }
    }
  }

  getContextBasedDiscussion(cid: any) {
    this.currentFilter === 'recent' ? this.getContextData(cid) : this.getContextData(cid)
  }

  refreshData(page?: any) {
    this.currentFilter === 'recent' ? this.getRecentData(page) : this.fillPopular(page)
  }


  getRecentData(page: any) {
    this.showLoader = true;
    return this.discussService.fetchRecentD().subscribe(
      (data: any) => {
        this.showLoader = false;
        this.discussionList = [];
        _.filter(data.topics, (topic) => {
          if (topic.user.uid !== 0 && topic.cid !== 1) {
            this.discussionList.push(topic);
          }
        });
      }, error => {
        this.showLoader = false;
        // TODO: Toaster
        console.log('error fetching topic list', error);
      });
  }

  getContextData(cid: any) {
    this.showLoader = true;
    const req = {
      // request: {
      cids: cid
      // }
    };
    return this.discussService.getContextBasedDiscussion(req).subscribe(
      (data: any) => {
        this.showLoader = false;
        let result = data.result
        let res = result.filter((elem) => {
          return (elem.statusCode !== 404)
        })
        this.allTopics = _.map(res, (topic) => topic.topics);
        this.discussionList = _.flatten(this.allTopics)
      }, error => {
        this.showLoader = false;
        // TODO: Toaster
        console.log('error fetching topic list', error);
      });
  }



  
 

  

}
