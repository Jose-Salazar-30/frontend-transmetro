import { TestBed } from '@angular/core/testing';

import { EstacionesServices } from './estaciones.services';

describe('EstacionesServices', () => {
  let service: EstacionesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstacionesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
