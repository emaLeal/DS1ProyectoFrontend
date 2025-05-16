import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasActivasComponent } from './ofertas-activas.component';

describe('OfertasActivasComponent', () => {
  let component: OfertasActivasComponent;
  let fixture: ComponentFixture<OfertasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
