import { TestBed } from '@angular/core/testing';

import { FinctionsService } from './finctions.service';

describe('FinctionsService', () => {
  let service: FinctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
