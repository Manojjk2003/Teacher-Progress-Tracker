import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TscDashboardComponent } from './tsc-dashboard.component';

describe('TscDashboardComponent', () => {
  let component: TscDashboardComponent;
  let fixture: ComponentFixture<TscDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TscDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TscDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
