import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleUploadComponent } from './schedule-upload.component';

describe('ScheduleUploadComponent', () => {
  let component: ScheduleUploadComponent;
  let fixture: ComponentFixture<ScheduleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
