import '../sass/main.scss';

/***************************************
 ***********> CONFIG VARIABLES
 ***************************************/
const randomAJAX = 'https://www.themealdb.com/api/json/v1/1/random.php';
const searchAJAX = 'https://forkify-api.herokuapp.com/api/v2/recipes';

let page = 1;
let resPerPage = 10;

/***************************************
 ***********> DOM CONTENT
 ***************************************/
const headerSearchBtn = document.getElementById('header-search-button');
const headerInput = document.getElementById('header-input');
const recipeSection = document.querySelector('.recipe-section');
const bodyEl = document.getElementsByTagName('body')[0];
const afterBegin = 'afterbegin';
const beforeEnd = 'beforeend';

const closePopupBtn = document.querySelector('.custom-card__close-button');
const popup = document.querySelector('.custom-card');
const okBtn = document.querySelector('.custom-card__start-button');

closePopupBtn.addEventListener('click', function (e) {
  popup.classList.add('hidden');
});

okBtn.addEventListener('click', function (e) {
  popup.classList.add('hidden');
});

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

const isIDinLocalStorage = function (id) {
  const strFromLS = state.storage.getItem('recipesID');
  const strFromLSParsed = JSON.parse(strFromLS);
  let arr = strFromLSParsed === null ? [] : strFromLSParsed;

  const checkID = arr.some(obj => obj.recID === id);

  return checkID;
};

/***************************************
 ***********> MODEL
 ***************************************/
const state = {
  search: {
    status: '',
    results: undefined,
    recipes: [],
  },
  searchByID: {
    status: '',
    recipe: {},
  },
  favRecipe: {
    status: '',
    image: '',
    name: '',
    direction: '',
  },
  storage: localStorage,
  randomRecipe: [],
};

const getFavQuery = async function (id) {
  const res = await fetch(`${searchAJAX}/${id}`);
  const resJSON = await res.json();
  const { recipe } = resJSON.data;

  state.favRecipe.status = resJSON.status;
  state.favRecipe.image = recipe.image_url;
  state.favRecipe.name = recipe.title;
  state.favRecipe.direction = recipe.source_url;
};

const getQueryByID = async function (id) {
  const res = await fetch(`${searchAJAX}/${id}`);
  const resJSON = await res.json();
  const { recipe } = resJSON.data;

  state.searchByID.status = resJSON.status;
  state.searchByID.recipe.ingredients = recipe.ingredients;
  state.searchByID.recipe.directions = recipe.source_url;
  state.searchByID.recipe.publisher = recipe.publisher;
};

