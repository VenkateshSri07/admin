import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionScheduleComponent } from './instruction-schedule.component';

describe('InstructionScheduleComponent', () => {
  let component: InstructionScheduleComponent;
  let fixture: ComponentFixture<InstructionScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructionScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
