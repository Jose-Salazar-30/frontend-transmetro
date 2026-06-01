import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parqueos } from './parqueos';

describe('Parqueos', () => {
  let component: Parqueos;
  let fixture: ComponentFixture<Parqueos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parqueos],
    }).compileComponents();

    fixture = TestBed.createComponent(Parqueos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
