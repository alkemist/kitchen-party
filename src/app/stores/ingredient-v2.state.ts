import { IngredientV2FrontInterface } from '@interfaces';
import { environment } from '../../environments/environment';
import { DocumentFrontInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  IngredientAddAction,
  IngredientDeleteAction,
  IngredientFillAction,
  IngredientGetAction,
  IngredientResetAction,
  IngredientUpdateAction
} from '@app/stores';

interface IngredientStateInterface extends DocumentStateInterface<IngredientV2FrontInterface> {
}

@State({
  name: 'Ingredient',
  class: IngredientV2State,
  defaults: <IngredientStateInterface>{
    publicItems: [] as IngredientV2FrontInterface[],
    lastUpdatedPublicItems: null,
    item: null,
  },
  showLog: !environment.production,
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class IngredientV2State extends DocumentState<IngredientV2FrontInterface> {
  @Select('lastUpdatedPublicItems')
  static lastUpdated<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdatedPublicItems<T>(state);
  }

  @Select('publicItems')
  static items<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.publicItems(state);
  }

  @Select('item')
  static override item<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
  }

  @Action(IngredientFillAction)
  fill(context: StateContext<IngredientStateInterface>, payload: IngredientV2FrontInterface[]) {
    super.fillPublicItems(context, payload);
  }

  @Action(IngredientGetAction)
  override get(context: StateContext<IngredientStateInterface>, payload: IngredientV2FrontInterface) {
    super.get(context, payload);
  }

  @Action(IngredientAddAction)
  override add(context: StateContext<IngredientStateInterface>, payload: IngredientV2FrontInterface) {
    super.add(context, payload);
  }

  @Action(IngredientUpdateAction)
  override update(context: StateContext<IngredientStateInterface>, payload: IngredientV2FrontInterface) {
    super.update(context, payload);
  }

  @Action(IngredientDeleteAction)
  override remove(context: StateContext<IngredientStateInterface>, payload: IngredientV2FrontInterface) {
    super.remove(context, payload);
  }

  @Action(IngredientResetAction)
  override reset(context: StateContext<IngredientStateInterface>, payload: void) {
    super.reset(context, payload);
  }
}
