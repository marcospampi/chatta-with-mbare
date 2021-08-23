import { TestBed } from '@angular/core/testing';

import { CallFeatureEffects } from './call-feature.effects';

describe('CallFeatureEffects', () => {
  let service: CallFeatureEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallFeatureEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
