import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filters: FormGroup = new FormGroup({});

  constructor() {
  }
}
