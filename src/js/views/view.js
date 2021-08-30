import icons from '../../assets/icons.svg';

export default class View {
  constructor() {
    this.icons = icons;
  }

  // components
  body = document.getElementsByTagName('body')[0];
  headerSearchButton = document.querySelector('#header-search-button');
  headerSearchInput = document.querySelector('#header-input');
  showMoreButton = document.querySelector('#show-more');
  spinner = document.querySelector('.spinner');

  // sections
  recipeSection = document.querySelector('.recipe-section');
  favoriteSection = document.querySelector('.fav-section');
  mainSection = document.querySelector('.main-section');

  noFavoriteMessage = document.querySelector('.fav-section__message-container');
  popup = document.querySelector('.custom-card');
  popupCloseButton = document.querySelector('.custom-card__close-button');
  popupOkButton = document.querySelector('.custom-card__start-button');

  // random recipe card
  randomRecipeImage = document.querySelector('.recipe-container__random-image');
  randomRecipeInfoContainer = document.querySelector('.recipe-container__info');
  randomRecipeIngContainer = document.querySelector('.recipe-ingredients');

  /**
   *
   * @param {*} parentElement Node element
   */
  _clear(parentElement) {
    parentElement.innerHTML = '';
  }

  /**
   *
   * @param {*} element Node element
   */
  removeElement(element) {
    if (!element) return;

    element.parentNode.removeChild(element);
  }

  /**
   *
   * @param {*} parentElement Node element
   * @param {*} markup Html markup as string
   * @param {*} treePosition "beforebegin, afterbegin, beforeend, afterend"
   * @param {*} isClearParent A boolean that says if the parent element must be cleaned or not
   */
  renderAdjacentHtml(
    parentElement,
    markup,
    treePosition,
    isClearParent = false
  ) {
    isClearParent && this._clear(parentElement);

    parentElement.insertAdjacentHTML(treePosition, markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <div class="spinner__in"></div>
      </div> 
    `;

    this.renderAdjacentHtml(this.recipeSection, markup, 'afterbegin', true);
  }
}

export const view = new View();
