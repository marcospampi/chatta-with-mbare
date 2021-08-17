import { TestBed } from '@angular/core/testing';

import { SessionManager } from './session-manager.service';

describe('SessionManager.TsService', () => {
  let service: SessionManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
