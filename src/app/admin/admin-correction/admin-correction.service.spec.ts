import { TestBed } from '@angular/core/testing';

import { AdminCorrectionService } from './admin-correction.service';

describe('AdminCorrectionService', () => {
  let service: AdminCorrectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCorrectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
