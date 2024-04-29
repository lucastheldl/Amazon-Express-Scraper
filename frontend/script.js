function fetchResults() {
  let productList = [];
  const query = document.querySelector("#searchInput").value;
  if (!query) {
    window.alert("Please type a product name!");
  }

  fetch(`http://localhost:8080/search?q=${query}`, {
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
}
