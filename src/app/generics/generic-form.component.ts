import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IdentifiableInterface} from '../interfaces/Identifiable';
import {GenericStoreService} from './generic-store.service';

export class GenericFormComponent<EntityInterface extends IdentifiableInterface>{
  entityName = 'ingredient';
  entity: EntityInterface;
  form: FormGroup = new FormGroup({});
  isLoadingResults = true;

  constructor(
    protected entityStore: GenericStoreService<EntityInterface>,
    protected route: ActivatedRoute,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
  }

  onInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get(`${this.entityName}Id`)) {
        this.entityStore.find(+params.get(`${this.entityName}Id`)).then(entity => {
          if (entity) {
            this.initForm(entity);
            this.isLoadingResults = false;
          }
        });
      } else {
        this.isLoadingResults = false;
      }
    });
  }

  initForm(entity): void {
    this.entity = entity;
    this.form.patchValue(entity);
  }

  formUpdate(form: FormGroup): void{
    this.form = form;
  }

  edit(): void {
    const entity = this.form.value;

    if (this.form.valid) {
      this.send(entity);
    }
  }

  protected send(entity: EntityInterface): void {
    if (this.entity) {
      this.entityStore.update(entity).then(entitySaved => {
        this.entity = entitySaved;
        this.snackBar.open('Mis à jour', 'Fermer', {duration: 5000});
      });
    } else {
      this.entityStore.create(entity).then(entitySaved => {
        this.entity = entitySaved;
        this.snackBar.open('Créé', 'Fermer', {duration: 5000});
      });
    }
  }
}
