import { TestBed } from '@angular/core/testing';

import { AssignSchoolService } from './assign-school.service';

describe('AssignSchoolService', () => {
  let service: AssignSchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignSchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
