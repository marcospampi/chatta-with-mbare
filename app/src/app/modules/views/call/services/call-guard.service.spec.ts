import { TestBed } from '@angular/core/testing';

import { CallGuardService } from './call-guard.service';

describe('CallGuardService', () => {
  let service: CallGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
