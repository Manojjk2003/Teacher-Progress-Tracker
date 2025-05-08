import { TestBed } from '@angular/core/testing';

import { TscDasboardService } from './tsc-dasboard.service';

describe('TscDasboardService', () => {
  let service: TscDasboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TscDasboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
