import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoAltaComponent } from './turno-alta.component';

describe('TurnoAltaComponent', () => {
  let component: TurnoAltaComponent;
  let fixture: ComponentFixture<TurnoAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoAltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
