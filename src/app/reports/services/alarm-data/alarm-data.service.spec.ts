import { TestBed } from '@angular/core/testing';

import { AlarmDataService } from './alarm-data.service';

describe('AlarmDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlarmDataService = TestBed.get(AlarmDataService);
    expect(service).toBeTruthy();
  });
});
