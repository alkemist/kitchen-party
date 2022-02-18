import { TestBed } from '@angular/core/testing';
import { KitchenIngredientService } from './kitchen.service';


describe('KitchenIngredientService', () => {
  let service: KitchenIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KitchenIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
