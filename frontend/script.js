async function fetchResults() {
  //Create a list of products to be received
  let productList = [];
  //get the query keyword
  const query = document.querySelector("#searchInput").value;
  //check if there's a query
  if (!query) {
    window.alert("Please type a product name!");
  }
  //Send a GET request to the server with the query keyword
  await fetch(`http://localhost:8080/search?q=${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      //Set the result to the products list
      productList = result;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  //Call the dispay product method
  displayProducts(productList);
}

function displayProducts(productList) {
  //Now it will select the destination of the json products on screen
  const fatherDiv = document.querySelector(".content");
  //Parse the product list to string to be displayed
  fatherDiv.innerHTML = JSON.stringify(productList, undefined, 4);
}
