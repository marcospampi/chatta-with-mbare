import { TestBed } from '@angular/core/testing';

import { SessionEffects } from './session-effects.service';

describe('SessionEffectsService', () => {
  let service: SessionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
