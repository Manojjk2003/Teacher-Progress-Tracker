import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSchoolComponent } from './assign-school.component';

describe('AssignSchoolComponent', () => {
  let component: AssignSchoolComponent;
  let fixture: ComponentFixture<AssignSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSchoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
