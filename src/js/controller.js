// import icons from 'url:../img/sprite.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import icons from '../img/sprite.svg';
import events from './events';

/* DOM EVENTS */

/* APPLICATION CONTENT */
const recipeSection = document.querySelector('.recipe-section');

const showRecipe = async function () {
  try {
    // 1) fetching the recipe
    const res = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const resData = await res.json();

    const { recipe } = resData.data;
    const recipeData = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageURL: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceURL: recipe.source_url,
      title: recipe.title,
    };

    console.log(res, resData, recipeData);

    // 2) rendering the recipe
    const markup = `
      <div class="recipe-container">
        <div class="recipe-container__image-container noSelect">
          <img
            src="${recipeData.imageURL}"
            class="recipe-container__image"
            id="recipe-image"
            alt="Recipe photo"
          />
        </div>

        <div class="recipe-container__info">
          <div class="recipe-container__name-fav">
            <span class="recipe-container__name">${recipeData.title}</span>

            <div class="recipe-container__timing-servings">
              <svg class="icon recipe-container__icon-clock">
                <use xlink:href="${icons}#icon-clock"></use>
              </svg>
              <span class="recipe-container__timing">${
                recipeData.cookingTime
              } min</span>
            </div>

            <button class="recipe-container__fav-button noSelect">
              <svg class="icon recipe-container__fav-icon-heart">
                <use xlink:href="${icons}#icon-heart"></use>
              </svg>
            </button>
          </div>

          <div class="recipe-ingredients hidden">
            <h3 class="heading-tertiary recipe-ingredients__title">
              Recipe ingredients
            </h3>
            <ul class="recipe-ingredients__list">
              ${recipeData.ingredients
                .map(ing => {
                  return `
                  <li class="recipe-ingredients__ingredient">
                    <div class="recipe-ingredients__wrapper">
                      <svg class="icon recipe-ingredients__icon-check">
                        <use xlink:href="${icons}#icon-check"></use>
                      </svg>
                      <div class="recipe-ingredients__quantity">${ing.quantity}</div>
                      <span class="recipe-ingredients__unit">${ing.unit}</span>
                    </div>

                    <div class="recipe-ingredients__description">${ing.description}</div>
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
                  recipeData.publisher
                }</span
                >. Please check out directions at their website.
              </p>

              <a href="${
                recipeData.sourceURL
              }" class="btn-link noSelect" target="_blank">
                <span>Directions</span>
                <svg class="icon recipe-ingredients__icon-arrow-right">
                  <use xlink:href="${icons}#icon-arrow-right"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>`;
    recipeSection.innerHTML = '';
    recipeSection.insertAdjacentHTML('afterbegin', markup);

    const recipeImgToggle = document.getElementById('recipe-image');
    const recipeInfoSection = document.querySelector('.recipe-ingredients');

    recipeImgToggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (recipeInfoSection.classList.contains('hidden')) {
        recipeInfoSection.classList.remove('hidden');
        recipeInfoSection.classList.add('activeFlex');
      } else if (recipeInfoSection.classList.contains('activeFlex')) {
        recipeInfoSection.classList.remove('activeFlex');
        recipeInfoSection.classList.add('hidden');
      }
    });
  } catch (err) {
    alert(err);
  }
};

showRecipe();
events();
