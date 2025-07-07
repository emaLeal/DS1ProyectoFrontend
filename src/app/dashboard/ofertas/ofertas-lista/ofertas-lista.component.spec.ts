import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasListaComponent } from './ofertas-lista.component';

describe('OfertasListaComponent', () => {
  let component: OfertasListaComponent;
  let fixture: ComponentFixture<OfertasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
