import { TestBed } from '@angular/core/testing';

import { VehicleinfoService } from './vehicleinfo.service';

describe('VehicleinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VehicleinfoService = TestBed.get(VehicleinfoService);
    expect(service).toBeTruthy();
  });
});
