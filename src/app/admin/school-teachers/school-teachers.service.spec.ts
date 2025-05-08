import { TestBed } from '@angular/core/testing';

import { SchoolTeachersService } from './school-teachers.service';

describe('SchoolTeachersService', () => {
  let service: SchoolTeachersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolTeachersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
