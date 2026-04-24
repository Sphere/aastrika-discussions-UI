import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-discuss-moderation',
    templateUrl: './discuss-moderation.component.html',
    styleUrls: ['./discuss-moderation.component.scss'],
    standalone: false
})
export class DiscussModerationComponent implements OnInit {
    @Output() close = new EventEmitter();

    ngOnInit() {
    }

    closeModal(){
        this.close.emit(true)
    }
}