import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { DiscussionService } from './../../services/discussion.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NSDiscussData } from './../../models/discuss.model';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { DiscussUtilsService } from '../../services/discuss-utils.service';
import { ConfigService } from '../../services/config.service';
import { map, get } from 'lodash';

@Component({
    selector: 'lib-discuss-start',
    templateUrl: './discuss-start.component.html',
    styleUrls: ['./discuss-start.component.scss'],
    standalone: false
})
export class DiscussStartComponent implements OnInit {
  @Input() categoryId: string = '';
  @Input() topicData: any;
  @Input() mode: string = '';
  @Output() close = new EventEmitter();

  startForm!: UntypedFormGroup;
  editable = true;
  allCategories!: NSDiscussData.ICategorie[];
  allTags!: NSDiscussData.ITag[];
  postTagsArray: string[] = [];
  uploadSaveData = false;
  showErrorMsg = false;
  showSelectCategory = false;
  createErrorMsg = '';
  // A translation key, resolved by the host app's ngx-translate.
  defaultError = 'DISCUSSION_POST_FAILED';

  enableSubmitButton = false;
  cIds: any;

  constructor(
    private discussService: DiscussionService,
    private formBuilder: UntypedFormBuilder,
    private telemetryUtils: TelemetryUtilsService,
    private configService: ConfigService,
    private discussUtils: DiscussUtilsService
  ) { }

  ngOnInit() {
    // debugger
    this.telemetryUtils.logImpression(NSDiscussData.IPageName.START);
    this.cIds = this.configService.getCategories();
    // if (!this.categoryId) {
    //   this.showSelectCategory = true;
    // }

    this.showSelectCategory = true;

    this.initializeData();
    this.initializeFormFields(this.topicData);
  }
  
