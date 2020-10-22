import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActionInterface} from '../../interfaces/action';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ActionApiService} from '../../services/action-api.service';
import {ActionStoreService} from '../../services/action-store.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericListComponent} from '../../generics/generic-list.component';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent extends GenericListComponent<ActionInterface> implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public actionStore: ActionStoreService,
    public snackBar: MatSnackBar
  ) {
    super(actionStore, snackBar);
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    super.afterViewInit();
  }
}
