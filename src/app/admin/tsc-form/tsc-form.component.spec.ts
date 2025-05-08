import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TscFormComponent } from './tsc-form.component';

describe('TscFormComponent', () => {
  let component: TscFormComponent;
  let fixture: ComponentFixture<TscFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TscFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TscFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
