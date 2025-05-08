import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTeacherComponent } from './total-teacher.component';

describe('TotalTeacherComponent', () => {
  let component: TotalTeacherComponent;
  let fixture: ComponentFixture<TotalTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
