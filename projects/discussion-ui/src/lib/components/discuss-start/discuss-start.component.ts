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
  defaultError = 'Something went wrong, Please try again after sometime!';

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
      description: ['test 12345'],
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
    const postCreateReq = {
      cid: this.categoryId ? [this.categoryId] : [parseInt(form.value.category)],
      title: form.value.question,
      content: form.value.description,
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
        this.closeModal('discard');
        // error toast
        // .openSnackbar(this.toastError.nativeElement.value)
        this.uploadSaveData = false;
        this.enableSubmitButton = true;
        if (err) {
          if (err.error && err.error.message) {
            this.showErrorMsg = true;
            this.createErrorMsg = err.error.message.split('|')[1] || this.defaultError;
          }
        }
      });
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

