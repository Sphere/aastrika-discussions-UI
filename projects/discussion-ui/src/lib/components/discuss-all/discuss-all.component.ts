import { CONTEXT_PROPS } from './../../services/discussion.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscussionService } from '../../services/discussion.service';
import { ConfigService } from '../../services/config.service';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { NSDiscussData } from '../../models/discuss.model';
import { Subject, Subscription } from 'rxjs';
import { DiscussionUIService } from '../../services/discussion-ui.service';
import { filter, map, takeUntil } from 'rxjs/operators'
import { get, union, orderBy, flatten } from 'lodash';

/* tslint:enable */

@Component({
    selector: 'lib-discuss-all',
    templateUrl: './discuss-all.component.html',
    styleUrls: ['./discuss-all.component.scss'],
    standalone: false
})
export class DiscussAllComponent implements OnInit {

  @Input() context: any
  @Input() categoryAction;
  // @Input() topicId: any;
  // @Input() slug: string;

  @Output() stateChange: EventEmitter<any> = new EventEmitter();
  @Output() dismissModal: EventEmitter<any> = new EventEmitter();

  discussionList: any[];
  privilegesData: any;
  routeParams: any;
  showStartDiscussionModal = false;
  categoryId: string;
  isTopicCreator = false;
  showLoader = false;
  currentFilter = 'recent'
  currentActivePage: number = 1;
  fetchNewData: false;
  // modalRef: BsModalRef;
  paramsSubscription: Subscription;
  getParams: any;
  cIds: any = [];
  allTopics: any;
  trendingTags!: NSDiscussData.ITag[];
  sticky = false;
  data
  startDiscussionCategoryId: any;
  isWidget: boolean;
  showModerationModal = false
  displayState = 'VIEW_ALL'
  public unsubscribe = new Subject<void>();
  constructor(
    public router: Router,
    private discussionService: DiscussionService,
    private configService: ConfigService,
    public activatedRoute: ActivatedRoute,
    private telemetryUtils: TelemetryUtilsService,
    private discussionUIService: DiscussionUIService
  ) { }

  ngOnInit() {
    this.discussionUIService.showReplay$.pipe(takeUntil(this.unsubscribe)).subscribe( data =>  {
      if(data){
        this.displayState = data
      }
    });
    /* load discussion data after edit the comment */ 
    this.discussionUIService.eidtComment$.pipe(takeUntil(this.unsubscribe)).subscribe( data =>  {
      if(data){
        this.showLoader = false;
        this.loadDiscussionData()
      }
    });
    /* load discussion data after delting the comment */ 
    this.discussionUIService.deleteComment$.pipe(takeUntil(this.unsubscribe)).subscribe( data =>  {
      if(data){
        this.showLoader = false;
        this.loadDiscussionData()
      }
    });
    this.discussionUIService.replyComment$.pipe(takeUntil(this.unsubscribe)).subscribe( data =>  {
      if(data){
        this.showLoader = false;
        this.loadDiscussionData()
      }
    });
    this.telemetryUtils.logImpression(NSDiscussData.IPageName.HOME);
    if (this.context) {
      this.showLoader = false;
      this.isWidget = true
      this.getForumIds()
    } else {
      this.showLoader = false;
      this.cIds = this.configService.getCategories().result
      this.loadDiscussionData()
    }

  }
  async getForumIds() {
    let body = {
      "identifier":
        this.context.contextIdArr
      ,
      "type": this.context.contextType
    }
    let resp = await this.discussionService.getForumIds(body)
    if (resp.result.length > 0) {
      resp.result.forEach(forum => {
        this.cIds.push(forum.cid)
      });
    } else {
      this.discussionService.createForum(this.context.categoryObj).subscribe(((data: any) => {
        data.result.forEach(forum => {
          this.cIds.push(forum.newCid)
        });
      }))

    }
    this.loadDiscussionData()
  }

  loadDiscussionData() {
    // debugger
    // this.cIds = this.context ? this.context.categories : this.configService.getCategories()
    this.categoryId = this.discussionService.getContext(CONTEXT_PROPS.cid);
    if (this.configService.hasContext() || this.context) {
      this.getContextBasedDiscussion(this.cIds)
      // This is to show context based trending tags
      this.getContextBasedTags(this.cIds);
    } else {
      // this.currentActivePage = 1
      this.refreshData();
      // This is to show trending tags
      this.fetchAllTags();
    }
  }

  // navigateToDiscussionDetails(discussionData) {

  //   const matchedTopic = find(this.telemetryUtils.getContext(), { type: 'Topic' });
  //   if (matchedTopic) {
  //     this.telemetryUtils.deleteContext(matchedTopic);
  //   }

  //   this.telemetryUtils.uppendContext({
  //     id: get(discussionData, 'tid'),
  //     type: 'Topic'
  //   });

