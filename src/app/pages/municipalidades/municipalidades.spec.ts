import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Municipalidades } from './municipalidades';

describe('Municipalidades', () => {
  let component: Municipalidades;
  let fixture: ComponentFixture<Municipalidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Municipalidades],
    }).compileComponents();

    fixture = TestBed.createComponent(Municipalidades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
