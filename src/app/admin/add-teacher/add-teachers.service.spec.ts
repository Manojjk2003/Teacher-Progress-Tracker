import { TestBed } from '@angular/core/testing';

import { AddTeachersService } from './add-teachers.service';

describe('AddTeachersService', () => {
  let service: AddTeachersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTeachersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
