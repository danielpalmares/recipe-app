import View from './view';
import icons from '../../assets/icons.svg';

class RenderFavoriteRecipes extends View {
  constructor() {
    super();

    this._favoriteRecipes = JSON.parse(localStorage.getItem('recipesID'));
  }

  render() {
    // if there is no favorite recipe
    if (!this._favoriteRecipes) return;

    // if there is one favorite recipe at least
    this.favoriteSection.removeChild(this.noFavoriteMessage);

    this._favoriteRecipes.map(recipe => {
      const markup = `
        <div class="fav-section__recipe-container noSelect">
          <div class="fav-section__recipe-image-container">
            <a href="${recipe.direction}" target="_blank">
              <img 
                src="${recipe.image}"
                class="fav-section__recipe-image"
                alt="Recipe photo"
                data-id="${recipe.recID}"
              />
            </a>
      
            <button class="fav-section__remove-fav-button noSelect">
              <svg class="icon fav-section__remove-fav-icon-cross">
                <use xlink:href="${icons}#icon-x"></use>
              </svg>
            </button>
          </div>
          <span class="fav-section__recipe-name">${recipe.name}</span>
        </div>
      `;

      this.renderAdjacentHtml(this.favoriteSection, markup, 'afterbegin');

      // call handler removeFavRecipe
    });
  }
}
