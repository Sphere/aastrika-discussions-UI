import { TestBed } from '@angular/core/testing';

import { DiscussionEventsService } from './discussion-events.service';

describe('DiscussionEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionEventsService = TestBed.inject(DiscussionEventsService);
    expect(service).toBeTruthy();
  });
});
