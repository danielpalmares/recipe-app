/***************************************
 ***********> CONFIG VARIABLES
 ***************************************/
const SearchAJAX = 'https://forkify-api.herokuapp.com/api/v2/recipes';
const randomAJAX = 'https://www.themealdb.com/api/json/v1/1/random.php';
let page = 1;
let resPerPage = 10;

/***************************************
 ***********> DOM CONTENT
 ***************************************/
const headerSearchBtn = document.getElementById('header-search-button');
const headerInput = document.getElementById('header-input');
const recipeSection = document.querySelector('.recipe-section');
const afterBegin = 'afterbegin';
const beforeEnd = 'beforeend';

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
  storage: localStorage,
  randomRecipe: [],
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

const getRandomQuery = async function () {
  try {
    const res = await fetch(randomAJAX);
    const resJSON = await res.json();
    const data = resJSON.meals[0];

    state.randomRecipe = [
      {
        id: data.idMeal,
        name: data.strMeal,
        imageUrl: data.strMealThumb,
        directions: data.strSource,
        instructions: data.strInstructions,
        ingredients: [],
        measures: [],
      },
    ];

    for (const key in data) {
      if (key.includes('Ingredient')) {
        state.randomRecipe[0].ingredients.push(data[key]);
      }
      if (key.includes('Measure')) {
        state.randomRecipe[0].measures.push(data[key]);
      }
    }

    console.log(state.randomRecipe);
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
  recipeSection.insertAdjacentHTML(afterBegin, spinnerMarkup);
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
  recipeSection.insertAdjacentHTML('afterend', btnMarkup);
};

const removeBtn = function () {
  const btn = document.querySelector('#show-more');
  if (btn === null) return;

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
  recipeSection.insertAdjacentHTML(afterBegin, noRecMsgMarkup);
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

const renderRandomRecipe = function () {
  const mainSection = document.querySelector('.main-section');

  const randomRecipeMarkup = `
    <div class="recipe-container">
      <div class="recipe-container__image-container noSelect">
        <img
          src="${state.randomRecipe[0].imageUrl}"
          class="recipe-container__image"
          id="recipe-image"
          alt="Recipe photo"
        />
      </div>

      <div class="recipe-container__info">
        <div class="recipe-container__name-fav">
          <span class="recipe-container__name">${state.randomRecipe[0].name}</span>

          <button class="recipe-container__fav-button noSelect">
            <svg class="icon recipe-container__fav-icon-heart">
              <use xlink:href="src/img/sprite.svg#icon-heart"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe-container__random-text">
        <span class="recipe-container__text">Random recipe</span>
      </div>
    </div>
  `;

  mainSection.innerHTML = '';
  mainSection.insertAdjacentHTML('afterbegin', randomRecipeMarkup);
};

/***************************************
 ***********> CONTROLLER
 ***************************************/
window.addEventListener('load', async function () {
  await getRandomQuery();
  renderRandomRecipe();
});

const searchView = function (handler) {
  headerSearchBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    page = 1;
    resPerPage = 10;

    removeBtn();

    // 1) fetch the data and put it in the state
    await handler(headerInput.value, renderSpinner);
    console.log(state.search.recipes);

    // 2) render the data from state
    controlSearchRecipes();

    // 3) clear the input
    clearInputField(headerInput);
  });

  document.addEventListener('keydown', async function (e) {
    const keyName = e.key;

    if (keyName === 'Enter') {
      e.preventDefault();
      page = 1;
      resPerPage = 10;

      removeBtn();

      // 1) fetch the data and put it in the state
      await handler(headerInput.value, renderSpinner);
      console.log(state.search.recipes);

      // 2) render the data from state
      controlSearchRecipes();

      // 3) clear the input
      clearInputField(headerInput);
    }
  });
};

const showMoreView = function () {
  const btnShowMore = document.querySelector('.show-more__button');

  btnShowMore.addEventListener('click', () => {
    page++;
    resPerPage += 10;

    renderRecipesBySearch(state.search.recipes, page, beforeEnd);

    if (resPerPage >= state.search.results) removeBtn();
  });
};

const controlSearchRecipes = function () {
  // 1) rendering recipes
  if (state.search.results === 0 || headerInput.value === '') {
    removeSpinner();
    renderNoRecMsg();
  }
  if (state.search.results > 0) {
    removeSpinner();
    renderRecipesBySearch(state.search.recipes, page, afterBegin);

    // 2) inserting button
    if (document.querySelector('.show-more') === null) {
      insertButton();
      // 3) attaching event to button show more
      showMoreView();
    }
  }
};

const init = function () {
  searchView(getSearchQuery);
};
init();
