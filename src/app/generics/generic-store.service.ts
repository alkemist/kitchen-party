import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IdentifiableInterface} from '../interfaces/Identifiable';


@Injectable({
  providedIn: 'root'
})
export abstract class GenericStoreService<EntityInterface extends IdentifiableInterface > {
  entityName = '';

  protected constructor(private apiService) { }

  private readonly obsEntities = new BehaviorSubject<EntityInterface[]>([]);

  readonly entities$ = this.obsEntities.asObservable();
  lastUpdate = null;

  get isOutdated(): boolean {
    if (!this.lastUpdate) {
      return true;
    }

    const currentDate = new Date();
    const diff = Math.abs(currentDate.getTime() - this.lastUpdate.getTime());
    return diff > 3600000;
  }

  get entities(): EntityInterface[] {
    if (this.isOutdated) {
      this.apiService.getList().then((entities) => {
        console.log('[API]', this.entityName, 'list', entities);
        const promises: Promise<EntityInterface>[] = [];

        entities.forEach(entity => {
          promises.push(this.hydrate(entity));
        });

        Promise.all(promises).then(entitiesHydrated => {
          this.setEntities(entitiesHydrated);
        });
      });
    }

    return this.obsEntities.getValue();
  }


  private setEntities(val: EntityInterface[]): void {
    // assigning a value to this.entities will push it onto the observable
    // and down to all of its subsribers (ex: this.entities = [])
    this.lastUpdate = new Date();
    this.obsEntities.next(val);
  }

  find(id: number): Promise<EntityInterface> {
    const entitieStored = this.entities.find((entity) => entity.id === id);
    return new Promise<EntityInterface>((resolve) => {
      if (this.isOutdated || !entitieStored) {
        this.apiService.getOne(id.toString()).then((entity: EntityInterface) => {
          console.log('[API]', this.entityName, 'find', entity);
          this.hydrate(entity).then(entityHydrated => resolve(entityHydrated));
        });
      }
      else {
        this.hydrate(entitieStored).then(entityHydrated => resolve(entityHydrated));
      }
    });
  }

  create(entity: EntityInterface): Promise<EntityInterface> {
    return new Promise<EntityInterface>((resolve) => {
      this.apiService.create(entity).then(entitySaved => {
        this.hydrate(entitySaved).then(entityHydrated => {
          resolve(entityHydrated);
        });
      });
    });
  }

  delete(id: number): Promise<void> {
    this.setEntities(this.entities.filter(entity => entity.id !== id));
    return this.apiService.delete(id);
  }

  update(entity: EntityInterface): Promise<EntityInterface> {
    this.setEntity(entity);
    return this.apiService.update(entity)
  }

  protected hydrate(entity: EntityInterface): Promise<EntityInterface> {
    return new Promise<EntityInterface>((resolve) => {
      const promises: Promise<EntityInterface>[] = [];

      if (promises.length > 0) {
        return Promise.all(promises).then(entities => {
          const entityHydrated = Object.assign({}, ...entities);
          resolve(entityHydrated);
          this.setEntity(entityHydrated);
        });
      } else {
        resolve(entity);
        this.setEntity(entity);
      }
    });
  }

  protected addEntity(entity: EntityInterface): any {
    this.setEntities([
      ...this.obsEntities.getValue(),
      entity
    ]);
  }

  protected setEntity(entity: EntityInterface): null {
    if (!entity) {
      return;
    }

    // we need to make a new copy of entities array, and the entity as well
    // remember, our state must always remain immutable
    // otherwise, on push change detection won't work, and won't update its view
    const entities = this.obsEntities.getValue();
    const entitieStored = entities.find(entityCurrent => entityCurrent.id === entity.id);
    const index = entities.indexOf(entitieStored);
    if (entitieStored) {
      this.entities[index] = entity;
      this.setEntities([...this.entities]);
    } else {
      this.addEntity(entity);
    }
    return;
  }
}
