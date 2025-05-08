import { TestBed } from '@angular/core/testing';

import { TscTeacherdashboardService } from './tsc-teacherdashboard.service';

describe('TscTeacherdashboardService', () => {
  let service: TscTeacherdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TscTeacherdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
