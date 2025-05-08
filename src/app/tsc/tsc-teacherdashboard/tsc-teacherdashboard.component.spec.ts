import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TscTeacherdashboardComponent } from './tsc-teacherdashboard.component';

describe('TscTeacherdashboardComponent', () => {
  let component: TscTeacherdashboardComponent;
  let fixture: ComponentFixture<TscTeacherdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TscTeacherdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TscTeacherdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
