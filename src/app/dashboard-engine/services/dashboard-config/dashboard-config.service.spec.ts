import { TestBed } from '@angular/core/testing';

import { DashboardConfigService } from './dashboard-config.service';

describe('DashboardConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardConfigService = TestBed.get(DashboardConfigService);
    expect(service).toBeTruthy();
  });
});
