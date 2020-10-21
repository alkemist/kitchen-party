import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IdentifiableInterface} from '../interfaces/Identifiable';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericApiService<EntityInterface extends IdentifiableInterface > {
  entityName = '';
  protected constructor(protected http: HttpClient) { }

  public getOne(id: string): Promise<EntityInterface> {
    const params = {id};
    return this.http.get<EntityInterface>(`api/${this.entityName}/${id}`).toPromise();
  }

  public getList(): Promise<EntityInterface[]> {
    const params = {};
    return this.http.get<EntityInterface[]>(`api/${this.entityName}`, {params}).toPromise();
  }

  public create(action: EntityInterface): Promise<EntityInterface> {
    return this.http.post<EntityInterface>(`api/${this.entityName}`, action).toPromise();
  }

  public update(action: EntityInterface): Promise<EntityInterface> {
    return this.http.put<EntityInterface>(`api/${this.entityName}/${action.id}`, action).toPromise();
  }

  public delete(id: number): Promise<void> {
    return this.http.delete<void>(`api/${this.entityName}/${id}`).toPromise();
  }
}
