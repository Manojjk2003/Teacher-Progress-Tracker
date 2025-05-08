import { TestBed } from '@angular/core/testing';

import { AdminTeacherdashboardService } from './admin-teacherdashboard.service';

describe('AdminTeacherdashboardService', () => {
  let service: AdminTeacherdashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTeacherdashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
