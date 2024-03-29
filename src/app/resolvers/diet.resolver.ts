import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DietTypes } from '@enums';

@Injectable({providedIn: 'root'})
export class DietResolver implements Resolve<string> {
  constructor() {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<string> {
    return DietTypes.get(route.paramMap.get('diet')!)!;
  }
}
