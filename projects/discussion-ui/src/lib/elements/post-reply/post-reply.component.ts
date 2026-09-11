import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'lib-post-reply',
    templateUrl: './post-reply.component.html',
    styleUrls: ['./post-reply.component.scss'],
    standalone: false
})
export class PostReplyComponent implements OnInit {
  @Input() showCancel = true;
  @Input() mode = 'add';
  @Input() content: string;

  @Output() actionEvent = new EventEmitter();

  replyForm!: UntypedFormGroup;

  isButtonEnabled = false;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.initializeFormFields();
  }

  initializeFormFields() {
    this.replyForm = this.formBuilder.group({
      // 8 to match NodeBB's minimumPostLength - 2 let through replies the server
      // then rejected with a message the middleware makes unreadable.
      replyContent: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.replyForm.valueChanges.subscribe(val => {
      this.isButtonEnabled = this.validateForm();
    });
  }

  validateForm() {
    if (this.replyForm.status === 'VALID') {
      return true;
    } else {
      return false;
    }
  }

  onReplyClick(mode: string) {
    // tslint:disable-next-line:no-string-literal
    this.actionEvent.emit({action: mode, content: this.replyForm.controls['replyContent'].value.trim()});
  }

  onCancelClick() {
    this.actionEvent.emit({action: 'cancel'});
  }

}
