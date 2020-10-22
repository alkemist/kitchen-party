import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ShelfInterface} from '../../interfaces/shelf';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {ToolStoreService} from '../../services/tool-store.service';
import {ShelfStoreService} from '../../services/shelf-store.service';
import {MeasureStoreService} from '../../services/measure-store.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @Input() shelf: ShelfInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
    });
    this.formOutput.emit(this.form);
  }
}
