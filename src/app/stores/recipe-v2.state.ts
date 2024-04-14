import { RecipeV2FrontInterface } from '@interfaces';
import { environment } from '../../environments/environment';
import { DocumentFrontInterface, DocumentState, DocumentStateInterface } from '@alkemist/ngx-data-store';
import { Action, Select, State, StateContext } from '@alkemist/ngx-state-manager';
import {
  RecipeAddAction,
  RecipeDeleteAction,
  RecipeFillPublicAction,
  RecipeFillUserAction,
  RecipeGetAction,
  RecipeResetAction,
  RecipeUpdateAction
} from '@app/stores';

interface RecipeStateInterface extends DocumentStateInterface<RecipeV2FrontInterface> {
}

@State({
  name: 'Recipe',
  class: RecipeV2State,
  defaults: <RecipeStateInterface>{
    publicItems: [] as RecipeV2FrontInterface[],
    lastUpdatedPublicItems: null,
    userItems: [] as RecipeV2FrontInterface[],
    lastUpdatedUserItems: null,
    item: null,
  },
  showLog: !environment.production,
  enableLocalStorage: true,
  determineArrayIndexFn: () => 'id',
})
export class RecipeV2State extends DocumentState<RecipeV2FrontInterface> {
  @Select('lastUpdatedPublicItems')
  static override lastUpdatedPublicItems<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdatedPublicItems<T>(state);
  }

  @Select('publicItems')
  static override publicItems<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.publicItems(state);
  }

  @Select('lastUpdatedUserItems')
  static override lastUpdatedUserItems<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>) {
    return DocumentState.lastUpdatedUserItems<T>(state);
  }

  @Select('userItems')
  static override userItems<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T[] {
    return DocumentState.userItems(state);
  }

  @Select('item')
  static override item<T extends DocumentFrontInterface>(state: DocumentStateInterface<T>): T | null {
    return DocumentState.item(state);
  }

  @Action(RecipeFillPublicAction)
  override fillPublicItems(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface[]) {
    super.fillPublicItems(context, payload);
  }

  @Action(RecipeFillUserAction)
  override fillUserItems(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface[]) {
    super.fillUserItems(context, payload);
  }

  @Action(RecipeGetAction)
  override get(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface) {
    super.get(context, payload);
  }

  @Action(RecipeAddAction)
  override add(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface) {
    super.add(context, payload);
  }

  @Action(RecipeUpdateAction)
  override update(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface) {
    super.update(context, payload);
  }

  @Action(RecipeDeleteAction)
  override remove(context: StateContext<RecipeStateInterface>, payload: RecipeV2FrontInterface) {
    super.remove(context, payload);
  }

  @Action(RecipeResetAction)
  override reset(context: StateContext<RecipeStateInterface>, payload: void) {
    super.reset(context, payload);
  }
}
