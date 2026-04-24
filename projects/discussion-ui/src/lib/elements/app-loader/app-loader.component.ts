import { Component, OnInit, Input } from '@angular/core';
import { get } from 'lodash';

@Component({
    selector: 'lib-app-loader',
    templateUrl: './app-loader.component.html',
    styleUrls: ['./app-loader.component.css'],
    standalone: false
})
export class AppLoaderComponent implements OnInit {

  @Input() data: any;
  headerMessage: string = '';
  loaderMessage: string = '';

  constructor() { }

  ngOnInit() {
    this.headerMessage = 'Please wait';
    this.loaderMessage = 'We are fetching details';
    if (this.data) {
      this.headerMessage = get(this.data, 'headerMessage') || this.headerMessage;
      this.loaderMessage = get(this.data, 'loaderMessage') || this.loaderMessage;
    }

  }
}

