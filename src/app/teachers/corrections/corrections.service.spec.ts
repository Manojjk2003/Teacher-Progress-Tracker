import { TestBed } from '@angular/core/testing';

import { CorrectionsService } from './corrections.service';

describe('CorrectionsService', () => {
  let service: CorrectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
