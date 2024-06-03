import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileSubmissionStatusComponent } from './candidate-profile-submission-status.component';

describe('CandidateProfileSubmissionStatusComponent', () => {
  let component: CandidateProfileSubmissionStatusComponent;
  let fixture: ComponentFixture<CandidateProfileSubmissionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfileSubmissionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfileSubmissionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
