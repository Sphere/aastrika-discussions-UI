import { Component, OnInit, } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DiscussionUIService } from '../../services/discussion-ui.service';
import { DiscussionService } from '../../services/discussion.service';

@Component({
  selector: 'lib-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent implements OnInit {

  replyData:any
  replyForm!: UntypedFormGroup;
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
    this.replyForm = this.formBuilder.group({
      replyContent: ['', [Validators.required, Validators.minLength(2) ]]
    });
  }


  onReplyClick(mode){
    const req = {
      content: this.replyForm.controls['replyContent'].value.trim(),
      toPid: this.replyData.pid
    };
    console.log(this.replyData.tid,  this.replyForm.controls['replyContent'].value.trim() )

    this.discussionService.replyPost(this.replyData.tid, req ).subscribe(
      (data) => {
        console.log(data)
        const disply = 'VIEW_ALL'
        this.discussionUIService.setDisplay(disply);
        this.discussionUIService.replyComment.next(data)
      }
    )
    
  }

  goBack() {
    const disply = 'VIEW_ALL'
    this.discussionUIService.setDisplay(disply);
  }
}
