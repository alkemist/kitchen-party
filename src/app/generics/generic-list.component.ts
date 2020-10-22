import {AfterViewInit, Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IdentifiableInterface} from '../interfaces/Identifiable';
import {GenericStoreService} from './generic-store.service';

@Injectable({
  providedIn: 'root'
})
export class GenericListComponent<EntityInterface extends IdentifiableInterface> {
  resultsLength = 0;
  isLoadingResults = true;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: MatTableDataSource<EntityInterface>;

  paginator: MatPaginator;
  sort: MatSort;

  protected constructor(
    public entityStore: GenericStoreService<EntityInterface>,
    public snackBar: MatSnackBar
  ) {}

  onInit(): void {
    this.dataSource = new MatTableDataSource(this.entityStore.entities);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.entityStore.entities$.subscribe(entities => {
      this.dataSource.data = entities;
      if (this.entityStore.lastUpdate) {
        this.isLoadingResults = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(entity: EntityInterface): void {
    this.entityStore.delete(entity.id).then(() => {
      this.snackBar.open('Supprimé', 'Fermer', {duration: 5000});
    });
  }

  afterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }
}
