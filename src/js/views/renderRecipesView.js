import RecipePagination from './recipePagination';
import icons from '../../assets/icons.svg';

export default class RenderRecipes extends RecipePagination {
  constructor(recipesArray, pageNumber, domPosition = 'afterbegin') {
    super(recipesArray, pageNumber);

    this._recipesPerPage = this.recipesPerPage;
    this._domPosition = domPosition;

    this.render();
  }

  render() {
    return this._recipesPerPage.map(recipe => {
      const recipeObject = {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
      };

      const isFavoriteRecipe = this.isFavoriteRecipe(recipeObject.id);

      const markup = `
        <div class="recipe-container">
          <div class="recipe-container__image-container noSelect">
            <img
              src="${recipeObject.image}"
              class="recipe-container__image"
              id="recipe-image"
              alt="Recipe photo"
              data-id="${recipeObject.id}"
            />
          </div>

          <div class="recipe-container__info">
            <div class="recipe-container__name-fav">
              <span class="recipe-container__name">${recipeObject.title}</span>

              <button class="recipe-container__fav-button noSelect">
                <svg class="${
                  isFavoriteRecipe
                    ? 'icon recipe-container__fav-icon-heart-active'
                    : 'icon recipe-container__fav-icon-heart-inactive'
                }">
                  <use xlink:href="${icons}#icon-heart" class="svg-path"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      return this.renderAdjacentHtml(
        this.recipeSection,
        markup,
        this._domPosition
      );
    });
  }
}
