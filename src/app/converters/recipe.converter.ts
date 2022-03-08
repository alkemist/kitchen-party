import { FirestoreDataConverter } from '@firebase/firestore';
import { DocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { RecipeInterface } from '../interfaces';
import { RecipeModel } from '../models';

export const recipeConverter: FirestoreDataConverter<RecipeInterface> = {
  toFirestore: (recipe: RecipeModel): RecipeInterface => {
    const recipeFields = {...recipe} as RecipeInterface;
    delete recipeFields.id;
    recipeFields.recipeIngredients = [];

    recipe.recipeIngredients.forEach(recipeIngredient => {
      const recipeIngredientField = {...recipeIngredient};
      delete recipeIngredientField.id;

      recipeIngredientField.ingredientId = recipeIngredient.ingredient?.id! || '';
      delete recipeIngredientField.ingredient;

      recipeIngredientField.recipeId = recipeIngredient.recipe?.id! || '';
      delete recipeIngredientField.recipe;

      recipeFields.recipeIngredients?.push({
        ...recipeIngredientField
      });
    });

    return recipeFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as RecipeInterface;
  }
};
