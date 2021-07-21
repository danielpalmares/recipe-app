export default class View {
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <div class="spinner__in"></div>
      </div> 
    `;

    this._clear();
    recipeSection.insertAdjacentHTML(afterBegin, markup);
  }
}
