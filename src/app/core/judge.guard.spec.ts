import { TestBed, async, inject } from '@angular/core/testing';

import { JudgeGuard } from './judge.guard';

describe('JudgeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JudgeGuard]
    });
  });

  it('should ...', inject([JudgeGuard], (guard: JudgeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
