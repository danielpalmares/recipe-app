/* DOM EVENTS */

function events() {
  const bodyEl = document.getElementsByTagName('body')[0];

  const listButton = document.querySelector('#header-list-button');

  const listCloseButton = document.querySelector('#nav-list-close-button');
  const navList = document.querySelector('.nav-list');

  const createRecipeButton = document.querySelector('#create-recipe-button');
  const uploadCloseButton = document.querySelector('#upload-close-button');
  const uploadWindow = document.querySelector('.upload-recipe-window');

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
}

// search url: https://forkify-api.herokuapp.com/api/v2/recipes?search=avocado

/* APPLICATION CONTENT */
const recipeSection = document.querySelector('.recipe-section');

const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
      <div class="spinner__in"></div>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const headerInput = document.getElementById('header-input');
const headerSearchButton = document.getElementById('header-search-button');

headerSearchButton.addEventListener('click', function (e) {
  const recipeName = headerInput.value;
  // showRecipe(recipeName);
});

const sliceRecipes = function (recipeArr, start, end) {
  const recipesSliced = recipeArr.slice(start, end);

  return recipesSliced;
};

const showRecipesBySearch = async function () {
  try {
    // 1) rendering spinner
    renderSpinner(recipeSection);

    // 2) fetching the recipe
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=pasta`
    );
    const resData = await res.json();
    const { recipes } = resData.data;

    let curPage = 0;
    let maxPage = 10;
    let maxLength = recipes.length;
    console.log(maxLength, curPage);
    let position = 'afterBegin';

    recipeSection.innerHTML = '';

    renderRecipes(recipes, curPage, maxPage, position);
    insertButton();

    const btnShowMore = document.querySelector('.show-more__button');
    btnShowMore.addEventListener('click', function (e) {
      curPage += 10;
      maxPage += 10;
      position = 'beforeEnd';
      renderRecipes(recipes, curPage, maxPage, position);
      console.log(maxLength, curPage);
    });
  } catch (err) {
    alert(err);
  }
};

showRecipesBySearch();
events();

/***************************************
 ***********> VIEW
 ***************************************/
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

const renderRecipes = function (recipesArr, curPage, maxPage, position) {
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
