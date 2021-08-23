import { TestBed } from '@angular/core/testing';

import { AnswerGuardService } from './answer-guard.service';

describe('AnswerGuardService', () => {
  let service: AnswerGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnswerGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
