import { TestBed } from '@angular/core/testing';

import { MavianceService } from './maviance.service';

describe('MavianceService', () => {
  let service: MavianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MavianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
