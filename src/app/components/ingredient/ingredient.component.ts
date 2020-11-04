import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IngredientInterface} from '../../interfaces/ingredient';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit {
  @Input() ingredient: IngredientInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});
  families: Observable<FamilyInterface[]>;

  constructor(
      private formBuilder: FormBuilder,
      private familyStore: FamilyStoreService,
    ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      name: this.formBuilder.control('', [Validators.required]),
      family: this.formBuilder.control('', []),
    });

    this.families = (this.form.get('family') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this.filterName(typeof value === 'string' ? value : value.name))
    );
    this.formOutput.emit(this.form);
  }

  displayName(family: FamilyInterface): string {
    return family && family.name ? family.name : '';
  }

  private filterName(name: string): FamilyInterface[] {
    const filterValue = name.toLowerCase();
    return this.familyStore.entities.filter(family => family.name.toLowerCase().includes(filterValue));
  }
}
