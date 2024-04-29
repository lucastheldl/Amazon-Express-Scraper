async function fetchResults() {
  let productList = [];
  const query = document.querySelector("#searchInput").value;
  if (!query) {
    window.alert("Please type a product name!");
  }

  await fetch(`http://localhost:8080/search?q=${query}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Server response:", result);
      productList = result;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  displayProducts(productList);
}

function displayProducts(productList) {
  const fatherDiv = document.querySelector(".content");
  fatherDiv.innerHTML = JSON.stringify(productList, undefined, 4);
}
