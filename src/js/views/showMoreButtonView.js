import View from './view';
import icons from '../../assets/icons.svg';

class ShowMoreButton extends View {
  constructor() {
    super();

    this._parentElement = document.querySelector('.recipe-section');
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    const markup = `
      <div class="show-more" id="show-more">
        <button class="show-more__button noSelect">
          <span class="show-more__text">Show more</span>
          <svg class="icon show-more__icon-chevron">
            <use xlink:href="${icons}#icon-arrow-down"></use>
          </svg>
        </button>
      </div>
    `;

    return this.renderAdjacentHtml(
      this._parentElement,
      markup,
      'afterend',
      false
    );
  }
}

export default new ShowMoreButton();
