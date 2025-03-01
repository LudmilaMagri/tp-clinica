import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistaFormComponent } from './especialista-form.component';

describe('EspecialistaFormComponent', () => {
  let component: EspecialistaFormComponent;
  let fixture: ComponentFixture<EspecialistaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecialistaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