  //   const slug = trim(get(discussionData, 'slug'));
  //   // tslint:disable-next-line: max-line-length
  //   const input = { data: { url: `${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`, queryParams: {} }, action: CONSTANTS.CATEGORY_DETAILS, }
  //   // console.log("input", input)
  //   this.navigationService.navigate(input);
  //   this.stateChange.emit({ action: CONSTANTS.CATEGORY_DETAILS, title: discussionData.title, tid: discussionData.tid, cId: this.cIds });

  //   // this.router.navigate([`${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`], { queryParamsHandling: "merge" });
  // }

  acceptData(singleTagDetails) {

    if (this.context) {
      singleTagDetails.cIds = this.cIds;
    }
    this.stateChange.emit(singleTagDetails);
  }

  getDiscussionList(slug: string) {
    this.showLoader = true;
    // TODO : this.currentActivePage shoulb be dynamic when pagination will be implemented
    this.discussionService.getContextBasedTopic(slug, this.currentActivePage).subscribe(data => {
      this.showLoader = false;
      this.isTopicCreator = get(data, 'privileges.topics:create') === true ? true : false;
      this.privilegesData = get(data, 'privileges');
      this.discussionList = union(get(data, 'topics'), get(data, 'children'));
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

  fillrecent(_page?: any) {
    this.getRecentData(_page)
  }

  fillPopular(page?: any) {
    this.showLoader = true;
    return this.discussionService.fetchPopularD(page).subscribe((response: any) => {
      //console.log("fillpopulat",response )
      this.showLoader = false;
      this.discussionList = [];
      filter(response.topics, (topic) => {
        if (topic.user.uid !== 0 && topic.cid !== 1) {
          this.discussionList.push(topic);
        }
      });
      // this.discussionList = get(response, 'topics')
    }, error => {
      this.showLoader = false;
      // TODO: Toaster
      console.log('error fetching topic list', error);
    });
  }

  getContextBasedDiscussion(cid: any) {
    this.currentFilter === 'recent' ? this.getContextData(cid) : this.getContextData(cid)
  }

  refreshData(page?: any) {
    this.currentFilter === 'recent' ? this.getRecentData(page) : this.fillPopular(page)
  }

  getRecentData(page?: any) {
    this.showLoader = true;
    return this.discussionService.fetchRecentD().subscribe(
      (data: any) => {
        //console.log("getRecentData", data)
        this.showLoader = false;
        this.discussionList = [];
        filter(data.topics, (topic) => {
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
  
  voteEvent(event:any){
   if(event){
     console.log(event)
     this.loadDiscussionData()
   }
  }
  getContextData(cid: any) {
    this.showLoader = true;
    const req = {
      cids: cid
    };
    return this.discussionService.getContextBasedDiscussion(req).subscribe(
      (data: any) => {
        this.showLoader = false;
        const result = data && data.result ? data.result : [];
        const res = result.filter((elem: any) => elem.statusCode !== 404);
        if (res && res.length > 0) {
          this.privilegesData = res[0].privileges;
          this.allTopics = res.map((item: any) => item.topics);

          const flatTopics = flatten(this.allTopics);
          this.discussionList = orderBy(flatTopics, ['tid'], ['desc']);
        } else {
          this.discussionList = [];
          this.privilegesData = null;
        }
      }, error => {
        this.showLoader = false;
        // TODO: Toaster
        console.log('error fetching topic list', error);
      });
  }

  fetchAllTags() {
    // this.showLoader = true;
    this.discussionService.fetchAllTag().subscribe(data => {
      this.showLoader = false;
      this.trendingTags = get(data, 'tags');
    }, error => {
      this.showLoader = false;
      // TODO: toaster
      console.log('error fetching tags');
    });
  }

  getContextBasedTags(cid: any) {
    const req = {
      cids: cid
    }
    // this.showLoader = true;
    this.discussionService.contextBasedTags(req).subscribe(data => {
      this.showLoader = false;
      this.trendingTags = get(data, 'result');
    }, error => {
      this.showLoader = false;
      // TODO: toaster
      console.log('error fetching tags');
    });
  }

  // startDiscussion(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template);

  // this.showStartDiscussionModal = true;
  // this.bsModalRef = this.modalService.show(DiscussStartComponent);

  // this.bsModalRef.content.onClose().subscribe(
  //   console.log('completed')
  // );
  // }

  startDiscussion() {
    this.showStartDiscussionModal = true;
    if (this.context) {
      this.startDiscussionCategoryId = this.cIds;
    }

  }

  logTelemetry(event) {
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.HOME);
  }

  closeModal(event) {
    if (get(event, 'message') === 'success') {
      if (this.context) {
        this.getContextBasedDiscussion(this.cIds)
      } else {
        this.refreshData()
      }
      // this.getDiscussionList(get(this.routeParams, 'slug'));
    } else if (get(event, 'message') === 'moderation') {
      if (this.context) {
        this.getContextBasedDiscussion(this.cIds)
      } else {
        this.refreshData()
      }
      this.showModerationModal = true
    }
    this.showStartDiscussionModal = false;
    this.dismissModal.emit('close');
  }

  closeModerationModal(event) {
    this.showModerationModal = false
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.discussionUIService.showReplay.next('VIEW_ALL')
  }
  
}
