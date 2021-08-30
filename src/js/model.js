import * as config from './config';

export const state = {
  search: {
    status: '',
    results: 0,
    recipes: [],
  },
  searchByID: {
    status: '',
    recipe: {},
  },
  favoriteRecipe: {
    status: '',
    image: '',
    name: '',
    direction: '',
  },
  randomRecipe: {},
};

export async function fetchFavoriteRecipe(id) {
  try {
    const res = await fetch(`${config.searchAJAX}/${id}`);
    const resJSON = await res.json();
    const { recipe } = resJSON.data;

    state.favoriteRecipe.status = resJSON.status;
    state.favoriteRecipe.image = recipe.image_url;
    state.favoriteRecipe.name = recipe.title;
    state.favoriteRecipe.direction = recipe.source_url;
  } catch (err) {
    alert(err);
  }
}

export async function fetchRecipeById(id) {
  try {
    const res = await fetch(`${config.searchAJAX}/${id}`);
    const resJSON = await res.json();
    const { recipe } = resJSON.data;

    state.searchByID.status = resJSON.status;
    state.searchByID.recipe.ingredients = recipe.ingredients;
    state.searchByID.recipe.direction = recipe.source_url;
    state.searchByID.recipe.publisher = recipe.publisher;
  } catch (err) {
    alert(err);
  }
}

export async function settingUpLocalStorage(id) {
  await fetchFavoriteRecipe(id);

  const recipe = {
    recID: id,
    image: state.favoriteRecipe.image,
    name: state.favoriteRecipe.name,
    direction: state.favoriteRecipe.direction,
  };

  const data = localStorage.getItem('recipesID');
  const parsedData = JSON.parse(data);
  let arr = parsedData === null ? [] : parsedData;

  const isIdInLS = arr.some(obj => obj.recID === id);

  if (!isIdInLS) {
    if (localStorage.hasOwnProperty('recipesID'))
      arr = JSON.parse(localStorage.getItem('recipesID'));

    arr.push(recipe);
    localStorage.setItem('recipesID', JSON.stringify(arr));

    renderSingleFavRec(recipe);
  }
}

export async function fetchRecipes(recipeName) {
  try {
    const res = await fetch(`${searchAJAX}?search=${recipeName}`);
    const data = await res.json();
    const { recipes } = data.data;

    state.search.status = data.status;
    state.search.results = data.results;
    state.search.recipes = recipes;
  } catch (err) {
    alert(err);
  }
}

export async function fetchRandomRecipe() {
  try {
    const res = await fetch(randomAJAX);
    const resJSON = await res.json();
    const data = resJSON.meals[0];

    state.randomRecipe = {
      id: data.idMeal,
      name: data.strMeal,
      imageUrl: data.strMealThumb,
      directions: data.strSource,
      instructions: data.strInstructions,
      ingredients: [],
      measures: [],
    };

    for (const key in data) {
      if (key.includes('Ingredient')) {
        state.randomRecipe.ingredients.push(data[key]);
      }
      if (key.includes('Measure')) {
        state.randomRecipe.measures.push(data[key]);
      }
    }
  } catch (err) {
    alert(err);
  }
}