  initializeFormFields(topicData: any) {
    this.startForm = this.formBuilder.group({
      question: ['', [Validators.required , Validators.minLength(8) , Validators.maxLength(200), this.noWhitespaceValidator]],
      // Deliberately unvalidated and empty. Its textarea is commented out in the
      // template, so the user cannot fill it - adding validators here would make
      // the form permanently invalid and disable Submit. It used to default to the
      // literal 'test 12345', which then shipped as the body of every post; see
      // submitPost, which falls back to the question text instead.
      description: [''],
      tags: [],
      category: []
    });
    this.startForm.valueChanges.subscribe(val => {
      this.validateForm();
    });

    /** If popup is in edit mode */
    if (topicData) {
      const tags = map(get(topicData, 'tags'), (element) => {
        return get(element, 'value');
      });

      /** calling htmlDecode method to get the parsed string */
      this.startForm.controls['question'].setValue(this.discussUtils.htmlDecode(get(topicData, 'title')));
      this.startForm.controls['description'].setValue(get(topicData, 'posts[0].content').replace(/<[^>]+>/g, ''));
      this.startForm.controls['tags'].setValue(tags);
      this.validateForm();
    }
  }
  public noWhitespaceValidator(control: UntypedFormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  validateForm() {
    if (this.startForm.status === 'VALID') {
      this.enableSubmitButton = true;
    } else {
      this.enableSubmitButton = false;
    }
  }

  initializeData() {
    // debugger
    if (this.configService.hasContext() && !this.categoryId) {
      const req = {
        cids: this.cIds.result
      };

      this.discussService.getContextBasedDiscussion(req).subscribe((data: any) => {
        this.allCategories = data.result;
        if (this.startForm.get('category')) { }
        this.startForm.controls['category'].setValue(this.allCategories[0].cid)
      });
    } else if (this.categoryId) {
      const req = {
        cids: this.categoryId
      };
      this.showSelectCategory = false;
      this.editable = false;
      this.discussService.getContextBasedDiscussion(req).subscribe((data: any) => {
        this.allCategories = data.result;
        if (this.startForm.get('category')) { }
        this.startForm.controls.category.setValue(this.allCategories[0].cid);
      });
    } else {
      this.discussService.fetchAllCategories().subscribe((data: any) => {
        this.allCategories = data
        if (this.startForm.get('category')) { }
        this.startForm.controls['category'].setValue(this.allCategories[1].cid)
      });
    }

    this.discussService.fetchAllTag().subscribe((data: any) => {
      const tags = get(data, 'tags');
      this.allTags = map(tags, (tag) => tag.value);
    });
  }
  showError(meta: string) {
    if (meta) {
      return true;
    }
    return false;
  }

  public submitPost(form: any) {
    this.uploadSaveData = true;
    this.showErrorMsg = false;
    // categoryId arrives from discuss-all as this.cIds, which is ALREADY an array.
    // The old code did `this.categoryId ? [this.categoryId] : ...`, which broke twice:
    //   - it wrapped the array again, sending cid: [[5]] instead of [5]
    //   - an empty array is truthy in JS, so no-forum courses sent cid: [[]]
    // Both produce a post against a category that does not exist.
    let provided: any[] = [];
    if (Array.isArray(this.categoryId)) {
      provided = this.categoryId;
    } else if (this.categoryId !== undefined && this.categoryId !== null) {
      provided = [this.categoryId];
    }
    // The description textarea is commented out in the template, so its control is
    // always empty for a new post - fall back to the question, which is the text the
    // user actually typed. Previously this sent the control's 'test 12345' default,
    // so every comment body was that string. Edit mode still fills description from
    // the existing post, so it keeps taking precedence when present.
    const description = (form.value.description || '').trim();
    const postCreateReq = {
      cid: provided.length ? provided : [parseInt(form.value.category)],
      title: form.value.question,
      content: description || form.value.question,
      tags: form.value.tags,
    };
    this.enableSubmitButton = false;
    this.discussService.createPost(postCreateReq).subscribe(
      (data: any) => {
        if (data.payload) {
          this.closeModal('success');
        }else{
          this.closeModal('moderation');
        }
        form.reset();
        this.uploadSaveData = false;
        this.enableSubmitButton = true;
        // success toast;
        // this.openSnackbar(this.toastSuccess.nativeElement.value)
        // close the modal
      },
      (err: any) => {
        // Deliberately NOT closing the modal here. It used to call
        // closeModal('discard') first, which tore the dialog down before the
        // message below could ever be seen - so a rejected post looked like the
        // send button had simply done nothing, and the user's text was lost.
        this.uploadSaveData = false;
        this.enableSubmitButton = true;
        this.showErrorMsg = true;
        this.createErrorMsg = this.toUserMessage(err);
      });
  }

  /**
   * The middleware replaces NodeBB's real reason with a generic
   * "request payload is incorrect", and wraps it as params.errmsg rather than
   * message - so the old `err.error.message.split('|')[1]` found nothing and no
   * error was shown at all. Length is validated by the form now, so a rejection
   * here is most often NodeBB's post-rate limit.
   */
  private toUserMessage(err: any): string {
    const raw = (err?.error?.params?.errmsg || err?.error?.message || '').toString();
    if (/too short|minimum/i.test(raw)) {
      return 'DISCUSSION_POST_TOO_SHORT';
    }
    if (/only post every|rate|flood|too fast/i.test(raw)) {
      return 'DISCUSSION_POST_TOO_QUICK';
    }
    return this.defaultError;
  }


  /**
   * @param  {any} form
   * @description - It will emit an event when popup is opened in edit topic/thread mode
   *                Here, as 'tid', we are passing the main topic pid from the post array
   */
  updatePost(form: any) {
    const updateTopicRequest = {
      title: form.value.question,
      content: form.value.description,
      tags: form.value.tags,
      uid: get(this.topicData, 'uid')
    };
    this.close.emit({
      action: 'update',
      tid: get(this.topicData, 'posts[0].pid'),
      request: updateTopicRequest
    });
  }

  closeModal(eventMessage: string) {
    this.close.emit({ message: eventMessage });
  }

  logTelemetry(event: any) {
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.START);
  }
}

