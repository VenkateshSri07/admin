import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSheduleComponent } from './candidate-shedule.component';

describe('CandidateSheduleComponent', () => {
  let component: CandidateSheduleComponent;
  let fixture: ComponentFixture<CandidateSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
