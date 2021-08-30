class Utils {
  sliceRecipes(recipesArr, start, end) {
    const recipesSliced = recipesArr.slice(start, end);
    return recipesSliced;
  }

  clearInputField(inputElement) {
    inputElement.value = '';
  }

  isIDinLocalStorage(id) {
    const data = localStorage.getItem('recipesID');
    const parsedData = JSON.parse(data);

    let arr = parsedData === null ? [] : parsedData;
    const isIDinLS = arr.some(obj => obj.recID === id);

    return isIDinLS;
  }
}

export default new Utils();
