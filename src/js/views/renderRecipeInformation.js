import View from './view';
import icons from '../../assets/icons.svg';

class RenderRecipeInformation extends View {
  constructor(container, recipe) {
    super();

    this._container = container;
    this._recipe = recipe;
  }

  render() {
    const markup = `
      <div class="recipe-ingredients">
        <h3 class="heading-tertiary recipe-ingredients__title">
          Recipe ingredients
        </h3>

        <ul class="recipe-ingredients__list">
          ${this._recipe.ingredients
            .map(ingredient => {
              return `
              <li class="recipe-ingredients__ingredient">
                <div class="recipe-ingredients__wrapper">
                  <svg class="icon recipe-ingredients__icon-check">
                    <use xlink:href="${icons}#icon-check"></use>
                  </svg>
                  <div class="recipe-ingredients__quantity">${
                    ingredient.quantity ? ingredient.quantity : ''
                  }</div>
                  <span class="recipe-ingredients__unit">${
                    ingredient.unit
                  }</span>
                </div>

                <div class="recipe-ingredients__description">${
                  ingredient.description
                }</div>  
              </li>
            `;
            })
            .join('')}
        </ul>

        <div class="recipe-ingredients__directions">
          <h3 class="recipe-ingredients__title heading-tertiary">
            How to cook it
          </h3>

          <p class="recipe-ingredients-text">
            This recipe was carefully designed and tested by
            <span class="recipe-ingredients__publisher">${
              this._recipe.publisher
            }</span
            >. Please check out directions at their website.
          </p>

          <a href="${
            this._recipe.directions
          }" class="btn-link noSelect" target="_blank">
            <span>Directions</span>
            <svg class="icon recipe-ingredients__icon-arrow-right">
              <use xlink:href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
      </div>
    `;

    if (this._container.querySelector('.recipe-ingredients') === null)
      return this.renderAdjacentHtml(this._container, markup, 'beforeend');
  }
}
