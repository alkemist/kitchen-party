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

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, data: {} },
  { path: 'ingredients', component: IngredientListComponent, data: {} },
  { path: 'ingredient/new', component: IngredientFormComponent, data: {} },
  { path: 'ingredient/:ingredientId', component: IngredientFormComponent, data: {} },
  { path: 'measures', component: MeasureListComponent, data: {} },
  { path: 'measure/new', component: MeasureFormComponent, data: {} },
  { path: 'measure/:measureId', component: MeasureFormComponent, data: {} },
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
