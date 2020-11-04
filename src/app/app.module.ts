import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import {MaterialModule} from './modules/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { IngredientListComponent } from './pages/ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './pages/ingredient-form/ingredient-form.component';
import { ToolFormComponent } from './pages/tool-form/tool-form.component';
import { ToolListComponent } from './pages/tool-list/tool-list.component';
import { MeasureListComponent } from './pages/measure-list/measure-list.component';
import { MeasureFormComponent } from './pages/measure-form/measure-form.component';
import { RecipeListComponent } from './pages/recipe-list/recipe-list.component';
import { RecipeFormComponent } from './pages/recipe-form/recipe-form.component';
import { MeasureComponent } from './components/measure/measure.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { ToolComponent } from './components/tool/tool.component';
import { OperationComponent } from './components/operation/operation.component';
import { FamilyComponent } from './components/family/family.component';
import { FamilyListComponent } from './pages/family-list/family-list.component';
import { FamilyFormComponent } from './pages/family-form/family-form.component';
import { OperationListComponent } from './pages/operation-list/operation-list.component';
import { OperationFormComponent } from './pages/operation-form/operation-form.component';
import { ActionComponent } from './components/action/action.component';
import { ActionFormComponent } from './pages/action-form/action-form.component';
import { ActionListComponent } from './pages/action-list/action-list.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ProductComponent } from './components/product/product.component';
import { ListComponent } from './components/list/list.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import {ListListComponent} from './pages/list-list/list-list.component';
import {ListFormComponent} from './pages/list-form/list-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IngredientListComponent,
    IngredientFormComponent,
    ToolFormComponent,
    ToolListComponent,
    MeasureListComponent,
    MeasureFormComponent,
    RecipeListComponent,
    RecipeFormComponent,
    MeasureComponent,
    IngredientComponent,
    ToolComponent,
    OperationComponent,
    FamilyComponent,
    FamilyListComponent,
    FamilyFormComponent,
    OperationListComponent,
    OperationFormComponent,
    ActionComponent,
    ActionFormComponent,
    ActionListComponent,
    RecipeComponent,
    ProductComponent,
    ListComponent,
    ProductListComponent,
    ProductFormComponent,
    ListListComponent,
    ListFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
