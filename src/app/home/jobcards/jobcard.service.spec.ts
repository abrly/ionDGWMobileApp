import { TestBed } from '@angular/core/testing';

import { JobcardService } from './jobcard.service';

describe('JobcardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobcardService = TestBed.get(JobcardService);
    expect(service).toBeTruthy();
  });
});
