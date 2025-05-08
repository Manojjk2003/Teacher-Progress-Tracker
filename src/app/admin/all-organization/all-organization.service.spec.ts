import { TestBed } from '@angular/core/testing';

import { AllOrganizationService } from './all-organization.service';

describe('AllOrganizationService', () => {
  let service: AllOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
