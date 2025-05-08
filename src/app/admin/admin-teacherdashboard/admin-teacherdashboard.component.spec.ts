import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeacherdashboardComponent } from './admin-teacherdashboard.component';

describe('AdminTeacherdashboardComponent', () => {
  let component: AdminTeacherdashboardComponent;
  let fixture: ComponentFixture<AdminTeacherdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTeacherdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTeacherdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
