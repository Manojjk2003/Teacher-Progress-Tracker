import { TestBed } from '@angular/core/testing';

import { TscService } from './tsc.service';

describe('TscService', () => {
  let service: TscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
