import { TestBed } from '@angular/core/testing';

import { PublicGuardService } from './public.guard.service';

describe('PublicGuardService', () => {
  let service: PublicGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
