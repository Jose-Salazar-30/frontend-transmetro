import { TestBed } from '@angular/core/testing';

import { UnidadesServices } from './unidades.services';

describe('UnidadesServices', () => {
  let service: UnidadesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
