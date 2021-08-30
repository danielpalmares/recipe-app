import View from './view';
import Utils from '../utils';
import * as config from '../config';

export default class RecipePagination extends View {
  constructor(recipesArray, page) {
    super();

    // utils methods
    this._sliceRecipes = Utils.sliceRecipes;
    this.isFavoriteRecipe = Utils.isIDinLocalStorage;

    // pagination settings
    this._recipesArray = recipesArray;
    this._currentPage = (page - 1) * config.resultsPerPage;
    this._maximumPage = page * config.resultsPerPage;
  }

  _getSlicedRecipes() {
    return this._sliceRecipes(
      this._recipesArray,
      this._currentPage,
      this._maximumPage
    );
  }

  get recipesPerPage() {
    return this._getSlicedRecipes();
  }
}
