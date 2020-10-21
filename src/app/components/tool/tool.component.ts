import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {ToolInterface} from '../../interfaces/tool';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {
  @Input() tool: ToolInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});

  matterValuesLabels = [
    {value: MatterEnum.ceramic, label: 'Céramique'},
    {value: MatterEnum.glass, label: 'Verre'},
    {value: MatterEnum.plastic, label: 'Plastique'},
    {value: MatterEnum.stainlessSteel, label: 'Inox'},
    {value: MatterEnum.wood, label: 'Bois'},
  ];

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      matter: this.formBuilder.control('', [])
    });
    this.formOutput.emit(this.form);
  }
}
