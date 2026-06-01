import { TestBed } from '@angular/core/testing';

import { LineasServices } from './lineas.services';

describe('LineasServices', () => {
  let service: LineasServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineasServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
