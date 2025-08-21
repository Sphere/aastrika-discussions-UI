import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { urlConfig } from './../config/url.config';

/* tslint:disable */
import * as _ from 'lodash'
import { CsDiscussionService } from '@project-sunbird/client-services/services/discussion';
import { CsModule } from '@project-sunbird/client-services';
/* tslint:enable */

export const CONTEXT_PROPS = {
  cid: 'cid',
  tid: 'tid',
  uid: 'uid'
};

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  // tslint:disable-next-line:variable-name
  private _userDetails: any;

  // tslint:disable-next-line:variable-name
  private _userName: any;

  // tslint:disable-next-line:variable-name
  private _forumIds: any;
  private csDiscussionService: CsDiscussionService;

  // tslint:disable-next-line:variable-name
  private _context: any = {};

  usr: any;

  constructor(
    private http: HttpClient,
    @Inject('CsModule') private csModule: CsModule
  ) {
    // TODO: Take from the logged in user data;
    // this.usr = this.configSvc.userProfile
    this.usr = { userId: '1234' };
    console.log('CsModule init---', CsModule.instance);
    this.csDiscussionService = CsModule.instance.discussionService;

  }

  initializeUserDetails(userName) {
    console.log('userName', userName);
    this.fetchUserProfile(userName).subscribe(response => {
      console.log('user', response);
      this.userDetails = response;
    }, (error) => {
      // TODO: toaster error
      console.log('error fetching user details');
    });
  }

  appendPage(page: any, url: string) {
    if (page) {
      return `${url}?page=${page}`;
    }
    return `${url}?page=1`;
  }

  fetchAllTags() {
    // const tags = this.http.get(urlConfig.getAllTags())
    //   .toPromise();
    // return tags;
    console.log('innn fetchAllTags');
    return this.csDiscussionService.fetchAllTags();
  }

  createPost(data: any) {
    // return this.http.post(urlConfig.createPost(), data);
    return this.csDiscussionService.createPost(data);
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
    return this.csDiscussionService.fetchAllCategories().pipe(
      map((data: any) => data.categories)
    );
  }

  fetchSingleCategoryDetails(cid: any) {
    return this.csDiscussionService.fetchSingleCategoryDetails(cid);
    // return this.http.get<NSDiscussData.ICategorie>(urlConfig.getSingleCategoryDetails(cid));
  }
  fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any) {
    return this.csDiscussionService.fetchSingleCategoryDetails(cid);
  }

  fetchAllTag() {
    return this.csDiscussionService.fetchAllTags();
    // return this.http.get(urlConfig.getAllTags());
  }

  contextBasedTags(data) {
    return this.csDiscussionService.contextBasedTags(data);
    // return this.http.get(urlConfig.getAllTags());
  }

  fetchPostDetails() {
    return this.csDiscussionService.fetchAllTags();
    // return this.http.get(urlConfig.getAllTags());
  }

  votePost(pid: number, data: any) {
    return this.csDiscussionService.votePost(pid, data);
    // const url = urlConfig.votePost(pid);
    // return this.http.post(url, data);
  }

  deleteVotePost(pid: number) {
    // const url = urlConfig.votePost(pid);
    // return this.http.delete(url);
    return this.csDiscussionService.deleteVotePost(pid);
  }

  bookmarkPost(pid: number) {
    // const url = urlConfig.bookmarkPost(pid);
    // return this.http.post(url, {});
    return this.csDiscussionService.bookmarkPost(pid);
  }

  deleteBookmarkPost(pid: number) {
    // const url = urlConfig.bookmarkPost(pid);
    // return this.http.delete(url);
    return this.csDiscussionService.deleteBookmarkPost(pid);
  }

  replyPost(tid: number, data: any) {
    // const url = urlConfig.replyPost(tid);
    // return this.http.post(url, data);
    return this.csDiscussionService.replyPost(tid, data);
  }

  fetchRecentD() {
    return this.csDiscussionService.recentPost();
  }

  getTagBasedDiscussion(tag?: string, page?: any) {
    return this.csDiscussionService.getTagBasedDiscussion(tag);
  }

  getContextBasedDiscussion(data) {
    return this.csDiscussionService.getContextBasedDiscussion(data);
  }

  getContextBasedTagDiscussion(data) {
    return this.csDiscussionService.getContextBasedTagDiscussion(data);
  }

  fetchPopularD(page?: any) {
    return this.csDiscussionService.popularPost(page);
  }

  fetchTopicById(topicId: number, slug?: any, page?: any) {
    // let url = urlConfig.getTopic() + '/' + topicId.toString() + '/' + slug;
    // url = this.appendPage(page, url);
    // return this.http.get(url);
    return this.csDiscussionService.fetchTopicById(topicId, slug, page);
  }

  fetchTopicByIdSort(topicId: number, sort: any, page?: any) {
    // let url = urlConfig.getTopic + topicId.toString();
    // url = this.appendPage(page, url);
    // return this.http.get(`${url}&sort=${sort}`);
    return this.csDiscussionService.fetchTopicById(topicId, sort, page);
  }

  fetchUnreadCOunt() {
    // return this.http.get<any>(urlConfig.unread());
    return this.csDiscussionService.fetchUnreadCOunt();

  }
  // fetchProfile() {
  //   // return this.http.get(urlConfig.profile());
  //   return this.csDiscussionService.fetchProfile();
  // }
  fetchProfileInfo(slug: string) {
    // return this.http.get(urlConfig.fetchProfile(slug));
    return this.csDiscussionService.fetchProfileInfo(slug);
  }
  fetchUpvoted() {// 0
    // return this.http.get(urlConfig.listUpVote(_.get(this._userDetails, 'username')));
    return this.csDiscussionService.fetchUpvoted(_.get(this._userDetails, 'username'));
  }
  fetchDownvoted() { // 0
    // return this.http.get(urlConfig.listDownVoted(_.get(this._userDetails, 'username')));
    return this.csDiscussionService.fetchDownvoted(_.get(this._userDetails, 'username'));
  }
  fetchSaved() { // 0 this.usr.userId
    // return this.http.get(urlConfig.listSaved(_.get(this._userDetails, 'username')));
    return this.csDiscussionService.fetchSaved(_.get(this._userDetails, 'username'));
  }

  fetchUserProfile(userName) {
    // return this.http.get<any>(urlConfig.userDetails(userName));
    return this.csDiscussionService.getUserDetails(this.userName);
  }

  getContextBasedTopic(slug: string, pageId: number) {
    // return this.http.get(urlConfig.getContextBasedTopics(slug));
    return this.csDiscussionService.getContextBasedTopic(slug, pageId);
  }

  registerUser(data) {
    return this.http.post(urlConfig.registerUser(), data);
  }

  createForum(data){
    return this.csDiscussionService.createForum(data)
  }

  getForumIds(data){
    return this.csDiscussionService.getForumIds(data).toPromise()
  }
  
  set userDetails(userDetails) {
    this._userDetails = userDetails;
  }

  get userDetails() {
    return this._userDetails;
  }

  set userName(userName) {
    this._userName = userName;
  }

  get userName() {
    return this._userName;
  }

  set forumIds(ids) {
    this._forumIds = ids;
  }

  get forumIds() {
    return this._forumIds;
  }

  setContext(key, value) {
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
    return this.csDiscussionService.editPost(pid, data);
  }

  deletePost(pid: number, uid: number) {
    return this.csDiscussionService.deletePost(pid, uid);
  }

  editTopic(tid: number, data: any) {
    return this.csDiscussionService.editTopic(tid, data);
  }

  deleteTopic(tid: number) {
    return this.csDiscussionService.deleteTopic(tid);
  }

}
