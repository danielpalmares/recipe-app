import View from './view';

export default class RenderRandomRecipe extends View {
  constructor(randomRecipe) {
    super();

    this._randomRecipe = randomRecipe;
    this._renderRecipe();
    this._handler();
  }

  _handler() {
    if (!this.randomRecipeImage) return;

    // toggle show/hide ingredients
    const callback = () => {
      // if there's already ingredients showing up
      this.randomRecipeIngContainer
        ? this.randomRecipeIngContainer.parentNode.removeChild(
            this.randomRecipeIngContainer
          )
        : this._renderIngredients();
    };

    this.randomRecipeImage.addEventListener('click', callback);
  }

  _renderIngredients() {
    const markup = `
      <div class="recipe-ingredients">
        <div class="recipe-ingredients__directions">
          <h3 class="recipe-ingredients__title heading-tertiary">
            How to cook it
          </h3>

          <p class="recipe-ingredients-text">
            This recipe was carefully designed and tested by
            <span class="recipe-ingredients__publisher">Check directions</span
            >. Please check out directions at their website.
          </p>

          <a href="${this._randomRecipe.directions}" class="btn-link noSelect" target="_blank">
            <span>Directions</span>
            <svg class="icon recipe-ingredients__icon-arrow-right">
              <use xlink:href="${this.icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      </div>
    `;

    return this.renderAdjacentHtml(
      this.randomRecipeInfoContainer,
      markup,
      'beforeend'
    );
  }

  _renderRecipe() {
    const markup = `
      <div class="recipe-container">
        <div class="recipe-container__image-container noSelect">
          <img
            src="${this._randomRecipe.imageUrl}"
            class="recipe-container__random-image"
            id="recipe-image"
            alt="Recipe photo"
            data-id="${this._randomRecipe.id}"
          />

          <div class="recipe-container__random-text">
            <span class="recipe-container__text">Random recipe</span>
          </div>
        </div>

        <div class="recipe-container__info">
          <div class="recipe-container__name-fav">
            <span class="recipe-container__name">${this._randomRecipe.name}</span>
          </div>
        </div>      
      </div>
    `;

    return this.renderAdjacentHtml(this.mainSection, markup, 'beforeend');
  }
}
