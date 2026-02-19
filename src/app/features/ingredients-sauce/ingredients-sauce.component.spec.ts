import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsSauceComponent } from './ingredients-sauce.component';

describe('IngredientsSauceComponent', () => {
  let component: IngredientsSauceComponent;
  let fixture: ComponentFixture<IngredientsSauceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientsSauceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientsSauceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
