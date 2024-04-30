function deleteElements() {
  const fatherDiv = document.querySelector(".content");

  let child = fatherDiv.lastElementChild;
  while (child) {
    fatherDiv.removeChild(child);
    child = fatherDiv.lastElementChild;
  }
}

async function fetchResults() {
  //
  deleteElements();
  //get the query keyword
  const query = document.querySelector("#searchInput").value;
  //check if there's a query
  if (!query) {
    window.alert("Please type a product name!");
    return;
  }
  //Send a Ajax GET request to the server with the query keyword
  let ajax = new XMLHttpRequest();

  ajax.open(`GET`, `http://localhost:8080/search?q=${query}`, true);
  ajax.onreadystatechange = function () {
    if (ajax.status === 200 && ajax.readyState === 4) {
      let res = JSON.parse(ajax.responseText);

      //Call the display products method
      displayProducts(res);
      console.log(res);
    } else {
      console.log(ajax.status);
    }
  };
  ajax.responseType = "text";
  ajax.send();
}

function displayProducts(productList) {
  //Now it will select the destination of the json products on screen
  const fatherDiv = document.querySelector(".content");

  //Loop trough the product list to create the card element for each one
  for (let i = 0; i < productList.length; i++) {
    //Create the elements for the card
    const cardContainer = document.createElement("div");
    const descriptionContainer = document.createElement("div");
    const imageContainer = document.createElement("div");
    const image = document.createElement("img");

    const titleText = document.createElement("p");
    const priceText = document.createElement("p");
    const reviewAmountText = document.createElement("p");
    const numOfStarText = document.createElement("p");

    //Add classes to the created elements
    cardContainer.classList.add("cardContainer");
    image.classList.add("cardImage");
    imageContainer.classList.add("imageContainer");
    descriptionContainer.classList.add("cardDescription");
    titleText.classList.add("cardTitle");
    priceText.classList.add("cardPrice");
    //set the url to the image element
    image.src = productList[i].imgUrl;

    //Set the text content for the text elements
    titleText.textContent = productList[i].title;
    priceText.textContent = productList[i].price;
    reviewAmountText.textContent =
      "Reviews: " +
      (productList[i].reviewAmount === null ? 0 : productList[i].reviewAmount);
    numOfStarText.textContent = "⭐" + productList[i].amountOfStars;

    //Append the child elements to their parent elements
    fatherDiv.appendChild(cardContainer);
    imageContainer.appendChild(image);
    cardContainer.appendChild(imageContainer);
    cardContainer.appendChild(descriptionContainer);

    descriptionContainer.appendChild(titleText);
    descriptionContainer.appendChild(priceText);
    descriptionContainer.appendChild(numOfStarText);
    descriptionContainer.appendChild(reviewAmountText);
  }
}
