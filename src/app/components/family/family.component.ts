import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FamilyInterface} from '../../interfaces/family';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {
  @Input() family: FamilyInterface;
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
