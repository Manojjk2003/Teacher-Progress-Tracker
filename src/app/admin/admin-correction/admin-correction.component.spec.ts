import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCorrectionComponent } from './admin-correction.component';

describe('AdminCorrectionComponent', () => {
  let component: AdminCorrectionComponent;
  let fixture: ComponentFixture<AdminCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCorrectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
