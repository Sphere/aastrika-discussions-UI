import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'lib-discussion-delete',
    templateUrl: './discussion-delete.component.html',
    styleUrls: ['./discussion-delete.component.scss'],
    standalone: false
})
export class DiscussionDeleteComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() delete = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  closeModal(){
    this.close.emit(true)
}

deleteModal(){
  this.delete.emit()
}



}
