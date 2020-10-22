import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {IngredientListComponent} from './pages/ingredient-list/ingredient-list.component';
import {IngredientFormComponent} from './pages/ingredient-form/ingredient-form.component';
import {ToolListComponent} from './pages/tool-list/tool-list.component';
import {ToolFormComponent} from './pages/tool-form/tool-form.component';
import {MeasureListComponent} from './pages/measure-list/measure-list.component';
import {MeasureFormComponent} from './pages/measure-form/measure-form.component';
import {RecipeListComponent} from './pages/recipe-list/recipe-list.component';
import {RecipeFormComponent} from './pages/recipe-form/recipe-form.component';
import {FamilyListComponent} from './pages/family-list/family-list.component';
import {FamilyFormComponent} from './pages/family-form/family-form.component';
import {OperationListComponent} from './pages/operation-list/operation-list.component';
import {OperationFormComponent} from './pages/operation-form/operation-form.component';
import {ActionFormComponent} from './pages/action-form/action-form.component';
import {ActionListComponent} from './pages/action-list/action-list.component';
import {ListListComponent} from './pages/list-list/list-list.component';
import {ListFormComponent} from './pages/list-form/list-form.component';
import {productListComponent} from './pages/product-list/product-list.component';
import {productFormComponent} from './pages/product-form/product-form.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, data: {} },
  { path: 'actions', component: ActionListComponent, data: {} },
  { path: 'action/new', component: ActionFormComponent, data: {} },
  { path: 'action/:actionId', component: ActionFormComponent, data: {} },
  { path: 'families', component: FamilyListComponent, data: {} },
  { path: 'family/new', component: FamilyFormComponent, data: {} },
  { path: 'family/:familyId', component: FamilyFormComponent, data: {} },
  { path: 'ingredients', component: IngredientListComponent, data: {} },
  { path: 'ingredient/new', component: IngredientFormComponent, data: {} },
  { path: 'ingredient/:ingredientId', component: IngredientFormComponent, data: {} },
  { path: 'lists', component: ListListComponent, data: {} },
  { path: 'list/new', component: ListFormComponent, data: {} },
  { path: 'list/:listId', component: ListFormComponent, data: {} },
  { path: 'measures', component: MeasureListComponent, data: {} },
  { path: 'measure/new', component: MeasureFormComponent, data: {} },
  { path: 'measure/:measureId', component: MeasureFormComponent, data: {} },
  { path: 'operations', component: OperationListComponent, data: {} },
  { path: 'operation/new', component: OperationFormComponent, data: {} },
  { path: 'operation/:operationId', component: OperationFormComponent, data: {} },
  { path: 'products', component: productListComponent, data: {} },
  { path: 'product/new', component: productFormComponent, data: {} },
  { path: 'product/:productId', component: productFormComponent, data: {} },
  { path: 'recipes', component: RecipeListComponent, data: {} },
  { path: 'recipe/new', component: RecipeFormComponent, data: {} },
  { path: 'recipe/:recipeId', component: RecipeFormComponent, data: {} },
  { path: 'tools', component: ToolListComponent, data: {} },
  { path: 'tool/new', component: ToolFormComponent, data: {} },
  { path: 'tool/:toolId', component: ToolFormComponent, data: {} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
