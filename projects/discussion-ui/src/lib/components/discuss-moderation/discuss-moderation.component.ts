import { Component, OnInit, Output, EventEmitter } from '@angular/core';
/* tslint:disable */
import * as _ from 'lodash'
/* tslint:enable */

@Component({
    selector: 'lib-discuss-moderation',
    templateUrl: './discuss-moderation.component.html',
    styleUrls: ['./discuss-moderation.component.scss']
})
export class DiscussModerationComponent implements OnInit {
    @Output() close = new EventEmitter();

    ngOnInit() {
    }

    closeModal(){
        this.close.emit(true)
    }
}