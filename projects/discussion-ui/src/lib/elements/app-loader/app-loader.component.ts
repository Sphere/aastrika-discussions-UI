import { Component, OnInit, Input } from '@angular/core';

/* tslint:disable */
import * as _ from 'lodash'
/* tslint:enable */

@Component({
    selector: 'lib-app-loader',
    templateUrl: './app-loader.component.html',
    styleUrls: ['./app-loader.component.css'],
    standalone: false
})
export class AppLoaderComponent implements OnInit {

  @Input() data;
  headerMessage: string;
  loaderMessage: string;

  constructor() { }

  ngOnInit() {
    this.headerMessage = 'Please wait';
    this.loaderMessage = 'We are fetching details';
    if (this.data) {
      this.headerMessage = _.get(this.data, 'headerMessage') || this.headerMessage;
      this.loaderMessage = _.get(this.data, 'loaderMessage') || this.loaderMessage;
    }

  }
}

