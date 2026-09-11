import { Inject, Injectable, NgZone } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { urlConfig } from './../config/url.config';

import * as _lodash from 'lodash';
import { CsDiscussionService } from '@project-sunbird/client-services/services/discussion';
import { CsModule } from '@project-sunbird/client-services';
import { get } from 'lodash';
/* tslint:enable */

export const CONTEXT_PROPS: any = {
  cid: 'cid',
  tid: 'tid',
  uid: 'uid'
};

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

 private _userDetails: any;
  private _userName: any;
  private _forumIds: any;
  private _context: any = {};
  usr: any;

  private csDiscussionService?: CsDiscussionService | null = null;

  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) {
    this.usr = { userId: '1234' };
    // Use optional chaining to prevent the "undefined" crash
    CsModule.instance.init({
      core: {
        httpAdapter: 'HttpClientBrowserAdapter',
        global: {
        },
        api: {
          host: `${location.origin}/apis/proxies/v8`, // default host
          authentication: {},
        },
      },
      services: {
        groupServiceConfig: {
          apiPath: '/learner/group/v1',
          dataApiPath: '/learner/data/v1/group',
          updateGroupGuidelinesApiPath: '/learner/group/membership/v1',
        },
        userServiceConfig: {
          apiPath: '/learner/user/v2',
        },
        formServiceConfig: {
          apiPath: '/learner/data/v1/form',
        },
        courseServiceConfig: {
          apiPath: '/learner/course/v1',
          certRegistrationApiPath: '/learner/certreg/v2/certs',
        },
        discussionServiceConfig: {
          apiPath: '/discussion',
        },
      },
    })
    const instance = (window as any).CsModule?.instance || (CsModule as any)?.instance;
    
    if (instance && instance.discussionService) {
      this.csDiscussionService = instance.discussionService;
    } else {
      console.error('DiscussionService: CsModule instance is not initialized!');
      // this.csDiscussionService = {
      //   fetchAllTags: () => new Observable(),
      //   // add other mocks as needed
      // };
    }
  }

  // private getCsService() {
  //   if (this.csDiscussionService?) { return this.csDiscussionService?; }

  //   const instance = (window as any).CsModule?.instance || this.csModule?.instance;
  //   if (instance && instance.discussionService) {
  //     this.csDiscussionService? = instance.discussionService;
  //     return this.csDiscussionService?;
  //   }
  //   throw new Error('CsModule not initialized');
  // }

  initializeUserDetails(userName: any) {
    console.log('userName', userName);
    this.fetchUserProfile(userName).subscribe(response => {
      console.log('user', response);
      this.userDetails = response;
    }, (error) => {
      // TODO: toaster error
      console.log('error fetching user details');
    });
  }

  private _safeGet(obj: any, path: string, defaultValue?: any) {
    // Try the imported version, then the global version, then fallback
    const lodashGet = get || (window as any)._?.get || _lodash?.get;
    if (lodashGet) {
      return lodashGet(obj, path, defaultValue);
    }
    // Manual fallback if lodash is completely missing
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  }
  appendPage(page: any, url: string) {
    if (page) {
      return `${url}?page=${page}`;
    }
    return `${url}?page=1`;
  }


  /**
   * Re-emit an SDK observable inside the Angular zone.
   *
   * The client-services SDK performs its HTTP work outside Angular's zone, so
   * subscribers assign component state without any change detection running. The
   * view then stays stale until an unrelated event happens to trigger a cycle -
   * the "it only renders when I move the mouse" symptom. Wrapping every SDK
   * observable here fixes all subscribers at once, rather than sprinkling
   * ChangeDetectorRef.detectChanges() across ~55 call sites where a missed error
   * branch would leave a spinner running forever.
   *
   * If a call already emits in-zone this is a no-op, so it is safe to apply
   * uniformly. Undefined passes straight through, preserving the optional-chaining
   * behaviour of the callers.
   */
  private inZone<T>(source: Observable<T> | undefined): Observable<T> | undefined {
    if (!source) {
      return source;
    }
    return new Observable<T>(observer => source.subscribe({
      next: value => this.zone.run(() => observer.next(value)),
      error: err => this.zone.run(() => observer.error(err)),
      complete: () => this.zone.run(() => observer.complete()),
    }));
  }
  fetchAllTags() {
    // const tags = this.http.get(urlConfig.getAllTags())
    //   .toPromise();
    // return tags;
    console.log('innn fetchAllTags');
    // return this.csDiscussionService?.fetchAllTags();
    return this.inZone(this.csDiscussionService?.fetchAllTags());
  }

  createPost(data: any) {
    // return this.http.post(urlConfig.createPost(), data);
    return this.inZone(this.csDiscussionService?.createPost(data));
  }
  /**
   * @description To get all the categories
   */

  fetchAllCategories() {
    // return this.http.get<NSDiscussData.ICategorie[]>(urlConfig.getAllCategories()).pipe(
    //   map((data: any) => {
    //       // Taking only "categories" from the response
    //       const resp = (data as any).categories;
    //       return resp;
    //   }),
    //   catchError( error => {
    //     return throwError( 'Something went wrong!' );
    //   })
    // );
    console.log('in fetchall categories');
    return this.inZone(this.csDiscussionService?.fetchAllCategories().pipe(
      map((data: any) => data.categories)
    ));
  }

  fetchSingleCategoryDetails(cid: any) {
    return this.inZone(this.csDiscussionService?.fetchSingleCategoryDetails(cid));
    // return this.http.get<NSDiscussData.ICategorie>(urlConfig.getSingleCategoryDetails(cid));
  }
  fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any) {
    return this.inZone(this.csDiscussionService?.fetchSingleCategoryDetails(cid));
  }

  fetchAllTag() {
    return this.inZone(this.csDiscussionService?.fetchAllTags());
    // return this.http.get(urlConfig.getAllTags());
  }

  contextBasedTags(data: any) {
    return this.inZone(this.csDiscussionService?.contextBasedTags(data));
    // return this.http.get(urlConfig.getAllTags());
  }

  fetchPostDetails() {
    return this.inZone(this.csDiscussionService?.fetchAllTags());
    // return this.http.get(urlConfig.getAllTags());
  }

  votePost(pid: number, data: any) {
    return this.inZone(this.csDiscussionService?.votePost(pid, data));
    // const url = urlConfig.votePost(pid);
    // return this.http.post(url, data);
  }

  deleteVotePost(pid: number) {
    // const url = urlConfig.votePost(pid);
    // return this.http.delete(url);
    return this.inZone(this.csDiscussionService?.deleteVotePost(pid));
  }

  bookmarkPost(pid: number) {
    // const url = urlConfig.bookmarkPost(pid);
    // return this.http.post(url, {});
    return this.inZone(this.csDiscussionService?.bookmarkPost(pid));
  }

  deleteBookmarkPost(pid: number) {
    // const url = urlConfig.bookmarkPost(pid);
    // return this.http.delete(url);
    return this.inZone(this.csDiscussionService?.deleteBookmarkPost(pid));
  }

  replyPost(tid: number, data: any) {
    // const url = urlConfig.replyPost(tid);
    // return this.http.post(url, data);
    return this.inZone(this.csDiscussionService?.replyPost(tid, data));
  }

  fetchRecentD() {
    return this.inZone(this.csDiscussionService?.recentPost(this.userDetails.slug));
  }

  getTagBasedDiscussion(tag: string, page?: any) {
    return this.inZone(this.csDiscussionService?.getTagBasedDiscussion(tag));
  }

  getContextBasedDiscussion(data: any) {
    return this.inZone(this.csDiscussionService?.getContextBasedDiscussion(data));
  }

  getContextBasedTagDiscussion(data: any) {
    return this.inZone(this.csDiscussionService?.getContextBasedTagDiscussion(data));
  }

  fetchPopularD(page?: any) {
    return this.inZone(this.csDiscussionService?.popularPost(page));
  }

  fetchTopicById(topicId: number, slug?: any, page?: any) {
    // let url = urlConfig.getTopic() + '/' + topicId.toString() + '/' + slug;
    // url = this.appendPage(page, url);
    // return this.http.get(url);
    return this.inZone(this.csDiscussionService?.fetchTopicById(topicId, slug, page));
  }

  fetchTopicByIdSort(topicId: number, sort: any, page?: any) {
    // let url = urlConfig.getTopic + topicId.toString();
    // url = this.appendPage(page, url);
    // return this.http.get(`${url}&sort=${sort}`);
    return this.inZone(this.csDiscussionService?.fetchTopicById(topicId, sort, page));
  }

  fetchUnreadCOunt() {
    // return this.http.get<any>(urlConfig.unread());
    return this.inZone(this.csDiscussionService?.fetchUnreadCOunt());

  }
  // fetchProfile() {
  //   // return this.http.get(urlConfig.profile());
  //   return this.csDiscussionService?.fetchProfile();
  // }
  fetchProfileInfo(slug: string) {
    // return this.http.get(urlConfig.fetchProfile(slug));
    return this.inZone(this.csDiscussionService?.fetchProfileInfo(slug));
  }
  fetchUpvoted() {// 0
    // return this.http.get(urlConfig.listUpVote(_.get(this._userDetails, 'username')));
    return this.inZone(this.csDiscussionService?.fetchUpvoted(this._safeGet(this._userDetails, 'username')));
  }
  fetchDownvoted() { // 0
    // return this.http.get(urlConfig.listDownVoted(_.get(this._userDetails, 'username')));
    return this.inZone(this.csDiscussionService?.fetchDownvoted(this._safeGet(this._userDetails, 'username')));
  }
  fetchSaved() { // 0 this.usr.userId
    // return this.http.get(urlConfig.listSaved(_.get(this._userDetails, 'username')));
    return this.inZone(this.csDiscussionService?.fetchSaved(this._safeGet(this._userDetails, 'username')));
  }

  fetchUserProfile(userName: string) {
    // return this.http.get<any>(urlConfig.userDetails(userName));
    return this.inZone(this.csDiscussionService?.getUserDetails(this.userName));
  }

  getContextBasedTopic(slug: string, pageId: number) {
    // return this.http.get(urlConfig.getContextBasedTopics(slug));
    return this.inZone(this.csDiscussionService?.getContextBasedTopic(slug, pageId));
  }

  registerUser(data: any) {
    return this.inZone(this.http.post(urlConfig.registerUser(), data));
  }

  createForum(data: any){
    return this.inZone(this.csDiscussionService?.createForum(data));
  }

  /**
   * Wrapped before .toPromise(), not after.
   *
   * A promise resolved outside the Angular zone keeps every `await` continuation
   * outside it too - and discuss-all does `await getForumIds(...)` and then calls
   * loadDiscussionData(), so the whole load and render ran with no change
   * detection. The data arrived and the view only caught up on the next unrelated
   * event, which is why a new comment appeared as soon as the mouse moved.
   *
   * Running the source through inZone() means complete() fires inside the zone, so
   * the promise resolution is scheduled there and the continuation inherits it.
   */
  getForumIds(data: any){
    const source = this.csDiscussionService?.getForumIds(data)
    if (!source) { return Promise.resolve(undefined) }
    return this.inZone(source)!.toPromise()
  }
  
  set userDetails(userDetails: any) {
    this._userDetails = userDetails;
  }

  get userDetails() {
    return this._userDetails;
  }

  set userName(userName: string) {
    this._userName = userName;
  }

  get userName() {
    return this._userName;
  }

  set forumIds(ids: any) {
    this._forumIds = ids;
  }

  get forumIds() {
    return this._forumIds;
  }

  setContext(key: string, value: any) {
    if (CONTEXT_PROPS[key]) {
      this._context[key] = value;
    } else {
      console.log('Context can not be set for this key: ', key);
    }
  }

  getContext(key?: string) {
    return key ? this._context[key] : this._context;
  }

  editPost(pid: number, data: any) {
    return this.inZone(this.csDiscussionService?.editPost(pid, data));
  }

  deletePost(pid: number, uid: number) {
    return this.inZone(this.csDiscussionService?.deletePost(pid, uid));
  }

  editTopic(tid: number, data: any) {
    return this.inZone(this.csDiscussionService?.editTopic(tid, data));
  }

  deleteTopic(tid: number) {
    return this.inZone(this.csDiscussionService?.deleteTopic(tid));
  }

}
