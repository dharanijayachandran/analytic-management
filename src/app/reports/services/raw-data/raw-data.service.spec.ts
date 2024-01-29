import { TestBed } from '@angular/core/testing';

import { RawDataService } from './raw-data.service';

describe('RawDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RawDataService = TestBed.get(RawDataService);
    expect(service).toBeTruthy();
  });
});
