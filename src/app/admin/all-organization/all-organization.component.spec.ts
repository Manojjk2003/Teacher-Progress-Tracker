import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrganizationComponent } from './all-organization.component';

describe('AllOrganizationComponent', () => {
  let component: AllOrganizationComponent;
  let fixture: ComponentFixture<AllOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
