import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { NSDiscussData } from "../../models/discuss.model";
import { ConfigService } from "../../services/config.service";
import { DiscussionService } from "../../services/discussion.service";
import { TelemetryUtilsService } from "../../telemetry-utils.service";
import { DiscussStartComponent } from "./discuss-start.component"

describe('DiscussHomeComponent', () => {
  let discussStartComponent: DiscussStartComponent

  const mockDiscussionService: Partial<DiscussionService> = {};
  const mockFormBuilder: Partial<UntypedFormBuilder> = {};
  const mockTelemetryUtilsService: Partial<TelemetryUtilsService> = {
    logImpression: jest.fn()
  };

  beforeAll(() => {
    discussStartComponent = new DiscussStartComponent(
      mockDiscussionService as DiscussionService,
      mockFormBuilder as UntypedFormBuilder,
      mockTelemetryUtilsService as TelemetryUtilsService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of DiscussStartComponent', () => {
    expect(discussStartComponent).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initializeFormFields',  () => {
      // arrange
      jest.spyOn(discussStartComponent, 'initializeData').mockImplementation();
      jest.spyOn(discussStartComponent, 'initializeFormFields').mockImplementation();
      // act
      discussStartComponent.ngOnInit()
      // assert
      expect(mockTelemetryUtilsService.logImpression).toHaveBeenCalledWith(NSDiscussData.IPageName.START);
      expect(discussStartComponent.initializeData).toHaveBeenCalled();
      expect(discussStartComponent.initializeFormFields).toHaveBeenCalled();
    });
  });

  describe('validateForm', () => {
    it('should enable submit button', () => {
      // arrange
      discussStartComponent.startForm = {status: 'VALID'} as any;
      // act
      discussStartComponent.validateForm();
      // assert
      expect(discussStartComponent.enableSubmitButton).toBe(true)
    });

    it('should disable submit button', () => {
      // arrange
      discussStartComponent.startForm = {status: 'INVALID'} as any;
      // act
      discussStartComponent.validateForm();
      // assert
      expect(discussStartComponent.enableSubmitButton).toBe(false)
    });
  });

  describe('initializeData', () => {
    it('should fetch all tags', (done) => {
      // arrange
      const allTags = {
        tags: [
          {value: 'some_val'}
        ]
      };
      mockDiscussionService.fetchAllTag = jest.fn(() => of(allTags))
      // act
      discussStartComponent.initializeData()
      // assert
      expect(mockDiscussionService.fetchAllTag).toHaveBeenCalled();
      setTimeout(() => {
        expect(discussStartComponent.allTags).toEqual(['some_val'] as any)
        done();
      });
      
    });
  });

  describe('submitPost', () => {
    it('should handle submit post success', (done) => {
      // arrange
      mockDiscussionService.createPost = jest.fn(() => of({}));
      const form = {
        value: {
          question: 'some_question',
          description: 'some_description',
          tags: ['some_tag']
        },
        reset: jest.fn()
      } as any;
      jest.spyOn(discussStartComponent, 'closeModal').mockImplementation();
      // act
      discussStartComponent.submitPost(form)
      // assert
      setTimeout(() => {
        expect(discussStartComponent.closeModal).toHaveBeenCalled();
        expect(discussStartComponent.uploadSaveData).toBe(false);
        done();
      });
    });

    it('should handle submit post success', (done) => {
      // arrange
      const err = {
        error: {
          message: 'some_msg'
        }
      }
      mockDiscussionService.createPost = jest.fn(() => throwError(err));
      const form = {
        value: {
          question: 'some_question',
          description: 'some_description',
          tags: ['some_tag']
        },
        reset: jest.fn()
      } as any;
      jest.spyOn(discussStartComponent, 'closeModal').mockImplementation();
      // act
      discussStartComponent.submitPost(form)
      // assert
      setTimeout(() => {
        expect(discussStartComponent.closeModal).toHaveBeenCalled();
        expect(discussStartComponent.uploadSaveData).toBe(false);
        expect(discussStartComponent.showErrorMsg).toBe(true);
        done();
      });
    });
  });

  describe('updatePost', () => {
    it('should emit update event', () => {
      // arrange
      discussStartComponent.close = {
        emit: jest.fn()
      } as any
      const form = {
        value: {
          question: 'some_question',
          description: 'some_description',
          tags: ['some_tag']
        }
      };
      // act
      discussStartComponent.updatePost(form)
      // assert
      expect(discussStartComponent.close.emit).toHaveBeenCalled();
    });
  });

  describe('logTelemetry', () => {
    it('should log telemetry', () => {
      // arrange
      mockTelemetryUtilsService.logInteract = jest.fn();
      // act
      discussStartComponent.logTelemetry('some_event')
      // assert
      expect(mockTelemetryUtilsService.logInteract).toHaveBeenCalledWith(
        'some_event',
        NSDiscussData.IPageName.START
      )
    })
  })

})