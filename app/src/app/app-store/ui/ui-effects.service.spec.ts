import { TestBed } from '@angular/core/testing';

import { UiEffectsService } from './ui-effects.service';

describe('UiEffectsService', () => {
  let service: UiEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
