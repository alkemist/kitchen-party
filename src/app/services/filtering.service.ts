import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FilteringService {
  private filters: FormGroup = new FormGroup({});

  constructor() {
  }

  getFilters(): FormGroup {
    return this.filters;
  }

  setFilters(form: FormGroup): void {
    this.filters = form;
  }
}
