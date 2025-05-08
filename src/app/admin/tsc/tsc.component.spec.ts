import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TscComponent } from './tsc.component';

describe('TscComponent', () => {
  let component: TscComponent;
  let fixture: ComponentFixture<TscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TscComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
