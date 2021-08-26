import { TestBed } from '@angular/core/testing';

import { ResolveCallManagerService } from './resolve-call-manager.service';

describe('ResolveCallManagerService', () => {
  let service: ResolveCallManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResolveCallManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
