import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { IdiscussionConfig } from '../models/discussion-config.model';
import { get } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {

  paramsSubscription: Subscription;
  private _config: IdiscussionConfig;
  public checkContext: boolean;
  public queryParams: any;
  getContextData: any;
  hasContextData: any;
  getParams: IdiscussionConfig;
  setCategoryId = new ReplaySubject(1)
  categoryId: string = ''

  constructor(
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  setConfig(config: any) {
    // activatedRoute.data.subscribe((config) => {
    this._config = config;
    // });
  }

  setConfigFromParams(activatedRoute: any) {
    activatedRoute.queryParams.subscribe((params: any) => {
      const obj: IdiscussionConfig = {
        userName: get(params, 'userName'),
        categories: JSON.parse(get(params, 'categories'))
      };
      this._config = obj;
    });
  }

  public getConfig() {
    return this._config;
  }

  public getCategories() {
    this.getParams = this.getConfig()
    return get(this.getParams, 'categories')
  }

  public hasContext() {
    this.hasContextData = this.getCategories() ?
      (this.getCategories().result ? this.getCategories().result.length : null)
      : null
    return this.hasContextData
  }

  public getContext() {
    this.getContextData = this.getCategories() ?
      (this.getCategories().result ? this.getCategories().result : null)
      : null
    return this.getContextData
  }

  setCategoryid(id: any) {
    this.categoryId = id
    this.setCategoryId.next(id)
  }


  public getHeaderOption() {
    return this._config.headerOptions !== undefined ? this._config.headerOptions : true;
  }

  public getBannerOption() {
    return this._config.bannerOption ? this._config.bannerOption : false;
  }

  public getCategoryid() {
    return this.categoryId
  }

  public getRouterSlug() {
    return this._config.routerSlug ? this._config.routerSlug : '';
  }
}
