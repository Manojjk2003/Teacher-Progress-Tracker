import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TscNavbarComponent } from './tsc-navbar.component';

describe('TscNavbarComponent', () => {
  let component: TscNavbarComponent;
  let fixture: ComponentFixture<TscNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TscNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TscNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
