// search recipes by id https://forkify-api.herokuapp.com/api/v2/recipes/:id

/***************************************
 ***********> CONFIG VARIABLES
 ***************************************/
const randomAJAX = 'https://www.themealdb.com/api/json/v1/1/random.php';
const searchAJAX = 'https://forkify-api.herokuapp.com/api/v2/recipes';
const searchIdAJAX = 'https://forkify-api.herokuapp.com/api/v2/recipes';

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

const getQueryByID = async function (id) {
  const res = await fetch(`${searchIdAJAX}/${id}`);
  const resJSON = await res.json();
  const { recipe } = resJSON.data;

  state.searchByID.status = resJSON.status;
  state.searchByID.recipe.ingredients = recipe.ingredients;
  state.searchByID.recipe.directions = recipe.source_url;
  state.searchByID.recipe.publisher = recipe.publisher;

  console.log(state);
};

const renderRecInfo = function (el) {
  const container = el;
  const ingredients = state.searchByID.recipe.ingredients;

  const recInfoMarkup = `
    <div class="recipe-ingredients">
      <h3 class="heading-tertiary recipe-ingredients__title">
        Recipe ingredients
      </h3>

      <ul class="recipe-ingredients__list">
        ${ingredients
          .map(ing => {
            return `
            <li class="recipe-ingredients__ingredient">
              <div class="recipe-ingredients__wrapper">
                <svg class="icon recipe-ingredients__icon-check">
                  <use xlink:href="src/img/sprite.svg#icon-check"></use>
                </svg>
                <div class="recipe-ingredients__quantity">${
                  ing.quantity === null ? '' : ing.quantity
                }</div>
                <span class="recipe-ingredients__unit">${ing.unit}</span>
              </div>

              <div class="recipe-ingredients__description">${
                ing.description
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
            state.searchByID.recipe.publisher
          }</span
          >. Please check out directions at their website.
        </p>

        <a href="${
          state.searchByID.recipe.directions
        }" class="btn-link noSelect" target="_blank">
          <span>Directions</span>
          <svg class="icon recipe-ingredients__icon-arrow-right">
            <use xlink:href="src/img/sprite.svg#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    </div>
  `;

  if (el.querySelector('.recipe-ingredients') === null)
    container.insertAdjacentHTML('beforeend', recInfoMarkup);
};

const showRecipeInfo = async function (handlerQuery, id, el) {
  // 1) load query
  await handlerQuery(id);

  // 2) render info
  renderRecInfo(el);
};

// recImage.addEventListener('click', () => {
//   showRecipeInfo(getQueryByID, '5ed6604591c37cdc054bca10');
// });

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
  searchByID: {
    status: undefined, // this will be a string
    recipe: {},
  },
  storage: localStorage,
  randomRecipe: [],
};

const getSearchQuery = async function (id, handler) {
  try {
    handler();
    const res = await fetch(`${searchAJAX}?search=${id}`);
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
            data-id="${recObj.id}"
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
          class="recipe-container__random-image"
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

    // 4) events on image
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

      //4 blurring the input
      headerInput.blur();
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

    const recImages = document.querySelectorAll('.recipe-container__image');
    recImages.forEach(img => {
      img.addEventListener('click', function (e) {
        const id = e.target.dataset.id;
        const el = e.target.parentNode.parentNode.querySelector(
          '.recipe-container__info'
        );

        showRecipeInfo(getQueryByID, id, el);
      });
    });
  }
};

const init = function () {
  searchView(getSearchQuery);
};
init();
