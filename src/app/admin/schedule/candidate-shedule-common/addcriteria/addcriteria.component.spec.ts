import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcriteriaComponent } from './addcriteria.component';

describe('AddcriteriaComponent', () => {
  let component: AddcriteriaComponent;
  let fixture: ComponentFixture<AddcriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcriteriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
