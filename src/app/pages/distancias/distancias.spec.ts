import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Distancias } from './distancias';

describe('Distancias', () => {
  let component: Distancias;
  let fixture: ComponentFixture<Distancias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Distancias],
    }).compileComponents();

    fixture = TestBed.createComponent(Distancias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
