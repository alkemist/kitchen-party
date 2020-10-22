import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ListInterface} from '../../interfaces/list';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ListApiService} from '../../services/list-api.service';
import {ListStoreService} from '../../services/list-store.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericListComponent} from '../../generics/generic-list.component';

@Component({
  selector: 'app-list-list',
  templateUrl: './list-list.component.html',
  styleUrls: ['./list-list.component.scss']
})
export class ListListComponent extends GenericListComponent<ListInterface> implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public listStore: ListStoreService,
    public snackBar: MatSnackBar
  ) {
    super(listStore, snackBar);
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    super.afterViewInit();
  }
}
