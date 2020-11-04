import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MeasureInterface} from '../../interfaces/measure';
import {MeasureStoreService} from '../../services/measure-store.service';
import {isUnselectedAutocompleteValidator} from '../../validators/isUnselectedAutocomplete';
import {MatterEnum} from '../../enums/matter';
import {MeasureTypeEnum, MeasureUnitEnum} from '../../enums/measureType';
import {FamilyStoreService} from '../../services/family-store.service';
import {FamilyInterface} from '../../interfaces/family';
import {MeasureTypeLabels, MeasureUnitLabels} from '../../labels/measure';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit {
  @Input() measure: MeasureInterface
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});
  measures: Observable<MeasureInterface[]>;
  families: Observable<FamilyInterface[]>;

  typeValuesLabels = MeasureTypeLabels;
  unitValuesLabels = MeasureUnitLabels;

  typeChangeSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private measureStore: MeasureStoreService,
    private familyStore: FamilyStoreService,
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      name: this.formBuilder.control('', [Validators.required]),
      type: this.formBuilder.control('', [Validators.required]),
      quantity: this.formBuilder.control('', [Validators.required]),
      measure: this.formBuilder.control('', [isUnselectedAutocompleteValidator]),
      family: this.formBuilder.control('', []),
    });
    this.typeChangeSubscription = this.form.get('type').valueChanges.subscribe(type => {
      (this.form.get('measure') as FormControl).patchValue(this.form.get('measure').value);
    });
    this.measures = (this.form.get('measure') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this.filterMeasureName(typeof value === 'string' ? value : value.name))
    );
    this.families = (this.form.get('family') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this.filterFamilyName(typeof value === 'string' ? value : value.name))
    );
    this.formOutput.emit(this.form);
  }

  hasFamily(): boolean  {
    return this.form.get('type').value === MeasureTypeEnum.mass
      || this.form.get('type').value === MeasureTypeEnum.volume
      || this.form.get('type').value === MeasureTypeEnum.temperature
    ;
  }

  displayName(measure: MeasureInterface): string {
    return measure && measure.name ? measure.name : '';
  }

  private filterMeasureName(name: string): MeasureInterface[] {
    const filterValue = name.toLowerCase();
    return this.measureStore.entities.filter(measure => measure.name.toLowerCase().includes(filterValue) && measure.type === this.form.get('type').value);
  }

  private filterFamilyName(name: string): FamilyInterface[] {
    const filterValue = name.toLowerCase();
    return this.familyStore.entities.filter(family => family.name.toLowerCase().includes(filterValue));
  }

  onDestroy(): void {
    if (this.typeChangeSubscription) {
      this.typeChangeSubscription.unsubscribe();
    }
  }
}
