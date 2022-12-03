import { TestBed } from '@angular/core/testing';

import { NotconnectedGuard } from './notconnected.guard';

describe('NotconnectedGuard', () => {
  let guard: NotconnectedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotconnectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
