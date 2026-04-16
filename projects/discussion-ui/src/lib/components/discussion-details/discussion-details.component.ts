import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { DiscussionService } from './../../services/discussion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, Renderer2, Output, EventEmitter } from '@angular/core';
import { NSDiscussData } from './../../models/discuss.model';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import * as CONSTANTS from '../../common/constants.json';
/* tslint:disable */
import * as _ from 'lodash'
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
/* tslint:enable */
import { Location } from '@angular/common';

import { NavigationServiceService } from '../../navigation-service.service';

const MSGS = {
  deletePost: `Are you sure you want to delete this Post? This can't be undone.`,
  deleteTopic: `Are you sure you want to delete this topic? Your action cannot be undone.`
};

@Component({
    selector: 'lib-discussion-details',
    templateUrl: './discussion-details.component.html',
    styleUrls: ['./discussion-details.component.scss'],
    standalone: false
})
export class DiscussionDetailsComponent implements OnInit, OnDestroy {
  @Input() topicId: any;
  @Input() slug!: string;
  @Input() widget!: boolean;
  @Input() cid!: number;

  @Output() stateChange: EventEmitter<any> = new EventEmitter();

  routeParams: any;
  currentActivePage = 1;
  currentFilter = 'timestamp'; // 'recent
  data!: any;
  paginationData!: any;
  pager = {};
  postAnswerForm!: FormGroup;
  UpdatePostAnswerForm!: FormGroup;
  replyForm!: FormGroup;
  fetchSingleCategoryLoader = false;
  paramsSubscription: Subscription | null = null;
  editMode = false;
  updatedPost = false;
  contentPost: any;
  editContentIndex: any;
  mainUid!: number;
  similarPosts!: any[];
  showEditTopicModal = false;
  editableTopicDetails: any;
  dropdownContent = true;
  categoryId: any;

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private configService: ConfigService,
    private formBuilder: UntypedFormBuilder,
    public router: Router,
    private telemetryUtils: TelemetryUtilsService,
    private renderer: Renderer2,
    private location: Location,
    private navigationService: NavigationServiceService,
  ) {
    /**
     * @description - It will check for the outside click while kebab menu is in open mode.
     */
    this.renderer.listen('window', 'click', (e: Event) => {
      // tslint:disable-next-line:no-string-literal
      if (e?.target['id'] !== 'group-actions') {
        this.dropdownContent = true;
      }
    });
  }

  ngOnInit() {
    this.initializeFormFiled();
    if(this.widget){
      this.fetchSingleCategoryLoader = true
    }
    if (!this.topicId && !this.slug) {
      this.route.params.subscribe(params => {
        this.routeParams = params;
        this.slug = _.get(this.routeParams, 'slug');
        this.topicId = _.get(this.routeParams, 'topicId');
        this.refreshPostData(this.currentActivePage);
        // this.getRealtedDiscussion(this.cid)
      });
    } else {
      this.refreshPostData(this.currentActivePage);
      // this.getRealtedDiscussion(this.cid)
    }


    this.telemetryUtils.logImpression(NSDiscussData.IPageName.DETAILS);
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges() {
    if (!this.topicId && !this.slug) {
      this.route.params.subscribe(params => {
        this.routeParams = params;
        this.slug = _.get(this.routeParams, 'slug');
        this.topicId = _.get(this.routeParams, 'topicId');
        this.refreshPostData(this.currentActivePage);
        // this.getRealtedDiscussion(this.cid)
      });
    } else {
      this.refreshPostData(this.currentActivePage);
      // this.getRealtedDiscussion(this.cid)
    }

    // console.log("reply",this.topicId, this.widget, this.slug, this.cid)
  }

  // new method
  acceptData(discuss: any) {
    // debugger
    const matchedTopic = _.find(this.telemetryUtils.getContext(), { type: 'Topic' });
    if (matchedTopic) {
      this.telemetryUtils.deleteContext(matchedTopic);
    }

    this.telemetryUtils.uppendContext({
      id: _.get(discuss, 'tid'),
      type: 'Topic'
    });

    const slug = _.trim(_.get(discuss, 'slug'))
    const input = {
      data: { url: `${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.TOPIC}${slug}`, queryParams: {} },
      action: CONSTANTS.CATEGORY_DETAILS };

    this.navigationService.navigate(input);
    this.stateChange.emit({ action: CONSTANTS.CATEGORY_DETAILS, title: discuss.title, tid: discuss.tid });
  }

  initializeFormFiled() {
    this.postAnswerForm = this.formBuilder.group({
      answer: [],
    });
    this.UpdatePostAnswerForm = this.formBuilder.group({
      updatedAnswer: [],
    });
    this.replyForm = this.formBuilder.group({
      reply: []
    });
  }

  async refreshPostData(page?: any) {
    if (this.currentFilter === 'timestamp') {

      this.discussionService.fetchTopicById(this.topicId, this.slug, page).subscribe(
        (data: NSDiscussData.IDiscussionData) => {
          this.appendResponse(data)
        },
        (err: any) => {
          console.log('Error in fetching topics')
          // toast message
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    } else {
      this.discussionService.fetchTopicByIdSort(this.topicId, 'voted', page).subscribe(
        (data: NSDiscussData.IDiscussionData) => {
          this.appendResponse(data)
        },
        (err: any) => {
          console.log('Error in fetching topics')
        });
    }
  }

  appendResponse(data: any) {
    this.data = data;
    this.paginationData = _.get(data, 'pagination');
    this.mainUid = _.get(data, 'loggedInUser.uid');
    this.categoryId = _.get(data, 'cid');
    this.topicId = _.get(data, 'tid');
  }


  setPagination() {
    this.pager = {
      startIndex: this.paginationData.first.page,
      endIndex: this.paginationData.last.page,
      pages: this.paginationData.pages,
      currentPage: this.paginationData.currentPage,
      totalPage: this.paginationData.pageCount,
    };
  }

  upvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: 1,
    };
    this.processVote(discuss, req);
  }

  downvote(discuss: NSDiscussData.IDiscussionData) {
    const req = {
      delta: -1,
    };
    this.processVote(discuss, req);
  }

  private async processVote(discuss: any, req: any) {
    if (discuss && discuss.uid) {
      this.discussionService.votePost(discuss.pid, req).subscribe(
        () => {
          // toast
          // this.openSnackbar(this.toastSuccess.nativeElement.value);
          this.postAnswerForm.reset();
          this.refreshPostData(this.currentActivePage);
        },
        (err: any) => {
          // toast
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    }
  }

  bookmark(discuss: any) {
    this.discussionService.bookmarkPost(discuss.pid).subscribe(data => {
      // toast
      // this.openSnackbar('Bookmark added successfully!');
      this.refreshPostData(this.currentActivePage);
    },
      (err: any) => {
        // toast
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
      });
  }

  unBookMark(discuss: any) {
    this.discussionService.deleteBookmarkPost(discuss.pid).subscribe(data => {
      // toast
      this.refreshPostData(this.currentActivePage);
    },
      (err: any) => {
        // toast
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
      });
  }

  deleteVote(discuss: any) {
    this.discussionService.deleteVotePost(discuss.pid).subscribe(data => {
      // toast
      this.refreshPostData(this.currentActivePage);
    },
      (err: any) => {
        // toast
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
      });
  }

  postReply(replyContent: string, post: NSDiscussData.IDiscussionData) {
    const req = {
      content: replyContent,
    };
    this.postAnswerForm.controls['answer'].setValue('');
    if (post && post.tid) {
      this.discussionService.replyPost(post.tid, req).subscribe(
        () => {
          // toast
          // this.openSnackbar('Your reply was saved succesfuly!');
          // this.fetchNewData = true;
          this.refreshPostData(this.currentActivePage);
        },
        (err: any) => {
          // toast
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    }
  }

  postCommentsReply(replyContent: string, post: NSDiscussData.IPosts) {
    const req = {
      content: replyContent,
      toPid: post.pid,
    };
    if (post && post.tid) {
      this.discussionService.replyPost(post.tid, req).subscribe(
        () => {
          // toast
          // this.openSnackbar('Your reply was saved succesfuly!');
          this.refreshPostData(this.currentActivePage);
        },
        (err: any) => {
          // toast
          // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError);
        });
    }
  }

  confirmDelete(pid: any) {
    if (window.confirm(MSGS.deletePost)) {
      this.deletePost(pid);
    }
  }

  filter(key: string | 'timestamp' | 'upvotes') {
    if (key) {
      this.currentFilter = key;
      this.refreshPostData(this.currentActivePage);
    }
  }

  navigateWithPage(page: any) {
    if (page !== this.currentActivePage) {
      this.router.navigate([`${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.CATEGORY} ${this.topicId}`], { queryParams: { page },  queryParamsHandling: "merge"  });
    }
  }

  showError(meta: string) {
    if (meta) {
      return true;
    }
    return false;
  }

  public getBgColor(tagTitle: any) {
    const bgColor = this.stringToColor(tagTitle.toLowerCase());
    const color = this.getContrast();
    return { color, 'background-color': bgColor };
  }

  stringToColor(title: string) {
    let hash = 0;

    for (let i = 0; i < title.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    // tslint:disable-next-line: prefer-template
    const colour = 'hsl(' + hue + ',100%,30%)';
    return colour;
  }

  getContrast() {
    return 'rgba(255, 255, 255, 80%)';
  }

  logTelemetry(event: any, data?: any) {
    const pid = _.get(data, 'pid') || _.get(data, 'mainPid') ?
      { id: _.get(data, 'pid') || _.get(data, 'mainPid'), type: 'Post' } : {};
    this.telemetryUtils.uppendContext(pid);
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.DETAILS);
  }

  onEditMode(UpdatePostStatus: boolean) {
    if (UpdatePostStatus) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  getRealtimePost(post: any, index: any) {
    this.editMode = true;
    this.editContentIndex = index;
    this.contentPost = _.get(post, 'content').replace(/<[^>]*>/g, '');
    post.toggle = false;
  }

  updatePost(updatedPostContent: any, pid: number) {
    this.editMode = false;
    const req = {
      content: updatedPostContent,
      title: '',
      tags: [],
      uid: this.mainUid
    };
    this.discussionService.editPost(pid, req).subscribe((data: any) => {
      // TODO: Success toast
      this.refreshPostData(this.currentActivePage);
    }, (error) => {
      // TODO: error toast
      console.log('e', error);
    });
    //console.log(pid);
  }

  deletePost(postId: number) {
    this.discussionService.deletePost(postId, this.mainUid).subscribe((data: any) => {
      // TODO: Success toast
      this.refreshPostData(this.currentActivePage);
    }, (error) => {
      // TODO: error toast
      console.log('e', error);
    });
  }

  editReplyHandler(event, post) {
    if (_.get(event, 'action') === 'cancel') {
      this.onEditMode(false);
    } else if (_.get(event, 'action') === 'edit') {
      this.updatePost(_.get(event, 'content'), _.get(post, 'pid'));
      this.logTelemetry(event, post);
    }
  }

  commentReplyHandler(event, post) {
    if (_.get(event, 'action') === 'cancel') {
      this.togglePost(post);
    } else if (_.get(event, 'action') === 'reply') {
      this.postCommentsReply(_.get(event, 'content'), post);
      this.logTelemetry(event, post);
    }
  }

  postReplyHandler(event, post) {
    if (_.get(event, 'action') === 'reply') {
      this.postReply(_.get(event, 'content'), post);
      this.logTelemetry(event, post);
    }
  }

  togglePost(post) {
    post.toggle = !post.toggle;
    this.onEditMode(false);
  }

  /**
   * @description - It will trigger the event handlers and close the update thread popup.
   */
  closeModal(event: any) {
    //console.log('close event', event);
    if (_.get(event, 'action') === 'update') {
      this.editTopicHandler(event, _.get(event, 'tid'), _.get(event, 'request'));
    }
    this.showEditTopicModal = false;
  }

  /**
   * @description - It will open update thread popup.
   */
  editTopic() {
    this.showEditTopicModal = true;
  }

  /**
   * @description - It will all the update topic api. If success, then will refresh the data.
   */
  editTopicHandler(event, tid, updateTopicRequest) {
    this.logTelemetry(event, this.editableTopicDetails);
    this.discussionService.editPost(tid, updateTopicRequest).subscribe(data => {
      console.log('update success', data);
      this.refreshPostData(this.currentActivePage);
    }, error => {
      console.log('error while updating', error);
    });
  }

  /**
   * @description - It will open the confirmation popup before deleting the topic,
   *                If clicked yes, then will call the delete topic handler.
   */
  deleteTopic(event, topicData) {
    if (window.confirm(MSGS.deleteTopic)) {
      this.logTelemetry(event, topicData);
      this.deleteTopicHandler(_.get(topicData, 'tid'));
    }
  }

  /**
   * @description - It will all the delete topic api. If success, then will navigate back to the previous page.
   */
  deleteTopicHandler(topicId) {
    this.discussionService.deleteTopic(topicId).subscribe(data => {
      this.location.back();
    }, error => {
      console.log('error while deleting', error);
    });
  }
  /**
   * @description - It will toggle the kebab menu click
   */
  onMenuClick() {
    this.dropdownContent = !this.dropdownContent;
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

}
