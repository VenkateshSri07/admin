import { TestBed } from '@angular/core/testing';

import { GlobalValidatorService } from './global-validator.service';

describe('GlobalValidatorService', () => {
  let service: GlobalValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