const settingStorage = async function (id) {
  await getFavQuery(id);

  const recipe = {
    recID: id,
    image: state.favRecipe.image,
    name: state.favRecipe.name,
    direction: state.favRecipe.direction,
  };

  const strFromLS = state.storage.getItem('recipesID');
  const strFromLSParsed = JSON.parse(strFromLS);
  let arr = strFromLSParsed === null ? [] : strFromLSParsed;

  const checkID = arr.some(obj => obj.recID === id);

  if (!checkID) {
    if (state.storage.hasOwnProperty('recipesID')) {
      arr = JSON.parse(state.storage.getItem('recipesID'));
    }
    arr.push(recipe);
    state.storage.setItem('recipesID', JSON.stringify(arr));

    renderSingleFavRec(recipe);
  }
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

    const isIDinLS = isIDinLocalStorage(recObj.id);

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
              <svg class="${
                !isIDinLS
                  ? 'icon recipe-container__fav-icon-heart-inactive'
                  : 'icon recipe-container__fav-icon-heart-active'
              }">
                <use xlink:href="src/img/sprite.svg#icon-heart" class="svg-path"></use>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    recipeSection.insertAdjacentHTML(`${position}`, recipeMarkup);
  });
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
          data-id="${state.randomRecipe[0].id}"
        />

        <div class="recipe-container__random-text">
          <span class="recipe-container__text">Random recipe</span>
        </div>
      </div>

      <div class="recipe-container__info">
        <div class="recipe-container__name-fav">
          <span class="recipe-container__name">${state.randomRecipe[0].name}</span>
        </div>
      </div>      
    </div>
  `;

  mainSection.insertAdjacentHTML('beforeend', randomRecipeMarkup);

  showRandomRecInfo();
};

const renderSingleFavRec = function (obj) {
  const favSection = document.querySelector('.fav-section');

  const favMarkup = `
    <div class="fav-section__recipe-container noSelect">
      <div class="fav-section__recipe-image-container">
        <a href="${obj.direction}" target="_blank">
          <img
            src="${obj.image}"
            class="fav-section__recipe-image"
            alt="Recipe photo"
            data-id="${obj.recID}"
          />
        </a>
    
        <button class="fav-section__remove-fav-button noSelect">
          <svg class="icon fav-section__remove-fav-icon-cross">
            <use xlink:href="src/img/sprite.svg#icon-x"></use>
          </svg>
        </button>
      </div>
      <span class="fav-section__recipe-name">${obj.name}</span>
    </div>
  `;

  if (favSection.querySelector('.fav-section__message-container') !== null) {
    const msg = document.querySelector('.fav-section__message-container');
    favSection.removeChild(msg);
  }
  favSection.insertAdjacentHTML('afterbegin', favMarkup);
  removeFavRecipe();
};

const renderFavRecipes = function () {
  const favSection = document.querySelector('.fav-section');

  const localStorage = state.storage;
  const arr = JSON.parse(localStorage.getItem('recipesID'));

  if (arr === null) return;

  arr.map(rec => {
    const favMarkup = `
      <div class="fav-section__recipe-container noSelect">
        <div class="fav-section__recipe-image-container">
          <a href="${rec.direction}" target="_blank">
            <img 
              src="${rec.image}"
              class="fav-section__recipe-image"
              alt="Recipe photo"
              data-id="${rec.recID}"
            />
          </a>
    
          <button class="fav-section__remove-fav-button noSelect">
            <svg class="icon fav-section__remove-fav-icon-cross">
              <use xlink:href="src/img/sprite.svg#icon-x"></use>
            </svg>
          </button>
        </div>
        <span class="fav-section__recipe-name">${rec.name}</span>
      </div>
    `;

    if (favSection.querySelector('.fav-section__message-container') !== null) {
      const msg = document.querySelector('.fav-section__message-container');
      favSection.removeChild(msg);
    }
    favSection.insertAdjacentHTML('afterbegin', favMarkup);
    removeFavRecipe();
  });
};

/***************************************
 ***********> CONTROLLER
 ***************************************/
window.addEventListener('load', async function () {
  await getRandomQuery();
  renderRandomRecipe();
});

const removeFavRecipe = function () {
  const favSection = document.querySelector('.fav-section');

  if (favSection.querySelector('.fav-section__recipe-container') !== null) {
    favSection.addEventListener('click', function (e) {
      const target = e.target;

      if (target.classList.contains('fav-section__remove-fav-icon-cross')) {
        const img = target.parentNode.parentNode.querySelector(
          '.fav-section__recipe-image'
        );
        const imgID = img.dataset.id;

        const strFromLS = state.storage.getItem('recipesID');
        const strFromLSParsed = JSON.parse(strFromLS);

        let arr = strFromLSParsed === null ? [] : strFromLSParsed;
        let newArr = [];

        newArr = arr.filter(rec => rec.recID !== imgID);

        state.storage.setItem('recipesID', JSON.stringify(newArr));

        favSection.innerHTML = '';
        renderFavRecipes();
      }
    });
  } else return;
};

bodyEl.addEventListener('click', function (e) {
  e.preventDefault();
  const target = e.target;
  const icon = e.target.parentNode;

  if (target.classList.contains('svg-path')) {
    if (!icon.classList.contains('recipe-container__fav-icon-heart-active')) {
      const img =
        icon.parentNode.parentNode.parentNode.previousElementSibling
          .children[0];
      const imgID = img.dataset.id;

      settingStorage(imgID);

      icon.classList.add('recipe-container__fav-icon-heart-active');
    }
  }
});

const showRecipeInfo = async function (handlerQuery, id, el) {
  // 1) load query
  await handlerQuery(id);

  // 2) render info
  renderRecInfo(el);
};

const searchView = function (handler) {
  headerSearchBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    page = 1;
    resPerPage = 10;

    removeBtn();

    // 1) fetch the data and put it in the state
    await handler(headerInput.value, renderSpinner);

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

    showRecInfo();

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

    // 4) showing recipe information
    showRecInfo();
  }
};

const showRecInfo = function () {
  const recImages = document.querySelectorAll('.recipe-container__image');
  recImages.forEach(img => {
    img.addEventListener('click', function (e) {
      const id = e.target.dataset.id;
      const el = e.target.parentNode.parentNode.querySelector(
        '.recipe-container__info'
      );

      const imgContainer = document.querySelector('.recipe-ingredients');
      if (imgContainer === null) showRecipeInfo(getQueryByID, id, el);
      else imgContainer.parentNode.removeChild(imgContainer);
    });
  });
};

const showRandomRecInfo = function () {
  const recImage = document.querySelector('.recipe-container__random-image');

  recImage.addEventListener('click', function (e) {
    const el = e.target.parentNode.parentNode.querySelector(
      '.recipe-container__info'
    );

    const imgContainer = document.querySelector('.recipe-ingredients');
    if (imgContainer === null) renderRandomRecInfo(el);
    else imgContainer.parentNode.removeChild(imgContainer);
  });
};

const renderRandomRecInfo = function (el) {
  const container = el;

  const recInfoMarkup = `
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

        <a href="${state.randomRecipe[0].directions}" class="btn-link noSelect" target="_blank">
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

const init = function () {
  renderFavRecipes();
  searchView(getSearchQuery);
};
init();
