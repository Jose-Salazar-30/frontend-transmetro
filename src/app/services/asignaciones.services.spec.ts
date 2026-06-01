import { TestBed } from '@angular/core/testing';

import { AsignacionesServices } from './asignaciones.services';

describe('AsignacionesServices', () => {
  let service: AsignacionesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignacionesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
