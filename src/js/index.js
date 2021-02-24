/***************************************
 ***********> DOM CONTENT
 ***************************************/
const bodyEl = document.getElementsByTagName('body')[0];

const listButton = document.querySelector('#header-list-button');

const listCloseButton = document.querySelector('#nav-list-close-button');
const navList = document.querySelector('.nav-list');

const createRecipeButton = document.querySelector('#create-recipe-button');
const uploadCloseButton = document.querySelector('#upload-close-button');
const uploadWindow = document.querySelector('.upload-recipe-window');

const recipeSection = document.querySelector('.recipe-section');

const headerInput = document.getElementById('header-input');
const headerSearchButton = document.getElementById('header-search-button');

const events = function () {
  listButton.addEventListener('click', () => {
    navList.classList.remove('hidden');
    bodyEl.style.overflow = 'hidden';
  });

  listCloseButton.addEventListener('click', () => {
    navList.classList.add('hidden');
    bodyEl.style.overflow = 'visible';
  });

  createRecipeButton.addEventListener('click', () => {
    uploadWindow.classList.remove('hidden');
    bodyEl.style.overflow = 'hidden';
  });

  uploadCloseButton.addEventListener('click', () => {
    uploadWindow.classList.add('hidden');
    bodyEl.style.overflow = 'visible';
  });

  headerSearchButton.addEventListener('click', function (e) {
    const recipeName = headerInput.value;
    // showRecipe(recipeName);
  });
};

/***************************************
 ***********> MAGIC VARIABLES
 ***************************************/
const afterBegin = 'afterBegin';
const beforeEnd = 'beforeEnd';
let page = 1;

/***************************************
 ***********> HELPERS
 ***************************************/
const sliceRecipes = function (recipeArr, start, end) {
  const recipesSliced = recipeArr.slice(start, end);

  return recipesSliced;
};

/***************************************
 ***********> MODEL
 ***************************************/

/***************************************
 ***********> VIEW
 ***************************************/
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <div class="spinner__in"></div>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const insertButton = function () {
  const btnMarkup = `
    <div class="show-more">
      <button class="show-more__button noSelect">
      <span class="show-more__text">Show more</span>
      <svg class="icon show-more__icon-chevron">
        <use xlink:href="src/img/sprite.svg#icon-arrow-down"></use>
      </svg>
      </button>
    </div>
  `;

  recipeSection.insertAdjacentHTML('afterEnd', btnMarkup);
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
      </div>`;

    recipeSection.insertAdjacentHTML(`${position}`, recipeMarkup);
  });
};

/***************************************
 ***********> CONTROLLER
 ***************************************/
const showRecipesBySearch = async function () {
  try {
    // 1) rendering spinner
    renderSpinner(recipeSection);

    // 2) fetching the recipe
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=carrot`
    );
    const resData = await res.json();
    const { recipes } = resData.data;

    // 3) rendering recipes
    recipeSection.innerHTML = '';
    renderRecipesBySearch(recipes, page, afterBegin);

    // 4) rendering show more button
    insertButton();

    // 5) rendering on show more button
    const btnShowMore = document.querySelector('.show-more__button');

    btnShowMore.addEventListener('click', () => {
      page++;
      renderRecipesBySearch(recipes, page, beforeEnd);
    });
  } catch (err) {
    alert(err);
  }
};

showRecipesBySearch();
events();
