import { TestBed } from '@angular/core/testing';

import { DiscussionUIService } from './discussion-ui.service';

describe('DiscussionUIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscussionUIService = TestBed.inject(DiscussionUIService);
    expect(service).toBeTruthy();
  });
});
