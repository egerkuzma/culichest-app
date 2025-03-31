// models/Recipe.js
import mongoose from 'mongoose';

// Преобразуем в ES модуль
export const recipeSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  mainPhoto: String,
  instructions: [{
    text: String,
    photoUrl: String
  }],
  cookTime: String,
  servings: String,
  ingredients: [String],
  categories: [{
    forWhat: [String],
    mainIngred: [String],
    dish: [String],
    geo: [String]
  }],
  views: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Recipe', recipeSchema);
