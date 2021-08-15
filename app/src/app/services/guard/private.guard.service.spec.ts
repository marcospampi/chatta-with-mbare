import { TestBed } from '@angular/core/testing';

import { PrivateGuardService } from './private.guard.service';

describe('PrivateGuardService', () => {
  let service: PrivateGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
