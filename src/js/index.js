/***************************************
 ***********> CONFIG VARIABLES
 ***************************************/
const SearchAJAX = 'https://forkify-api.herokuapp.com/api/v2/recipes';
let page = 1;

/***************************************
 ***********> DOM CONTENT
 ***************************************/
const headerSearchBtn = document.getElementById('header-search-button');
const headerInput = document.getElementById('header-input');
const recipeSection = document.querySelector('.recipe-section');

/***************************************
 ***********> HELPERS
 ***************************************/
const sliceRecipes = function (recipeArr, start, end) {
  const recipesSliced = recipeArr.slice(start, end);
  return recipesSliced;
};

const clearInputField = function (inputEl) {
  inputEl.value = '';
};

/***************************************
 ***********> MODEL
 ***************************************/
const state = {
  search: {
    status: undefined, // this will be a string
    results: undefined, // this will be a number
    recipes: [],
  },
};

const getSearchQuery = async function (id, handler) {
  try {
    handler();
    const res = await fetch(`${SearchAJAX}?search=${id}`);
    const resData = await res.json();
    const { recipes } = resData.data;

    state.search.status = resData.status;
    state.search.results = resData.results;
    state.search.recipes = recipes;
  } catch (err) {
    alert(err);
  }
};

/***************************************
 ***********> VIEW
 ***************************************/
const renderSpinner = function () {
  const spinnerMarkup = `
    <div class="spinner">
      <div class="spinner__in"></div>
    </div> 
  `;
  recipeSection.innerHTML = '';
  recipeSection.insertAdjacentHTML('afterbegin', spinnerMarkup);
};

const removeSpinner = function () {
  const spinnerEl = document.querySelector('.spinner');
  spinnerEl.parentNode.removeChild(spinnerEl);
};

const insertButton = function () {
  const btnMarkup = `
    <div class="show-more" id="show-more">
      <button class="show-more__button noSelect">
        <span class="show-more__text">Show more</span>
        <svg class="icon show-more__icon-chevron">
          <use xlink:href="src/img/sprite.svg#icon-arrow-down"></use>
        </svg>
      </button>
    </div>
  `;
  recipeSection.insertAdjacentHTML('beforeend', btnMarkup);
};

const removeBtn = function () {
  const btn = document.querySelector('#show-more');
  btn.parentNode.removeChild(btn);
};

const renderNoRecMsg = function () {
  const noRecMsgMarkup = `
    <div class="search-message">
      <span class="search-message__text">
        No recipes found for your query! Please try again.
      </span>
      <svg class="icon search-message__message-icon-happy">
        <use xlink:href="src/img/sprite.svg#icon-frown"></use>
      </svg>
    </div>
  `;
  recipeSection.insertAdjacentHTML('afterbegin', noRecMsgMarkup);
};

const renderRecipesBySearch = function (recipesArr, page, position) {
  const curPage = (page - 1) * 10;
  const maxPage = page * 10;

  const recipesNewArr = sliceRecipes(recipesArr, curPage, maxPage);
  recipesNewArr.map(rec => {
    const recObj = {
      id: rec.id,
      publisher: rec.publisher,
      image: rec.image_url,
      title: rec.title,
    };

    const recipeMarkup = `
      <div class="recipe-container">
        <div class="recipe-container__image-container noSelect">
          <img
            src="${recObj.image}"
            class="recipe-container__image"
            id="recipe-image"
            alt="Recipe photo"
          />
        </div>

        <div class="recipe-container__info">
          <div class="recipe-container__name-fav">
            <span class="recipe-container__name">${recObj.title}</span>

            <button class="recipe-container__fav-button noSelect">
              <svg class="icon recipe-container__fav-icon-heart">
                <use xlink:href="src/img/sprite.svg#icon-heart"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    recipeSection.insertAdjacentHTML(`${position}`, recipeMarkup);
  });
};

/***************************************
 ***********> CONTROLLER
 ***************************************/
const searchView = function (handler) {
  headerSearchBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    // 1) fetch the data and put it in the state
    await handler(headerInput.value, renderSpinner);

    // 2) render the data from state
    controlSearchRecipes();

    // 3) clear the input
    clearInputField(headerInput);
  });
};

const showMoreView = function () {
  const btnShowMore = document.querySelector('.show-more__button');

  btnShowMore.addEventListener('click', () => {
    page++;
    removeBtn();

    renderRecipesBySearch(state.search.recipes, page, 'beforeend');
    insertButton();
  });
};

const controlSearchRecipes = function () {
  // 1) rendering recipes
  if (state.search.results === 0) {
    removeSpinner();
    renderNoRecMsg();
  } else if (state.search.results > 0) {
    removeSpinner();
    renderRecipesBySearch(state.search.recipes, page, 'afterbegin');

    // 2) inserting button
    insertButton();

    // 3) attaching event to button show more
    showMoreView();
  }
};

const init = function () {
  searchView(getSearchQuery);
};
init();
