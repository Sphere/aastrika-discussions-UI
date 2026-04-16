import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: "lib-reply-delte",
    templateUrl: "./reply-delte.component.html",
    styleUrls: ["./reply-delte.component.scss"],
    standalone: false
})
export class ReplyDelteComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() deleteReplyComment = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  closeModal() {
    this.close.emit(true);
  }
  deleteModal(){
    this.deleteReplyComment.emit()
  }
}
