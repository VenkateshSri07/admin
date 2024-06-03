import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSendEmailComponent } from './candidate-send-email.component';

describe('CandidateSendEmailComponent', () => {
  let component: CandidateSendEmailComponent;
  let fixture: ComponentFixture<CandidateSendEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSendEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
