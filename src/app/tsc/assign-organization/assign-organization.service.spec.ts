import { TestBed } from '@angular/core/testing';

import { AssignOrganizationService } from './assign-organization.service';

describe('AssignOrganizationService', () => {
  let service: AssignOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignOrganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
