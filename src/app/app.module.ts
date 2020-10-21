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
