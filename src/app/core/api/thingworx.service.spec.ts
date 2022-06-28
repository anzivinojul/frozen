import { TestBed } from '@angular/core/testing';

import { ThingworxService } from './thingworx.service';

describe('ThingworxService', () => {
  let service: ThingworxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThingworxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
