import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasCerradasComponent } from './ofertas-cerradas.component';

describe('OfertasCerradasComponent', () => {
  let component: OfertasCerradasComponent;
  let fixture: ComponentFixture<OfertasCerradasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasCerradasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasCerradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
