import { Component, OnInit, } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DiscussionUIService } from '../../services/discussion-ui.service';
import { DiscussionService } from '../../services/discussion.service';

/** NodeBB's own minimumPostLength. Anything shorter is rejected server-side. */
export const MIN_REPLY_LENGTH = 8;

@Component({
    selector: 'lib-reply-comment',
    templateUrl: './reply-comment.component.html',
    styleUrls: ['./reply-comment.component.scss'],
    standalone: false
})
export class ReplyCommentComponent implements OnInit {

  replyData:any
  replyForm!: UntypedFormGroup;
  submitError = '';
  isSubmitting = false;
  readonly minReplyLength = MIN_REPLY_LENGTH;
  // displayState

  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private discussionUIService: DiscussionUIService,
    private discussionService: DiscussionService,
  ) { }

  ngOnInit() {
    // console.log("reply comp")
    this.discussionUIService.getReplyData().subscribe( data => 
      {
        // console.log("in reply component", data)
      this.replyData = data
    })

    this.initializeFormFields();
  }

  initializeFormFields() {
    // 8, not 2: NodeBB's own minimumPostLength is 8, so this form accepted
    // replies the server then rejected - and the middleware relabels that
    // rejection as "request payload is incorrect", which told the user nothing
    // and made the reply button look broken.
    this.replyForm = this.formBuilder.group({
      replyContent: ['', [Validators.required, Validators.minLength(MIN_REPLY_LENGTH) ]]
    });
  }


  onReplyClick(mode){
    this.submitError = '';

    // Show the hint instead of firing a request we already know will fail.
    if (this.replyForm.invalid) {
      this.replyForm.controls['replyContent'].markAsTouched();
      return;
    }

    const req = {
      content: this.replyForm.controls['replyContent'].value.trim(),
      toPid: this.replyData.pid
    };

    this.isSubmitting = true;
    this.discussionService.replyPost(this.replyData.tid, req ).subscribe(
      (data) => {
        this.isSubmitting = false;
        const disply = 'VIEW_ALL'
        this.discussionUIService.setDisplay(disply);
        this.discussionUIService.replyComment.next(data)
      },
      // There was no error callback at all, so every server rejection was
      // swallowed: the reply simply never appeared and nothing was shown.
      (err: any) => {
        this.isSubmitting = false;
        this.submitError = this.toUserMessage(err);
      }
    )

  }

  /**
   * The middleware replaces NodeBB's real reason with a generic
   * "request payload is incorrect", so it cannot be shown verbatim - it is
   * meaningless to a learner and usually wrong. Length is handled by the form
   * now, so a rejection here is most often NodeBB's post-rate limit.
   */
  private toUserMessage(err: any): string {
    const raw = (err?.error?.params?.errmsg || err?.error?.message || '').toString();
    if (/too short|minimum/i.test(raw)) {
      return 'DISCUSSION_POST_TOO_SHORT';
    }
    if (/only post every|rate|flood|too fast/i.test(raw)) {
      return 'DISCUSSION_POST_TOO_QUICK';
    }
    return 'DISCUSSION_POST_FAILED';
  }

  goBack() {
    const disply = 'VIEW_ALL'
    this.discussionUIService.setDisplay(disply);
  }
}
